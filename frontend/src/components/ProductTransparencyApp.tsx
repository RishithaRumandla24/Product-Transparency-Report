import React, { useState, useEffect } from 'react';

// Simple icon components to replace lucide-react
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const Download = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7,10 12,15 17,10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const Check = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

const AlertCircle = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Loader2 = ({ size = 20, color = "currentColor", style = {} }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2"
    style={{ ...style, animation: 'spin 1s linear infinite' }}
  >
    <path d="M21,12a9,9 0 1,1-6.219-8.56"></path>
  </svg>
);

const FileText = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>
);

const Sparkles = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/>
    <path d="M20 3v4"/>
    <path d="M22 5h-4"/>
    <path d="M4 17v2"/>
    <path d="M5 18H3"/>
  </svg>
);

const Shield = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

interface Question {
  id: string;
  text: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'boolean';
  options?: string[];
  required: boolean;
}

interface FormData {
  [key: string]: any;
}

interface ProductData {
  name: string;
  category: string;
  brand: string;
  description: string;
  ingredients?: string;
  certifications?: string[];
  country_of_origin?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  [key: string]: any;
}

const ProductTransparencyApp: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  // Initial product questions
  const initialQuestions: Question[] = [
    {
      id: 'name',
      text: 'What is the product name?',
      type: 'text',
      required: true
    },
    {
      id: 'category',
      text: 'Select the product category',
      type: 'select',
      options: ['Food & Beverage', 'Personal Care', 'Household', 'Electronics', 'Clothing', 'Other'],
      required: true
    },
    {
      id: 'brand',
      text: 'What is the brand name?',
      type: 'text',
      required: true
    },
    {
      id: 'description',
      text: 'Provide a brief product description',
      type: 'text',
      required: true
    }
  ];

  useEffect(() => {
    setQuestions(initialQuestions);
  }, []);

  // Simulate API calls (in real implementation, these would call your backend)
  const generateFollowUpQuestions = async (currentData: FormData): Promise<Question[]> => {
    setLoading(true);
    try {
      // Simulate AI-powered question generation based on current form data
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const followUpQuestions: Question[] = [];
      
      if (currentData.category === 'Food & Beverage') {
        followUpQuestions.push(
          {
            id: 'ingredients',
            text: 'List all ingredients (separated by commas)',
            type: 'text',
            required: true
          },
          {
            id: 'allergens',
            text: 'Does this product contain any allergens?',
            type: 'multiselect',
            options: ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'None'],
            required: true
          },
          {
            id: 'organic',
            text: 'Is this product organic certified?',
            type: 'boolean',
            required: true
          }
        );
      } else if (currentData.category === 'Personal Care') {
        followUpQuestions.push(
          {
            id: 'ingredients',
            text: 'List key ingredients',
            type: 'text',
            required: true
          },
          {
            id: 'skin_type',
            text: 'Suitable for which skin types?',
            type: 'multiselect',
            options: ['Normal', 'Dry', 'Oily', 'Sensitive', 'Combination', 'All Types'],
            required: true
          },
          {
            id: 'cruelty_free',
            text: 'Is this product cruelty-free?',
            type: 'boolean',
            required: true
          }
        );
      }
      
      // Add common questions for all categories
      followUpQuestions.push(
        {
          id: 'country_of_origin',
          text: 'Country of origin/manufacture',
          type: 'text',
          required: true
        },
        {
          id: 'certifications',
          text: 'Any certifications or quality marks?',
          type: 'multiselect',
          options: ['ISO', 'FDA Approved', 'CE Mark', 'Fair Trade', 'Eco-Friendly', 'None'],
          required: false
        },
        {
          id: 'sustainability_efforts',
          text: 'Describe any sustainability efforts',
          type: 'text',
          required: false
        }
      );
      
      return followUpQuestions;
    } catch (error) {
      console.error('Error generating questions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateTransparencyReport = async (data: FormData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate report generation
      
      // Calculate transparency score (simplified logic)
      let score = 0;
      const totalPossibleScore = 100;
      
      // Basic info completeness (40 points)
      if (data.name) score += 10;
      if (data.brand) score += 10;
      if (data.description) score += 10;
      if (data.category) score += 10;
      
      // Ingredient/composition transparency (30 points)
      if (data.ingredients && data.ingredients.length > 10) score += 30;
      else if (data.ingredients) score += 15;
      
      // Certifications and compliance (20 points)
      if (data.certifications && data.certifications.length > 0) score += 20;
      
      // Sustainability and ethics (10 points)
      if (data.sustainability_efforts) score += 5;
      if (data.organic === true || data.cruelty_free === true) score += 5;
      
      const report = {
        score: Math.min(score, totalPossibleScore),
        productData: data,
        recommendations: generateRecommendations(data, score),
        timestamp: new Date().toISOString()
      };
      
      setReportData(report);
      setReportGenerated(true);
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (data: FormData, score: number): string[] => {
    const recommendations: string[] = [];
    
    if (score < 50) {
      recommendations.push('Consider providing more detailed ingredient information');
      recommendations.push('Add relevant certifications to build consumer trust');
    }
    
    if (!data.sustainability_efforts) {
      recommendations.push('Document sustainability initiatives to improve transparency');
    }
    
    if (!data.certifications || data.certifications.length === 0) {
      recommendations.push('Obtain relevant industry certifications');
    }
    
    if (score >= 80) {
      recommendations.push('Excellent transparency! Consider showcasing this as a competitive advantage');
    }
    
    return recommendations;
  };

  const handleInputChange = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = async () => {
    const currentQuestion = questions[step];
    if (currentQuestion.required && !formData[currentQuestion.id]) {
      setError('This field is required');
      return;
    }
    
    setError(null);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Check if we need to generate follow-up questions
      if (questions.length === initialQuestions.length) {
        const followUpQuestions = await generateFollowUpQuestions(formData);
        if (followUpQuestions.length > 0) {
          setQuestions([...questions, ...followUpQuestions]);
          setStep(step + 1);
        } else {
          // Generate report
          await generateTransparencyReport(formData);
        }
      } else {
        // Generate report
        await generateTransparencyReport(formData);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
      setError(null);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;
    
    // Simulate PDF download (in real implementation, this would call your backend)
    const reportContent = `
Product Transparency Report
==========================

Product: ${reportData.productData.name}
Brand: ${reportData.productData.brand}
Category: ${reportData.productData.category}
Transparency Score: ${reportData.score}/100

Generated on: ${new Date(reportData.timestamp).toLocaleDateString()}

--- Product Details ---
${Object.entries(reportData.productData)
  .map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}: ${Array.isArray(value) ? value.join(', ') : value}`)
  .join('\n')}

--- Recommendations ---
${reportData.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.productData.name}_transparency_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderQuestion = (question: Question) => {
    const value = formData[question.id];
    
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            style={styles.textInput}
            placeholder="Enter your answer..."
            required={question.required}
          />
        );
      
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            style={styles.select}
            required={question.required}
          >
            <option value="">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'multiselect':
        return (
          <div style={styles.multiselectContainer}>
            {question.options?.map((option) => (
              <label key={option} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentArray = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleInputChange(question.id, [...currentArray, option]);
                    } else {
                      handleInputChange(question.id, currentArray.filter(v => v !== option));
                    }
                  }}
                  style={styles.checkbox}
                />
                <span style={styles.checkboxText}>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'boolean':
        return (
          <div style={styles.radioContainer}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name={question.id}
                checked={value === true}
                onChange={() => handleInputChange(question.id, true)}
                style={styles.radio}
              />
              <span style={styles.radioText}>Yes</span>
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name={question.id}
                checked={value === false}
                onChange={() => handleInputChange(question.id, false)}
                style={styles.radio}
              />
              <span style={styles.radioText}>No</span>
            </label>
          </div>
        );
      
      default:
        return null;
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: 'relative' as const,
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
      `,
      pointerEvents: 'none' as const
    },
    innerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 16px',
      position: 'relative' as const,
      zIndex: 1
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '48px',
      color: 'white'
    },
    mainTitle: {
      fontSize: '3.5rem',
      fontWeight: '800',
      background: 'linear-gradient(45deg, #ffffff, #f0f8ff)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '16px',
      margin: '0 0 16px 0',
      textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      letterSpacing: '-0.02em'
    },
    subtitle: {
      fontSize: '1.5rem',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '12px',
      margin: '0 0 12px 0',
      fontWeight: '400'
    },
    tagline: {
      color: 'rgba(255, 255, 255, 0.7)',
      margin: '0',
      fontSize: '1.1rem',
      fontStyle: 'italic',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    progressCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    progressText: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)'
    },
    progressBarContainer: {
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      height: '12px',
      overflow: 'hidden'
    },
    progressBar: {
      height: '12px',
      background: 'linear-gradient(90deg, #ff6b6b 0%, #ffa726 50%, #66bb6a 100%)',
      borderRadius: '12px',
      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
    },
    questionCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '48px',
      marginBottom: '32px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
      transform: 'translateY(0)',
      transition: 'all 0.3s ease'
    },
    loadingContainer: {
      textAlign: 'center' as const,
      padding: '64px 0',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '24px'
    },
    loadingText: {
      fontSize: '1.25rem',
      color: '#666',
      fontWeight: '500'
    },
    questionTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '24px',
      lineHeight: '1.2'
    },
    requiredText: {
      color: '#ef4444',
      fontSize: '0.9rem',
      marginBottom: '24px',
      fontWeight: '500'
    },
    inputContainer: {
      marginBottom: '40px'
    },
    textInput: {
      width: '100%',
      padding: '20px 24px',
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      fontSize: '1.125rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      fontFamily: 'inherit'
    },
    select: {
      width: '100%',
      padding: '20px 24px',
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      fontSize: '1.125rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      fontFamily: 'inherit',
      cursor: 'pointer'
    },
    multiselectContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      padding: '16px'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      padding: '12px 16px',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      backgroundColor: 'rgba(248, 250, 252, 0.8)',
      border: '1px solid rgba(226, 232, 240, 0.5)'
    },
    checkbox: {
      width: '20px',
      height: '20px',
      accentColor: '#667eea',
      cursor: 'pointer'
    },
    checkboxText: {
      fontSize: '1.1rem',
      fontWeight: '500',
      color: '#374151'
    },
    radioContainer: {
      display: 'flex',
      gap: '32px',
      justifyContent: 'center'
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      padding: '16px 32px',
      borderRadius: '16px',
      transition: 'all 0.2s ease',
      backgroundColor: 'rgba(248, 250, 252, 0.8)',
      border: '2px solid rgba(226, 232, 240, 0.5)',
      minWidth: '120px',
      justifyContent: 'center'
    },
    radio: {
      width: '20px',
      height: '20px',
      accentColor: '#667eea',
      cursor: 'pointer'
    },
    radioText: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#374151'
    },
    errorContainer: {
      backgroundColor: '#fef2f2',
      border: '2px solid #fecaca',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(239, 68, 68, 0.1)'
    },
    errorText: {
      color: '#dc2626',
      marginLeft: '12px',
      fontWeight: '500'
    },
    navigationContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    prevButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 32px',
      color: '#6b7280',
      backgroundColor: 'transparent',
      border: '2px solid rgba(107, 114, 128, 0.2)',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      fontWeight: '500'
    },
    nextButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '16px 40px',
      borderRadius: '16px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      fontWeight: '600',
      boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
    },
    footer: {
      textAlign: 'center' as const,
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '1rem'
    },
    reportContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    reportCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '48px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
    },
    reportHeader: {
      textAlign: 'center' as const,
      marginBottom: '48px'
    },
    successIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
    },
    reportTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#1a1a1a',
      marginBottom: '12px',
      lineHeight: '1.2'
    },
    reportSubtitle: {
      color: '#6b7280',
      fontSize: '1.2rem'
    },
    scoreCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      padding: '40px',
      color: 'white',
      marginBottom: '40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    productInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      flex: 1
    },
    productName: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '8px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    productMeta: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '1.1rem'
    },
    scoreInfo: {
      textAlign: 'right' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-end'
    },
    scoreNumber: {
      fontSize: '4rem',
      fontWeight: '900',
      lineHeight: '1',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    scoreLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '1.1rem',
      marginTop: '4px'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '32px',
      marginBottom: '40px'
    },
    detailsCard: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s ease'
    },
    recommendationsCard: {
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(251, 191, 36, 0.2)',
      boxShadow: '0 4px 6px rgba(251, 191, 36, 0.1)',
      transition: 'transform 0.2s ease'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#1f2937'
    },
    detailsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px'
    },
    detailItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '12px 0',
      borderBottom: '1px solid rgba(226, 232, 240, 0.5)'
    },
    detailLabel: {
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'capitalize' as const,
      minWidth: '140px',
      fontSize: '0.95rem'
    },
    detailValue: {
      color: '#1f2937',
      textAlign: 'right' as const,
      flex: 1,
      fontWeight: '500'
    },
    recommendationsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px'
    },
    recommendationItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      padding: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '12px',
      border: '1px solid rgba(251, 191, 36, 0.2)'
    },
    recommendationNumber: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.9rem',
      fontWeight: '700',
      color: 'white',
      flexShrink: 0,
      boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
    },
    recommendationText: {
      color: '#374151',
      lineHeight: '1.6',
      fontSize: '1rem'
    },
    actionsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap' as const
    },
    downloadButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      padding: '16px 40px',
      borderRadius: '16px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.3s ease',
      fontSize: '1.1rem',
      fontWeight: '600',
      boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
    },
    newAnalysisButton: {
      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      color: 'white',
      padding: '16px 40px',
      borderRadius: '16px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1.1rem',
      fontWeight: '600',
      boxShadow: '0 8px 16px rgba(107, 114, 128, 0.3)'
    }
  };

  if (reportGenerated && reportData) {
    return (
      <div style={styles.reportContainer}>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.innerContainer}>
          <div style={styles.reportCard}>
            <div style={styles.reportHeader}>
              <div style={styles.successIcon}>
                <Check size={40} color="white" />
              </div>
              <h1 style={styles.reportTitle}>
                Transparency Report Generated
              </h1>
              <p style={styles.reportSubtitle}>Your comprehensive product analysis is ready</p>
            </div>

            <div style={styles.scoreCard}>
              <div style={styles.productInfo}>
                <h2 style={styles.productName}>{reportData.productData.name}</h2>
                <p style={styles.productMeta}>{reportData.productData.brand} • {reportData.productData.category}</p>
              </div>
              <div style={styles.scoreInfo}>
                <div style={styles.scoreNumber}>{reportData.score}%</div>
                <div style={styles.scoreLabel}>Transparency Score</div>
              </div>
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: '0.1'
              }}>
                <Shield size={60} />
              </div>
            </div>

            <div style={styles.detailsGrid}>
              <div 
                style={styles.detailsCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={styles.cardTitle}>
                  <FileText size={24} />
                  Product Details
                </h3>
                <div style={styles.detailsList}>
                  {Object.entries(reportData.productData).slice(0, 6).map(([key, value]) => (
                    <div key={key} style={styles.detailItem}>
                      <span style={styles.detailLabel}>
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span style={styles.detailValue}>
                        {Array.isArray(value) ? value.join(', ') : String(value).substring(0, 30)}
                        {String(value).length > 30 ? '...' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                style={styles.recommendationsCard}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={styles.cardTitle}>
                  <Sparkles size={24} />
                  Recommendations
                </h3>
                <div style={styles.recommendationsList}>
                  {reportData.recommendations.map((rec: string, index: number) => (
                    <div key={index} style={styles.recommendationItem}>
                      <span style={styles.recommendationNumber}>
                        {index + 1}
                      </span>
                      <span style={styles.recommendationText}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.actionsContainer}>
              <button
                onClick={downloadReport}
                style={styles.downloadButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.3)';
                }}
              >
                <Download />
                <span>Download Report</span>
              </button>
              <button
                onClick={() => {
                  setStep(0);
                  setFormData({});
                  setQuestions(initialQuestions);
                  setReportGenerated(false);
                  setReportData(null);
                }}
                style={styles.newAnalysisButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(107, 114, 128, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(107, 114, 128, 0.3)';
                }}
              >
                New Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.innerContainer}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>
            Product Transparency Platform
          </h1>
          <p style={styles.subtitle}>
            Building trust through intelligent transparency analysis
          </p>
          <p style={styles.tagline}>
            <Shield size={20} />
            Health • Wisdom • Virtue
            <Sparkles size={20} />
          </p>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <span style={styles.progressText}>
              Question {step + 1} of {questions.length}
            </span>
            <span style={styles.progressText}>
              {Math.round(((step + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
          <div style={styles.progressBarContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${((step + 1) / questions.length) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div style={styles.questionCard}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <Loader2 size={48} color="#667eea" />
              <p style={styles.loadingText}>
                {step < initialQuestions.length ? 
                  'Generating intelligent follow-up questions...' : 
                  'Creating your transparency report...'
                }
              </p>
            </div>
          ) : (
            <>
              <div>
                <h2 style={styles.questionTitle}>
                  {questions[step]?.text}
                </h2>
                {questions[step]?.required && (
                  <p style={styles.requiredText}>* Required field</p>
                )}
              </div>

              <div style={styles.inputContainer}>
                {questions[step] && renderQuestion(questions[step])}
              </div>

              {error && (
                <div style={styles.errorContainer}>
                  <AlertCircle size={20} color="#dc2626" />
                  <span style={styles.errorText}>{error}</span>
                </div>
              )}

              <div style={styles.navigationContainer}>
                <button
                  onClick={handlePrevious}
                  disabled={step === 0}
                  style={{
                    ...styles.prevButton,
                    opacity: step === 0 ? 0.5 : 1,
                    cursor: step === 0 ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (step !== 0) {
                      e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.4)';
                      e.currentTarget.style.color = '#374151';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (step !== 0) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(107, 114, 128, 0.2)';
                      e.currentTarget.style.color = '#6b7280';
                    }
                  }}
                >
                  <ChevronLeft />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={loading}
                  style={{
                    ...styles.nextButton,
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                >
                  <span>
                    {step === questions.length - 1 ? 'Generate Report' : 'Next'}
                  </span>
                  <ChevronRight />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>✨ Powered by AI-driven transparency analysis ✨</p>
        </div>
      </div>

      {/* CSS Animations and Hover Effects */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          input:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            transform: scale(1.02);
          }
          
          select:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            transform: scale(1.02);
          }
          
          button:disabled {
            cursor: not-allowed !important;
          }
          
          label:hover {
            background-color: rgba(102, 126, 234, 0.05) !important;
            border-color: rgba(102, 126, 234, 0.2) !important;
            transform: translateY(-1px);
          }
          
          input[type="radio"]:checked + span {
            color: #667eea !important;
            font-weight: 700 !important;
          }
          
          input[type="checkbox"]:checked + span {
            color: #667eea !important;
            font-weight: 600 !important;
          }
          
          .question-card-hover:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
        `
      }} />
    </div>
  );
};

export default ProductTransparencyApp;