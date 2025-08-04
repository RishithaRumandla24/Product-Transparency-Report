<<<<<<< HEAD
# README.md
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


=======
# Product_Transparency
>>>>>>> f98e239261631cac2373a8db7b1c4840879e59ef
