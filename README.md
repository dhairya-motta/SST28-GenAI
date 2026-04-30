# Persona-Based AI Chatbot
Prompt Engineering | Scaler Academy

## Overview
This is a persona-based AI chatbot application featuring three distinct Scaler personalities: Anshuman Singh, Kshitij Mishra, and Abhimanyu Saxena. The system prompts have been carefully engineered using instructions and few-shot examples to maintain consistent personalities.

## Live Demo
The application is deployed on Vercel: https://sst-28-gen-ai.vercel.app

## Features
- **3 Distinct Personas**: Carefully crafted system prompts representing Anshuman Singh, Abhimanyu Saxena, and Kshitij Mishra.
- **Next.js App Router**: Modern and fast architecture.
- **Gemini AI**: Using Google's modern LLM `gemini-1.5-flash` for high-quality responses.
- **Clean UI**: Responsive chat interface styled with Tailwind CSS, supporting suggestion chips, typing indicators, and beautiful aesthetics.

## Prompt Engineering
See [\`prompts.md\`](prompts.md) for the exact system prompts and a breakdown of their design (GIGO approach).

## Reflection
See [\`reflection.md\`](reflection.md) for my thoughts and reflections on the prompt engineering assignment.

## Tech Stack
- Frontend: Next.js 15, React, Tailwind CSS, Lucide Icons
- Backend: Next.js API Routes (Serverless)
- LLM Integration: Google Generative AI (\`@google/generative-ai\`)

## Setup Instructions
To run this project locally, follow these steps:

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/dhairya-motta/SST28-GenAI.git
   cd SST28-GenAI
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Environment Variables:**
   Copy the \`.env.example\` file to \`.env\`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Then, add your Gemini API key to the \`.env\` file:
   \`\`\`
   GEMINI_API_KEY=your_actual_api_key_here
   \`\`\`
   *Note: Never commit your actual \`.env\` file. The API key is securely handled by the Next.js API routes.*

4. **Start the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).
