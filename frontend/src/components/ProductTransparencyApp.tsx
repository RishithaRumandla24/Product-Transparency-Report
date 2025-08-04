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
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
      fontFamily: 'Arial, sans-serif'
    },
    innerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 16px'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '32px'
    },
    mainTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: '16px',
      margin: '0 0 16px 0'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#666',
      marginBottom: '8px',
      margin: '0 0 8px 0'
    },
    tagline: {
      color: '#888',
      margin: '0'
    },
    progressCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '32px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    progressHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    },
    progressText: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#666'
    },
    progressBarContainer: {
      width: '100%',
      backgroundColor: '#e5e5e5',
      borderRadius: '4px',
      height: '8px'
    },
    progressBar: {
      height: '8px',
      background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
      borderRadius: '4px',
      transition: 'width 0.3s ease'
    },
    questionCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    loadingContainer: {
      textAlign: 'center' as const,
      padding: '48px 0'
    },
    loadingText: {
      fontSize: '1.25rem',
      color: '#666',
      marginTop: '16px'
    },
    questionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: '16px'
    },
    requiredText: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginBottom: '16px'
    },
    inputContainer: {
      marginBottom: '32px'
    },
    textInput: {
      width: '100%',
      padding: '16px',
      border: '2px solid #e5e5e5',
      borderRadius: '8px',
      fontSize: '1.125rem',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box' as const
    },
    select: {
      width: '100%',
      padding: '16px',
      border: '2px solid #e5e5e5',
      borderRadius: '8px',
      fontSize: '1.125rem',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box' as const,
      backgroundColor: 'white'
    },
    multiselectContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer'
    },
    checkbox: {
      width: '20px',
      height: '20px',
      accentColor: '#3b82f6'
    },
    checkboxText: {
      fontSize: '1.125rem'
    },
    radioContainer: {
      display: 'flex',
      gap: '24px'
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer'
    },
    radio: {
      width: '20px',
      height: '20px',
      accentColor: '#3b82f6'
    },
    radioText: {
      fontSize: '1.125rem'
    },
    errorContainer: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center'
    },
    errorText: {
      color: '#dc2626',
      marginLeft: '8px'
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
      padding: '12px 24px',
      color: '#666',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s',
      fontSize: '1rem'
    },
    nextButton: {
      background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
      color: 'white',
      padding: '12px 32px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'transform 0.2s',
      fontSize: '1rem',
      fontWeight: '500'
    },
    footer: {
      textAlign: 'center' as const,
      color: '#888'
    },
    reportContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)'
    },
    reportCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    reportHeader: {
      textAlign: 'center' as const,
      marginBottom: '32px'
    },
    successIcon: {
      width: '64px',
      height: '64px',
      backgroundColor: '#f0fdf4',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px'
    },
    reportTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: '8px'
    },
    reportSubtitle: {
      color: '#666'
    },
    scoreCard: {
      background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
      borderRadius: '12px',
      padding: '32px',
      color: 'white',
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    productInfo: {
      display: 'flex',
      flexDirection: 'column' as const
    },
    productName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    productMeta: {
      color: 'rgba(255, 255, 255, 0.8)'
    },
    scoreInfo: {
      textAlign: 'right' as const
    },
    scoreNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold'
    },
    scoreLabel: {
      color: 'rgba(255, 255, 255, 0.8)'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      marginBottom: '32px'
    },
    detailsCard: {
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      padding: '24px'
    },
    recommendationsCard: {
      backgroundColor: '#fefbf0',
      borderRadius: '12px',
      padding: '24px'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    detailsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    detailItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    detailLabel: {
      fontWeight: '500',
      color: '#666',
      textTransform: 'capitalize' as const,
      minWidth: '120px'
    },
    detailValue: {
      color: '#1a1a1a',
      textAlign: 'right' as const,
      flex: 1
    },
    recommendationsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px'
    },
    recommendationItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    recommendationNumber: {
      width: '24px',
      height: '24px',
      backgroundColor: '#fbbf24',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: '600',
      flexShrink: 0,
      marginTop: '2px'
    },
    recommendationText: {
      color: '#374151',
      lineHeight: '1.5'
    },
    actionsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px'
    },
    downloadButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '12px 32px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s',
      fontSize: '1rem'
    },
    newAnalysisButton: {
      backgroundColor: '#6b7280',
      color: 'white',
      padding: '12px 32px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontSize: '1rem'
    }
  };

  if (reportGenerated && reportData) {
    return (
      <div style={styles.reportContainer}>
        <div style={styles.innerContainer}>
          <div style={styles.reportCard}>
            <div style={styles.reportHeader}>
              <div style={styles.successIcon}>
                <Check size={32} color="#22c55e" />
              </div>
              <h1 style={styles.reportTitle}>
                Product Transparency Report Generated
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
            </div>

            <div style={styles.detailsGrid}>
              <div style={styles.detailsCard}>
                <h3 style={styles.cardTitle}>
                  <FileText size={20} />
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
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.recommendationsCard}>
                <h3 style={styles.cardTitle}>
                  <AlertCircle size={20} />
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
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
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
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
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
            Health • Wisdom • Virtue
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
              <Loader2 size={48} color="#3b82f6" />
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
                  onMouseOver={(e) => {
                    if (step !== 0) e.currentTarget.style.color = '#1a1a1a';
                  }}
                  onMouseOut={(e) => {
                    if (step !== 0) e.currentTarget.style.color = '#666';
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
                  onMouseOver={(e) => {
                    if (!loading) e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    if (!loading) e.currentTarget.style.transform = 'scale(1)';
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
          <p>Powered by AI-driven transparency analysis</p>
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          input:focus {
            border-color: #3b82f6 !important;
          }
          
          select:focus {
            border-color: #3b82f6 !important;
          }
          
          button:disabled {
            cursor: not-allowed !important;
          }
        `
      }} />
    </div>
  );
};

export default ProductTransparencyApp;