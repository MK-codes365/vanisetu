<div align="center">

<img src="public/vani-setu-logo.png" width="150" height="150" alt="Vani-Setu Logo" style="border-radius: 50%; border: 3px solid #1e3a8a; padding: 10px; background: white;">

# 🎙️ Vani Setu

### *Voice Access to Government Services for Rural India*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-Cloud-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

</div>

## ✨ Features

<table>
<tr>
<td align="center" width="50%">

### 🎤 Voice Interface
Accessible voice-based navigation and guidance for seamless interaction

</td>
<td align="center" width="50%">

### 📱 Document Scanning
OCR capabilities to extract text from government documents instantly

</td>
</tr>
<tr>
<td align="center" width="50%">

### 🤖 AI Intent Analysis
Intelligent understanding of user requests using Claude AI

</td>
<td align="center" width="50%">

### 🌐 Multi-Language Support
Language toggle for accessibility across different regions

</td>
</tr>
<tr>
<td align="center" width="50%">

### 📚 Learning Resources
Educational content about available government services

</td>
<td align="center" width="50%">

### ⚡ Progressive Web App
Works offline and installs like a native app

</td>
</tr>
</table>

---

## 🏗️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|---------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-API%20Routes-339933?logo=node.js&logoColor=white) |
| **Cloud** | ![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?logo=amazon-s3&logoColor=white) ![DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-527FFF?logo=amazondynamodb&logoColor=white) ![Textract](https://img.shields.io/badge/AWS-Textract-FF9900?logo=amazon-aws&logoColor=white) |
| **AI** | ![Claude](https://img.shields.io/badge/Claude-API-000000?logo=anthropic&logoColor=white) |

</div>

---

## 📁 Project Structure

```
📦 Vani Setu
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 api/
│   │   │   ├── 🤖 ai/analyze-intent
│   │   │   ├── 💾 db/save
│   │   │   ├── 📄 ocr/extract-text
│   │   │   └── 📤 upload
│   │   ├── 📖 learn/
│   │   ├── 📸 scan/
│   │   ├── 🏢 services/
│   │   ├── 🎙️ voice/
│   │   └── 🏠 page.tsx
│   ├── 🧩 components/
│   │   ├── LanguageToggle.tsx
│   │   └── VoiceGuide.tsx
│   ├── 🎨 context/
│   │   └── language-context.tsx
│   └── 🛠️ lib/
│       └── aws.ts
├── 📜 public/
├── ⚙️ scripts/
│   ├── setup-aws-resources.ts
│   ├── verify-s3.ts
│   └── full-diagnostic.ts
└── 📋 Configuration Files
```

---

## 🚀 Quick Start

### 📋 Prerequisites

```bash
✓ Node.js 18+
✓ npm or yarn
✓ AWS Account
✓ Claude API Key
```

### 💻 Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/vani-setu.git
cd vani-setu

# 2️⃣ Install dependencies
npm install

# 3️⃣ Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 🔧 Environment Setup

Create `.env.local` with the following variables:

```env
# 🌍 AWS Configuration
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# 📦 AWS Services
AWS_S3_BUCKET_NAME=vanisetu-scans-prototype
AWS_DYNAMODB_TABLE_NAME=VaniSetuSubmissions

# 🤖 AI Configuration
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### ⚙️ AWS Resources Setup

```bash
# Initialize AWS resources (S3 bucket & DynamoDB table)
npx tsx scripts/setup-aws-resources.ts

# Verify S3 setup
npx tsx scripts/verify-s3.ts

# Run full diagnostics
npx tsx scripts/full-diagnostic.ts
```

### 🎯 Development

```bash
# Start development server
npm run dev

# Open browser
# 👉 http://localhost:3000
```

---

## 📚 API Endpoints

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
<th>Status</th>
</tr>
<tr>
<td>📤</td>
<td><code>POST /api/upload</code></td>
<td>Upload and process documents</td>
<td>✅</td>
</tr>
<tr>
<td>📄</td>
<td><code>POST /api/ocr/extract-text</code></td>
<td>Extract text from images using OCR</td>
<td>✅</td>
</tr>
<tr>
<td>🤖</td>
<td><code>POST /api/ai/analyze-intent</code></td>
<td>Analyze user intent using AI</td>
<td>✅</td>
</tr>
<tr>
<td>💾</td>
<td><code>POST /api/db/save</code></td>
<td>Save submissions to DynamoDB</td>
<td>✅</td>
</tr>
</table>

---

## 🛠️ Available Scripts

```bash
npm run dev          # 🚀 Start development server
npm run build        # 🏗️ Build for production
npm start            # ▶️ Start production server
npm run lint         # 🔍 Run ESLint
npm run type-check   # ✓ TypeScript type checking
```

---

## 🎨 Features Showcase

### 🎤 Voice Interface
> Intuitive voice-based navigation designed for accessibility

### 📸 Document Scanning
> Capture and process government documents with advanced OCR

### 🤖 Smart Intent Analysis
> AI-powered understanding of user requests and needs

### 🌐 Multi-Language Support
> Seamless language switching for diverse user base

### 📱 Responsive Design
> Works perfectly on desktop, tablet, and mobile devices

### ⚡ PWA Ready
> Install as app and use offline

---

## 📊 Performance Metrics

<div align="center">

| Metric | Target | Status |
|--------|--------|--------|
| 🚀 Lighthouse Performance | > 90 | ⏳ |
| ♿ Accessibility | > 95 | ⏳ |
| 📱 Mobile Friendly | 100% | ✅ |
| 🔒 Security | A+ | ✅ |

</div>

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Contact

<div align="center">

| Channel | Link |
|---------|------|
| 📧 Email | support@vanisetu.in |
| 🐛 Issues | [GitHub Issues](https://github.com/yourusername/vani-setu/issues) |
| 💬 Discussions | [GitHub Discussions](https://github.com/yourusername/vani-setu/discussions) |

</div>

---

## 🙏 Acknowledgments

- 🇮🇳 Built for rural India
- 👥 Community-driven development
- 🤝 Open source contributors
- 💡 Inspired by accessibility principles

---

<div align="center">

### Made with ❤️ by CodeX5 For rual areas

**[⬆ back to top](#-vani-setu)**

</div>
