<div align="center">
 
<img src="https://raw.githubusercontent.com/MK-codes365/vanisetu/main/public/logo.png" width="150" height="150" alt="Vani-Setu Logo" style="border-radius: 50%; border: 3px solid #1e3a8a; padding: 10px; background: white;">
 
 # 🎙️ Vani Setu
 
 ### *Voice Access to Government Services for Rural India*
 
 [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
 [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
 [![AWS](https://img.shields.io/badge/AWS-Cloud-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
 [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
 
 ---
 
 </div>
 
 ## ✨ Features
 
 <table>
 <tr>
 <td align="center" width="50%">
 
 ### 🎤 Multilingual Voice
 Advanced speech-to-text with auto-language detection (Hindi/English)
 
 </td>
 <td align="center" width="50%">
 
 ### 📸 Smart Document Scan
 AI-powered OCR to extract and verify identity details instantly
 
 </td>
 </tr>
 <tr>
 <td align="center" width="50%">
 
 ### 📊 Application Tracking
 Real-time dashboard to monitor your government service requests
 
 </td>
 <td align="center" width="50%">
 
 ### 🤖 Adaptive AI Guide
 Intelligent intent analysis to match citizens with the right schemes
 
 </td>
 </tr>
 <tr>
 <td align="center" width="50%">
 
 ### 🎙️ Neural TTS
 High-quality voice guidance in Hindi (Kajal) and English (Aditi)
 
 </td>
 <td align="center" width="50%">
 
 ### ⚡ Low-Bandwidth Ready
 Engineered for 2G/3G speeds common in remote rural areas
 
 </td>
 </tr>
 </table>
 
 ---
 
 ## 🏗️ Tech Stack
 
 <div align="center">
 
 | Category | Technologies |
 |----------|---------------|
 | **Frontend** | ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white) |
 | **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white) |
 | **AI & Voice** | ![Transcribe](https://img.shields.io/badge/AWS-Transcribe-FF9900?logo=amazon-aws&logoColor=white) ![Polly](https://img.shields.io/badge/AWS-Polly-FF9900?logo=amazon-aws&logoColor=white) ![Bedrock](https://img.shields.io/badge/AWS-Bedrock%20(Nova)-FF9900?logo=amazon-aws&logoColor=white) |
 | **Cloud** | ![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?logo=amazon-s3&logoColor=white) ![DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-527FFF?logo=amazondynamodb&logoColor=white) ![Textract](https://img.shields.io/badge/AWS-Textract-FF9900?logo=amazon-aws&logoColor=white) |
 
 </div>
 
 ---
 
 ## 📁 Project Structure
 
 ```
 📦 Vani Setu
 ├── 📂 src/
 │   ├── 📂 app/
 │   │   ├── 📂 api/
 │   │   │   ├── 🎙️ transcribe/        # Audio streaming to AWS
 │   │   │   ├── 🗣️ tts/               # Neural speech generation
 │   │   │   ├── 🤖 ai/analyze-intent   # Intent analysis (Nova-2)
 │   │   │   └── 💾 db/list & save      # Submission management
 │   │   ├── 📊 track/              # Application tracking dashboard
 │   │   ├── 📸 scan/               # Document capture & success flow
 │   │   └── 🏠 page.tsx            # Interactive landing page
 │   ├── 🧩 components/             # Reusable UI modules
 │   ├── 🎨 context/                # Bilingual state management
 │   └── 🛠️ lib/                    # AWS SDK configurations
 └── 📋 scripts/                    # Resource setup & diagnostics
 ```
 
 ---
 
 ## 🚀 Quick Start
 
 ### 📋 Prerequisites
 
 ```bash
 ✓ Node.js 18+
 ✓ AWS IAM User with (Transcribe, Polly, Bedrock, Textract, S3, DynamoDB) permissions
 ```
 
 ### 💻 Installation
 
 ```bash
 # 1️⃣ Clone the repository
 git clone https://github.com/MK-codes365/vanisetu.git
 cd vanisetu
 
 # 2️⃣ Install dependencies
 npm install
 
 # 3️⃣ Configure environment variables
 cp .env.example .env.local
 # Edit .env.local with your AWS credentials
 ```
 
 ### ⚙️ AWS Resources Setup
 
 ```bash
 # Initialize S3 and DynamoDB resources
 npx tsx scripts/setup-aws-resources.ts
 
 # Start development server
 npm run dev
 ```
 
 ---
 
 ## 📚 API Endpoints
 
 <table>
 <tr>
 <th>Method</th>
 <th>Endpoint</th>
 <th>Description</th>
 </tr>
 <tr>
 <td>🎙️</td>
 <td><code>POST /api/transcribe</code></td>
 <td>Real-time bilingual streaming transcription</td>
 </tr>
 <tr>
 <td>🗣️</td>
 <td><code>POST /api/tts</code></td>
 <td>Generate neural speech (Kajal/Aditi)</td>
 </tr>
 <tr>
 <td>🤖</td>
 <td><code>POST /api/ai/analyze-intent</code></td>
 <td>Nova-2 Powered Intent Understanding</td>
 </tr>
 <tr>
 <td>📄</td>
 <td><code>POST /api/ocr/extract-text</code></td>
 <td>AWS Textract Document Analysis</td>
 </tr>
 <tr>
 <td>📊</td>
 <td><code>GET /api/db/list</code></td>
 <td>Fetch user application status</td>
 </tr>
 </table>
 
 ---
 
 ## 🎨 Core Experience
 
 ### 🎤 Intelligent Voice
 > Just speak naturally. The system identifies your needs and guides you in your language.
 
 ### 📸 Zero-Form Scanning
 > Skip the paperwork. Vani Setu extracts your details directly from your identity documents.
 
 ### 📊 Real-Time Tracking
 > Clarity and trust. See exactly where your application sits in the government pipeline.
 
 ---
 
 
 <div align="center">
 
 ### Built for Rural India with ❤️ by CodeX5
 
 **[⬆ back to top](#-vani-setu)**
 
 </div>
