# Grama Sahayya AI 🌾

**An AI-powered multilingual assistant for government welfare schemes and public services.**

Grama Sahayya AI helps citizens discover government schemes, understand eligibility requirements, and find information about public services through a simple, accessible interface supporting Telugu and English.

🌐 **Live Demo:** https://grama-sahayya-ai.onrender.com  
💻 **GitHub Repository:** https://github.com/darsan-0/grama-sahayya-ai

## ✨ Features

- **Multilingual AI assistance:** Ask questions in Telugu or English.
- **Government scheme discovery:** Explore welfare schemes and related eligibility information.
- **Public services information:** Find guidance on available government services.
- **Voice assistance:** Use voice-related controls provided by the application.
- **Simple user interface:** Designed to make public-service information easier to understand.
- **Google Sign-In:** Sign in using Google authentication.
- **AI-powered responses:** Uses the Google Gemini API for conversational assistance.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express.js
- **AI:** Google Gemini API
- **Authentication and database:** Firebase
- **Deployment:** Render
- **Version control:** Git and GitHub

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A Google Gemini API key
- Firebase project configuration

### 1. Clone the repository

```bash
git clone https://github.com/darsan-0/grama-sahayya-ai.git
cd grama-sahayya-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

```dotenv
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

Use the actual port configured by your application. Configure Firebase using the project's existing Firebase configuration.

**Security:** Never commit your `.env` file, API keys, service-account credentials, or other secrets to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal.

### 5. Build for production

```bash
npm run build
```

## 📁 Project Structure

```text
grama-sahayya-ai/
├── src/                    # Frontend application
├── tests/                  # Tests
├── server.ts               # Express server
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules          # Firestore security rules
├── .env.example             # Environment variable template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔐 Authentication and Configuration

The application uses Firebase for authentication and database-related functionality. Authentication providers and authorized domains must be configured in the Firebase Console.

Provide your Gemini API key through environment variables in local development and your deployment platform. Do not expose server-side secrets in frontend code.

## ⚠️ Important Disclaimer

Grama Sahayya AI provides informational guidance, not an official government decision or guarantee of eligibility. Scheme availability, eligibility criteria, benefits, application procedures, and deadlines may change. Users should verify information through the relevant official government websites or departments before applying.

## 🎯 Project Goal

To make government welfare and public-service information easier to discover and understand, especially for citizens who prefer communicating in their regional language.

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome. Fork the repository, create a feature branch, and submit a pull request describing your changes.

## 📄 License

A license has not yet been specified. Add an appropriate `LICENSE` file before distributing the project under an open-source license.
