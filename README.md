
# Product Transparency Platform

A full-stack web application that collects detailed information about products through dynamic, intelligent follow-up questions and generates structured Product Transparency Reports.

## 🚀 Features

- *Dynamic Multi-step Form*: Intelligent conditional logic with AI-powered follow-up questions
- *AI-Powered Analysis*: Uses local LLMs (Ollama) for smart question generation
- *Transparency Scoring*: Comprehensive scoring algorithm for product transparency
- *PDF Report Generation*: Professional reports with recommendations
- *User Authentication*: Company-specific access with JWT tokens
- *Real-time Analysis*: Instant feedback and scoring
- *Mobile Responsive*: Clean, accessible UI design
- *Local LLM Integration*: Works with Ollama models (Llama3.2, Gemma3, DeepSeek)

## 🏗 Architecture


┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Service   │
│   React + TS    │◄──►│   Node.js       │◄──►│   FastAPI      │
│   Tailwind CSS  │    │   Express       │    │   Ollama LLM   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Database      │
                       └─────────────────┘


## 📁 Project Structure


product-transparency-platform/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── ai-service/              # Python FastAPI AI service
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── database/
│   ├── schema.sql
│   └── migrations/
├── docker-compose.yml
└── README.md


## 🛠 Tech Stack

### Frontend
- *React 18* with TypeScript
- *Tailwind CSS* for styling
- *Lucide React* for icons
- *Axios* for API calls

### Backend
- *Node.js* with Express
- *TypeScript*
- *PostgreSQL* database
- *JWT* authentication
- *PDFKit* for report generation
- *bcrypt* for password hashing

### AI Service
- *Python FastAPI*
- *Ollama* for local LLM integration
- *Pydantic* for data validation
- *asyncio* for async operations

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 13+
- Ollama installed locally

### 1. Install Ollama and Models
bash
# Install Ollama (https://ollama.ai)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull required models
ollama pull llama3.2:latest
ollama pull gemma3:latest
ollama pull deepseek-r1:1.5b


### 2. Database Setup
bash
# Create database
createdb product_transparency

# Run migrations (schema will be auto-created by backend)


### 3. Backend Setup
bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev


### 4. AI Service Setup
bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000


### 5. Frontend Setup
bash
cd frontend
npm install
npm start


## 🌐 API Endpoints

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login

### Products
- POST /api/products - Save product data
- GET /api/products - Get user products
- GET /api/products/:id - Get specific product
- POST /api/products/analyze - Analyze product transparency

### AI Service
- POST /generate-questions - Generate follow-up questions
- POST /transparency-score - Calculate transparency score
- GET /models - List available Ollama models

### Reports
- POST /api/reports/generate - Generate PDF report

## 📊 Sample Product Entry

json
{
  "name": "Organic Green Tea",
  "category": "Food & Beverage",
  "brand": "EcoTea Co.",
  "description": "Premium organic green tea from sustainable farms",
  "ingredients": "Organic green tea leaves (Camellia sinensis)",
  "certifications": ["Organic", "Fair Trade", "USDA Certified"],
  "country_of_origin": "Japan",
  "sustainability_efforts": "Carbon-neutral packaging, rainforest alliance certified"
}


## 📈 Example Transparency Report

*Product*: Organic Green Tea  
*Transparency Score*: 87/100  
*Trust Level*: Excellent  

*Recommendations*:
1. Excellent transparency! Consider highlighting this in marketing
2. Document specific sustainable farming practices
3. Include batch tracking information for full traceability

## 🤖 AI Integration

The platform uses local LLMs through Ollama for:
- *Dynamic Question Generation*: Context-aware follow-up questions
- *Content Analysis*: Understanding product categories and compliance needs
- *Recommendation Engine*: Intelligent suggestions for improvement

### Supported Models
- *Llama 3.2* (2GB) - Best for general analysis
- *Gemma 3* (3.3GB) - Excellent for detailed questioning
- *DeepSeek R1* (1.1GB) - Lightweight option

## 🎨 Design Principles

Following Altibbe's mission of *Health, Wisdom, and Virtue*:

### Health
- Clean, intuitive interface reducing cognitive load
- Accessibility-first design with proper contrast and navigation
- Mobile-responsive for universal access

### Wisdom
- AI-powered intelligent questioning
- Evidence-based transparency scoring
- Data-driven recommendations

### Virtue
- Transparent algorithms and scoring methodology
- Privacy-focused (local LLM processing)
- Ethical data handling practices

## 🔧 Development Tools Used

### AI Development Tools
- *GitHub Copilot*: Code completion and suggestions
- *Cursor AI*: Intelligent code editing
- *Local LLMs*: Ollama for privacy-focused AI processing

### Architecture Decisions
- *Microservices*: Separate AI service for scalability
- *TypeScript*: Type safety across frontend and backend
- *Local-first AI*: Privacy and data control with Ollama
- *PostgreSQL*: Robust data storage with JSONB support
- *JWT Authentication*: Stateless, scalable authentication

## 🚀 Deployment

### Using Docker Compose
bash
docker-compose up -d


### Manual Deployment
1. Deploy AI service to cloud with Ollama
2. Deploy backend to Heroku/Railway/DigitalOcean
3. Deploy frontend to Vercel/Netlify
4. Configure environment variables

## 📝 Environment Variables

### Backend (.env)
env
DATABASE_URL=postgresql://user:password@localhost:5432/product_transparency
JWT_SECRET=your-super-secret-jwt-key
AI_SERVICE_URL=http://localhost:8000
PORT=5000


### AI Service (.env)
env
OLLAMA_BASE_URL=http://localhost:11434
DEFAULT_MODEL=llama3.2:latest


### Frontend (.env)
env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AI_SERVICE_URL=http://localhost:8000


## 🧪 Testing

bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# AI service tests
cd ai-service && pytest
