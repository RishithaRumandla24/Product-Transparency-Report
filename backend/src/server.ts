// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import PDFDocument from 'pdfkit';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/product_transparency',
});

// Database schema initialization
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        data JSONB NOT NULL,
        transparency_score INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        report_data JSONB NOT NULL,
        pdf_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Types
interface Question {
  id: string;
  text: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'boolean';
  options?: string[];
  required: boolean;
}

interface ProductData {
  name: string;
  category: string;
  brand: string;
  description: string;
  [key: string]: any;
}

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// AI Service Integration
class AIService {
  private static async callLocalLLM(prompt: string): Promise<string> {
    try {
      // Using Ollama API (assuming it's running locally)
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3.2:latest', // or gemma3:latest, deepseek-r1:1.5b
        prompt: prompt,
        stream: false
      });
      
      return response.data.response;
    } catch (error) {
      console.error('Local LLM error:', error);
      // Fallback to rule-based logic
      return this.generateRuleBasedQuestions(prompt);
    }
  }

  private static generateRuleBasedQuestions(context: string): string {
    // Fallback rule-based question generation
    const questions = [
      "What is the shelf life of this product?",
      "Are there any special storage requirements?",
      "What quality control measures are in place?",
      "Are there any known side effects or warnings?",
      "What is the manufacturing process?"
    ];
    
    return JSON.stringify(questions.slice(0, 3));
  }

  static async generateFollowUpQuestions(productData: ProductData): Promise<Question[]> {
    const prompt = `
    Based on this product information:
    - Name: ${productData.name}
    - Category: ${productData.category}
    - Brand: ${productData.brand}
    - Description: ${productData.description}

    Generate 3-5 specific follow-up questions that would help assess product transparency, safety, and quality. 
    Focus on category-specific concerns and regulatory compliance.
    
    Return only a JSON array of question objects with this format:
    [{"id": "unique_id", "text": "Question text?", "type": "text|select|boolean", "required": true}]
    `;

    try {
      const response = await this.callLocalLLM(prompt);
      
      // Parse the response and convert to our Question format
      const parsedQuestions = JSON.parse(response);
      
      return parsedQuestions.map((q: any, index: number) => ({
        id: q.id || `followup_${index}`,
        text: q.text || q.question,
        type: q.type || 'text',
        required: q.required !== false,
        options: q.options
      }));
    } catch (error) {
      console.error('Question generation error:', error);
      return this.getDefaultFollowUpQuestions(productData.category);
    }
  }

  private static getDefaultFollowUpQuestions(category: string): Question[] {
    const commonQuestions: Question[] = [
      {
        id: 'manufacturing_location',
        text: 'Where is this product manufactured?',
        type: 'text',
        required: true
      },
      {
        id: 'quality_certifications',
        text: 'What quality certifications does this product have?',
        type: 'multiselect',
        options: ['ISO 9001', 'FDA Approved', 'CE Mark', 'GMP', 'HACCP', 'None'],
        required: false
      }
    ];

    const categorySpecific: { [key: string]: Question[] } = {
      'Food & Beverage': [
        {
          id: 'nutritional_info',
          text: 'Provide nutritional information per serving',
          type: 'text',
          required: true
        },
        {
          id: 'preservatives',
          text: 'Does this product contain preservatives?',
          type: 'boolean',
          required: true
        }
      ],
      'Personal Care': [
        {
          id: 'skin_tested',
          text: 'Has this product been dermatologically tested?',
          type: 'boolean',
          required: true
        },
        {
          id: 'ph_level',
          text: 'What is the pH level of this product?',
          type: 'text',
          required: false
        }
      ],
      'Electronics': [
        {
          id: 'warranty_period',
          text: 'What is the warranty period?',
          type: 'text',
          required: true
        },
        {
          id: 'environmental_compliance',
          text: 'Environmental compliance certifications?',
          type: 'multiselect',
          options: ['RoHS', 'WEEE', 'Energy Star', 'EPEAT', 'None'],
          required: false
        }
      ]
    };

    return [...commonQuestions, ...(categorySpecific[category] || [])];
  }

  static calculateTransparencyScore(productData: ProductData): number {
    let score = 0;
    const maxScore = 100;

    // Basic information completeness (40 points)
    if (productData.name && productData.name.length > 2) score += 10;
    if (productData.brand && productData.brand.length > 2) score += 10;
    if (productData.description && productData.description.length > 20) score += 10;
    if (productData.category) score += 10;

    // Ingredient/composition transparency (25 points)
    if (productData.ingredients && productData.ingredients.length > 10) score += 25;
    else if (productData.ingredients) score += 12;

    // Certifications and compliance (20 points)
    if (productData.certifications && Array.isArray(productData.certifications)) {
      score += Math.min(productData.certifications.length * 5, 20);
    }

    // Manufacturing and origin transparency (15 points)
    if (productData.country_of_origin || productData.manufacturing_location) score += 8;
    if (productData.manufacturing_date || productData.expiry_date) score += 7;

    return Math.min(score, maxScore);
  }

  static generateRecommendations(productData: ProductData, score: number): string[] {
    const recommendations: string[] = [];

    if (score < 50) {
      recommendations.push('Provide more detailed product information to improve transparency');
      recommendations.push('Consider obtaining relevant industry certifications');
    }

    if (!productData.ingredients && (productData.category === 'Food & Beverage' || productData.category === 'Personal Care')) {
      recommendations.push('Include complete ingredient list for better consumer trust');
    }

    if (!productData.certifications || (Array.isArray(productData.certifications) && productData.certifications.length === 0)) {
      recommendations.push('Obtain quality certifications relevant to your industry');
    }

    if (!productData.sustainability_efforts) {
      recommendations.push('Document and share sustainability initiatives');
    }

    if (score >= 80) {
      recommendations.push('Excellent transparency score! Consider highlighting this in marketing');
    } else if (score >= 60) {
      recommendations.push('Good transparency level. Focus on missing certifications to improve further');
    }

    return recommendations;
  }
}

// PDF Generation Service
class PDFService {
  static async generateReport(productData: ProductData, transparencyScore: number, recommendations: string[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(24).text('Product Transparency Report', 50, 50);
      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);

      // Product Information
      doc.fontSize(18).text('Product Information', 50, 120);
      doc.fontSize(12);
      let yPosition = 150;

      Object.entries(productData).forEach(([key, value]) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        
        const displayKey = key.replace(/_/g, ' ').toUpperCase();
        const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
        
        doc.text(`${displayKey}: ${displayValue}`, 50, yPosition);
        yPosition += 20;
      });

      // Transparency Score
      if (yPosition > 650) {
        doc.addPage();
        yPosition = 50;
      }

      doc.fontSize(18).text('Transparency Analysis', 50, yPosition + 30);
      doc.fontSize(14).text(`Transparency Score: ${transparencyScore}/100`, 50, yPosition + 60);

      // Score interpretation
      let interpretation = '';
      if (transparencyScore >= 80) interpretation = 'Excellent transparency';
      else if (transparencyScore >= 60) interpretation = 'Good transparency';
      else if (transparencyScore >= 40) interpretation = 'Moderate transparency';
      else interpretation = 'Needs improvement';

      doc.fontSize(12).text(`Assessment: ${interpretation}`, 50, yPosition + 85);

      // Recommendations
      doc.fontSize(18).text('Recommendations', 50, yPosition + 120);
      doc.fontSize(12);

      recommendations.forEach((rec, index) => {
        if (yPosition > 650) {
          doc.addPage();
          yPosition = 50;
        }
        doc.text(`${index + 1}. ${rec}`, 50, yPosition + 150 + (index * 20));
      });

      doc.end();
    });
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, companyName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, company_name) VALUES ($1, $2, $3) RETURNING id, email, company_name',
      [email, passwordHash, companyName]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.rows[0].id, email: result.rows[0].email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, company_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        company_name: user.company_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate follow-up questions
app.post('/api/questions/generate', async (req, res) => {
  try {
    const { productData } = req.body;

    if (!productData || !productData.name || !productData.category) {
      return res.status(400).json({ error: 'Product name and category are required' });
    }

    const questions = await AIService.generateFollowUpQuestions(productData);

    res.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Calculate transparency score
app.post('/api/products/analyze', async (req, res) => {
  try {
    const { productData } = req.body;

    if (!productData) {
      return res.status(400).json({ error: 'Product data is required' });
    }

    const transparencyScore = AIService.calculateTransparencyScore(productData);
    const recommendations = AIService.generateRecommendations(productData, transparencyScore);

    res.json({
      success: true,
      transparencyScore,
      recommendations,
      analysis: {
        completeness: transparencyScore >= 70 ? 'High' : transparencyScore >= 40 ? 'Medium' : 'Low',
        trustLevel: transparencyScore >= 80 ? 'Excellent' : transparencyScore >= 60 ? 'Good' : 'Needs Improvement'
      }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze product' });
  }
});

// Save product
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { productData } = req.body;
    const userId = req.user.userId;

    if (!productData) {
      return res.status(400).json({ error: 'Product data is required' });
    }

    const transparencyScore = AIService.calculateTransparencyScore(productData);

    const result = await pool.query(
      `INSERT INTO products (user_id, name, brand, category, description, data, transparency_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [
        userId,
        productData.name,
        productData.brand,
        productData.category,
        productData.description,
        JSON.stringify(productData),
        transparencyScore
      ]
    );

    res.status(201).json({
      success: true,
      productId: result.rows[0].id,
      transparencyScore,
      createdAt: result.rows[0].created_at
    });
  } catch (error) {
    console.error('Save product error:', error);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// Get user products
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT id, name, brand, category, description, transparency_score, created_at, updated_at
       FROM products
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      products: result.rows
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Generate and download PDF report
app.post('/api/reports/generate', async (req, res) => {
  try {
    const { productData, transparencyScore, recommendations } = req.body;

    if (!productData || transparencyScore === undefined) {
      return res.status(400).json({ error: 'Product data and transparency score are required' });
    }

    const pdfBuffer = await PDFService.generateReport(
      productData,
      transparencyScore,
      recommendations || []
    );

    // Save report to database if user is authenticated
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        
        // Save to database (optional)
        await pool.query(
          `INSERT INTO reports (product_id, report_data) VALUES (NULL, $1)`,
          [JSON.stringify({ productData, transparencyScore, recommendations })]
        );
      } catch (authError) {
        // Continue without saving if auth fails
        console.log('Could not save report to database - user not authenticated');
      }
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${productData.name}_transparency_report.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

// Get product details
app.get('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT * FROM products WHERE id = $1 AND user_id = $2`,
      [productId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
};

startServer().catch(console.error);

export default app;