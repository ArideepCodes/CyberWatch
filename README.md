🚨 CyberWatch
AI-Powered Cyber Threat Hunting Dashboard

Live at: https://cyberwatch-vohd.onrender.com/

CyberWatch is a modern, full-stack AI-powered cyber threat intelligence platform designed to visualize attacks, monitor live events, analyze IPs, generate insights, and help you understand the global threat landscape in real-time.

Built with React + Vite, Express.js, TailwindCSS, Leaflet, Recharts, WebSockets, and Drizzle ORM, this project delivers a responsive, high-performance cyber monitoring dashboard suitable for cybersecurity labs, SOC demos, and educational use.

⚡ Features
🔍 Dashboard Overview

Real-time active threat count

Today’s attack summary

High-severity events

Live threat feed with IP, country & risk indicators

Interactive attack origin map (Leaflet)

🛡 Threats Page

Complete threat list

Filters by severity, country, IP, attack type

Timestamp-based sorting

Detailed modal view for each threat

🤖 AI Insights

Threat explanation generator

Impact rating

Suggested response steps

Anomaly detection logic (local AI functions)

🌎 IP Lookup

Enter any IP

View ASN, country, ISP

Risk score

AI-generated reasoning

📊 Analytics

Threats per type (Bar chart)

Severity distribution (Pie / Donut)

Geo-heat activity

Timeline of events

💠 UI / UX

Dark cyber-themed interface

Neon cyan & purple accents

Smooth animations

Responsive layout

Custom sidebar & navigation

Clean, modular component structure

🏗 Tech Stack
Frontend

React

Vite

TailwindCSS

Recharts

Leaflet

Lucide Icons

Backend

Express.js

WebSockets

Drizzle ORM

Sessions + Passport (if enabled)

Node.js (Runtime)

Database

Drizzle ORM

Neon / SQLite (depending on deployment)

Hosting

Render (Full-stack deployment)

GitHub (Source Hosting)

🚀 Deployment

CyberWatch is deployed via Render using the Node.js environment.

Live Deployment:
👉 https://cyberwatch-vohd.onrender.com/

To deploy yourself:

1. Create a Web Service on Render

Environment: Node

Build command:

npm install && npm run build


Start command:

npm start

2. Set Environment Variables (Optional)

If using Neon / external DB:

DATABASE_URL=<your-database-url>
SESSION_SECRET=<your-secret>

🧪 Running Locally
1. Clone the repo
git clone https://github.com/ArideepCodes/CyberWatch.git
cd CyberWatch

2. Install dependencies
npm install

3. Start dev server
npm run dev


Local preview will be at:

http://localhost:3000

📁 Project Structure
CyberWatch/
 ├── client/           # React + Vite frontend
 ├── server/           # Express.js backend
 ├── shared/           # Shared utilities & models
 ├── tailwind.config.ts
 ├── vite.config.ts
 ├── package.json
 ├── drizzle.config.ts # Database config
 └── README.md

🧑‍💻 Developer

Arideep Kanshabanik 

GitHub: https://github.com/ArideepCodes

Instagram: https://www.instagram.com/greenflaghunyaar

LinkedIn: https://www.linkedin.com/in/arideep-kanshabanik

Portfolio: https://arideep.framer.ai

Email: arideepkanshabanik@gmail.com


🧑‍💻 Co-developer

Moumi Byapari

GitHub: https://github.com/Moumi2024

Instagram: https://www.instagram.com/https.moumi/

LinkedIn: https://www.linkedin.com/in/moumibyapari

Email: byaparimoumi@gmail.com


⭐ Credits

CyberWatch is built as a full-stack cyber intelligence dashboard project showcasing:

Real-time threat visualizations

Modern UI/UX architecture

AI-assisted analysis

Professional full-stack deployment workflow

📜 License

MIT License
