# ai-service/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import requests
import json
import re
import logging
from datetime import datetime
import os
import asyncio
import aiohttp
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Product Transparency AI Service", version="1.0.0")

# Models
class ProductData(BaseModel):
    name: str
    category: str
    brand: str
    description: str
    ingredients: Optional[str] = None
    certifications: Optional[List[str]] = None
    country_of_origin: Optional[str] = None
    manufacturing_date: Optional[str] = None
    expiry_date: Optional[str] = None

class Question(BaseModel):
    id: str
    text: str
    type: str  # 'text', 'select', 'multiselect', 'boolean', 'number'
    options: Optional[List[str]] = None
    required: bool = True

class QuestionRequest(BaseModel):
    product_data: ProductData

class ScoreRequest(BaseModel):
    product_data: Dict[str, Any]

class TransparencyResponse(BaseModel):
    score: int
    recommendations: List[str]
    analysis: Dict[str, str]

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "gemini-2.0-flash")

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY not found in environment variables")

class GeminiService:
    """Service to interact with Google Gemini API"""
    
    @staticmethod
    async def generate_completion(prompt: str, model: str = DEFAULT_MODEL) -> str:
        """Generate completion using Gemini API"""
        try:
            if not GEMINI_API_KEY:
                logger.error("Gemini API key not configured")
                return ""
            
            # Initialize the model
            gemini_model = genai.GenerativeModel(model)
            
            # Generate content
            response = await asyncio.to_thread(
                gemini_model.generate_content, 
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    top_p=0.9,
                    max_output_tokens=1000,
                )
            )
            
            return response.text if response.text else ""
            
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            return ""

    @staticmethod
    def is_available() -> bool:
        """Check if Gemini API is available"""
        try:
            if not GEMINI_API_KEY:
                return False
            
            # Try to list models to check if API key is valid
            models = genai.list_models()
            return True
        except Exception as e:
            logger.error(f"Gemini API availability check failed: {e}")
            return False

class QuestionGenerator:
    """Generate intelligent follow-up questions based on product data"""
    
    def _init_(self):
        self.category_templates = {
            "Food & Beverage": [
                "What are the complete ingredients and their proportions?",
                "What allergens are present in this product?",
                "What is the nutritional information per serving?",
                "Are there any preservatives or artificial additives?",
                "What is the shelf life and storage requirements?",
                "Is this product organic or contains GMOs?",
                "What food safety certifications does it have?"
            ],
            "Personal Care": [
                "What are the active ingredients and their concentrations?",
                "Is this product suitable for sensitive skin?",
                "Has this product been dermatologically tested?",
                "What is the pH level of this product?",
                "Are there any known side effects or contraindications?",
                "Is this product cruelty-free and vegan?",
                "What regulatory approvals does it have?"
            ],
            "Electronics": [
                "What are the technical specifications?",
                "What safety certifications does this product have?",
                "What is the warranty period and coverage?",
                "What materials are used in construction?",
                "Does it comply with environmental regulations?",
                "What is the expected lifespan?",
                "Are replacement parts available?"
            ],
            "Household": [
                "What cleaning agents or chemicals are used?",
                "Is this product safe for children and pets?",
                "What environmental impact does it have?",
                "What safety precautions should be taken?",
                "How should this product be disposed of?",
                "What certifications for safety does it have?"
            ]
        }

    async def generate_ai_questions(self, product_data: ProductData) -> List[Question]:
        """Generate questions using AI"""
        prompt = f"""
Based on this product information, generate 3-5 specific, detailed follow-up questions that would help assess product transparency, safety, and regulatory compliance:

Product Name: {product_data.name}
Category: {product_data.category}
Brand: {product_data.brand}
Description: {product_data.description}

Requirements:
1. Questions should be specific to the product category
2. Focus on transparency, safety, and quality aspects
3. Include regulatory and compliance aspects
4. Make questions actionable and measurable
5. Return ONLY a JSON array format

Example format:
[{{"id": "ingredients_detail", "text": "Provide detailed ingredient list with percentages", "type": "text", "required": true}}, {{"id": "safety_testing", "text": "Has this product undergone safety testing?", "type": "boolean", "required": true}}]
"""

        if GeminiService.is_available():
            try:
                response = await GeminiService.generate_completion(prompt)
                
                # Extract JSON from response
                json_match = re.search(r'\[.*\]', response, re.DOTALL)
                if json_match:
                    questions_data = json.loads(json_match.group())
                    
                    questions = []
                    for i, q_data in enumerate(questions_data[:5]):  # Limit to 5 questions
                        question = Question(
                            id=q_data.get("id", f"ai_question_{i}"),
                            text=q_data.get("text", ""),
                            type=q_data.get("type", "text"),
                            options=q_data.get("options"),
                            required=q_data.get("required", True)
                        )
                        questions.append(question)
                    
                    return questions
            except Exception as e:
                logger.error(f"AI question generation error: {e}")
        
        # Fallback to template-based questions
        return self.generate_template_questions(product_data)

    def generate_template_questions(self, product_data: ProductData) -> List[Question]:
        """Generate questions using predefined templates"""
        category = product_data.category
        template_questions = self.category_templates.get(category, [])
        
        questions = []
        
        # Add category-specific questions
        for i, q_text in enumerate(template_questions[:3]):
            questions.append(Question(
                id=f"template_{category.lower().replace(' ', '')}{i}",
                text=q_text,
                type="text",
                required=True
            ))
        
        # Add common questions
        common_questions = [
            Question(
                id="manufacturing_location",
                text="Where is this product manufactured?",
                type="text",
                required=True
            ),
            Question(
                id="quality_certifications",
                text="What quality certifications does this product have?",
                type="multiselect",
                options=["ISO 9001", "FDA Approved", "CE Mark", "GMP", "HACCP", "Other", "None"],
                required=False
            )
        ]
        
        questions.extend(common_questions)
        return questions

class TransparencyScorer:
    """Calculate transparency scores and generate recommendations"""
    
    def _init_(self):
        self.scoring_weights = {
            "basic_info": 30,
            "detailed_composition": 25,
            "certifications": 20,
            "manufacturing_info": 15,
            "sustainability": 10
        }

    def calculate_score(self, product_data: Dict[str, Any]) -> int:
        """Calculate transparency score based on product data"""
        score = 0
        max_score = 100
        
        # Basic information completeness (30 points)
        basic_fields = ["name", "brand", "category", "description"]
        basic_score = sum(10 if product_data.get(field) and len(str(product_data[field])) > 2 
                         else 0 for field in basic_fields[:3])
        basic_score += 10 if product_data.get("description") and len(product_data["description"]) > 20 else 0
        score += min(basic_score, self.scoring_weights["basic_info"])
        
        # Detailed composition (25 points)
        composition_score = 0
        if product_data.get("ingredients"):
            ingredient_length = len(str(product_data["ingredients"]))
            if ingredient_length > 100:
                composition_score += 25
            elif ingredient_length > 50:
                composition_score += 15
            elif ingredient_length > 10:
                composition_score += 10
        
        score += min(composition_score, self.scoring_weights["detailed_composition"])
        
        # Certifications (20 points)
        cert_score = 0
        certifications = product_data.get("certifications", [])
        if isinstance(certifications, list) and certifications:
            cert_score = min(len(certifications) * 5, 20)
        elif certifications and certifications != "None":
            cert_score = 10
        
        score += cert_score
        
        # Manufacturing information (15 points)
        manufacturing_fields = ["country_of_origin", "manufacturing_location", "manufacturing_date"]
        manufacturing_score = sum(5 if product_data.get(field) else 0 
                                for field in manufacturing_fields)
        score += min(manufacturing_score, self.scoring_weights["manufacturing_info"])
        
        # Sustainability efforts (10 points)
        sustainability_fields = ["sustainability_efforts", "organic", "cruelty_free", "eco_friendly"]
        sustainability_score = sum(2.5 if product_data.get(field) else 0 
                                 for field in sustainability_fields)
        score += min(sustainability_score, self.scoring_weights["sustainability"])
        
        return min(int(score), max_score)

    def generate_recommendations(self, product_data: Dict[str, Any], score: int) -> List[str]:
        """Generate recommendations based on product data and score"""
        recommendations = []
        
        # Score-based recommendations
        if score < 40:
            recommendations.append("Critical: Significantly improve product information transparency")
            recommendations.append("Provide detailed ingredient/component information")
            recommendations.append("Obtain basic industry certifications")
        elif score < 60:
            recommendations.append("Moderate: Add more detailed product specifications")
            recommendations.append("Consider obtaining additional quality certifications")
        elif score < 80:
            recommendations.append("Good: Focus on sustainability documentation")
            recommendations.append("Highlight existing certifications more prominently")
        else:
            recommendations.append("Excellent transparency! Consider using this as a marketing advantage")
        
        # Specific field recommendations
        if not product_data.get("ingredients") and product_data.get("category") in ["Food & Beverage", "Personal Care"]:
            recommendations.append("Add complete ingredient list for better consumer trust")
        
        if not product_data.get("certifications") or product_data.get("certifications") == ["None"]:
            recommendations.append("Obtain relevant industry certifications (ISO, FDA, etc.)")
        
        if not product_data.get("sustainability_efforts"):
            recommendations.append("Document environmental and sustainability initiatives")
        
        if not product_data.get("country_of_origin") and not product_data.get("manufacturing_location"):
            recommendations.append("Provide manufacturing location and origin information")
        
        return recommendations[:5]  # Limit to 5 recommendations

# Initialize services
question_generator = QuestionGenerator()
transparency_scorer = TransparencyScorer()

# API Routes
@app.get("/")
async def root():
    return {
        "service": "Product Transparency AI Service",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat(),
        "gemini_available": GeminiService.is_available()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_status": "available" if GeminiService.is_available() else "unavailable",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/generate-questions", response_model=List[Question])
async def generate_questions(request: QuestionRequest):
    """Generate intelligent follow-up questions based on product data"""
    try:
        questions = await question_generator.generate_ai_questions(request.product_data)
        return questions
    except Exception as e:
        logger.error(f"Question generation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate questions")

@app.post("/transparency-score", response_model=TransparencyResponse)
async def calculate_transparency_score(request: ScoreRequest):
    """Calculate transparency score and generate recommendations"""
    try:
        score = transparency_scorer.calculate_score(request.product_data)
        recommendations = transparency_scorer.generate_recommendations(request.product_data, score)
        
        # Generate analysis
        if score >= 80:
            trust_level = "Excellent"
            completeness = "High"
        elif score >= 60:
            trust_level = "Good" 
            completeness = "Medium-High"
        elif score >= 40:
            trust_level = "Fair"
            completeness = "Medium"
        else:
            trust_level = "Needs Improvement"
            completeness = "Low"
            
        analysis = {
            "trust_level": trust_level,
            "completeness": completeness,
            "category_compliance": "Compliant" if score >= 50 else "Needs Review"
        }
        
        return TransparencyResponse(
            score=score,
            recommendations=recommendations,
            analysis=analysis
        )
    except Exception as e:
        logger.error(f"Scoring error: {e}")
        raise HTTPException(status_code=500, detail="Failed to calculate transparency score")

@app.get("/models")
async def list_available_models():
    """List available Gemini models"""
    if not GeminiService.is_available():
        raise HTTPException(status_code=503, detail="Gemini API service not available")
    
    try:
        models = genai.list_models()
        model_list = []
        for model in models:
            model_list.append({
                "name": model.name,
                "display_name": model.display_name,
                "description": getattr(model, 'description', ''),
                "supported_generation_methods": getattr(model, 'supported_generation_methods', [])
            })
        return {"models": model_list}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Error fetching models: {e}")

if __name__ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)