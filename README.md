## AI Resume Analyser
AI Resume Analyser is a modern, AI-powered web application that delivers tailored resume analysis and optimization. Designed with React Router 7, Vite, and a novel backend approach using Puter.js, it offers users deep insights with resume scoring, tailored descriptions, summarized feedback, and actionable recommendations for specified job descriptions.

## Features

- AI Resume Scoring: Provides ATS-style matching, customized feedback, and role-specific resume scores.

- Smart Reports: Generates dynamic summaries and recommendations based on user-uploaded resumes and job descriptions.

- Server-Side Rendering (SSR) Toggle: SSR is supported but can be disabled for deployment flexibility.

- Modern Tech Stack:

   - React Router 7 for navigation

   - Vite for optimized builds and development experience

    - Tailwind CSS for utility-first styling

     - Backend managed with Puter.js for next-gen, serverless AI features

- Seamlessly Responsive: Works across all devices with a clean, modern UI.

- Easy Integration: Works with GitHub, Vercel, and Puter for rapid deployment

## Getting Started

### Installation

Install the dependencies:

```bash
git clone https://github.com/krishnakumar51/ai-resume-analyser.git
cd ai-resume-analyser
npm install
```

### Development

Start the development:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment
### Deploy to Puter:
1. Turn off SSR before building:
   - Open react-router.config.ts
   - Set ssr to false:
   ```bash
   export default {
    ssr: false,
    }
   ```
   - Save and close the config file.


2. Build the app.
   ```bash
   npm run build
   ```
3. Copy all contents from the build/ directory.
4. Deploy to Puter:
   - Go to the Apps section in your Puter app gallery.
   - Create a new app and upload all files from the build/ directory.
   - Follow any additional prompts for static site deployment.


### Deploying on Vercel
1. Sign in to Vercel.
2. Import the project repository:
   - Click “New Project” and select your GitHub repo.
   - Select “Vite” as the project framework when prompted.
3. Configure settings:
   - Root directory: Use the root or appropriate folder if in a monorepo.
4. Deploy:
   - Click “Deploy.”
   -  Vercel will automatically detect the build command (npm run build) and output directory (build/ or as specified).
   - Wait for the deployment to complete.
   -  Visit your new Vercel site via the link provided after deployment.
### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps

