# 🍽️ AI-Assisted Recipe Generator & Nutrition Estimator

A full-stack web application that generates recipes using AI based on user-provided ingredients and calculates detailed nutritional information using official USDA data.

Built with Next.js, React, Node.js, Express, and MongoDB, and deployed using Vercel and Render.

## 🚀 Features

- **AI-Powered Recipe Generation**  
  Generate complete recipes (ingredients, steps, servings) using Claude AI.

- **Accurate Nutrition Estimation**  
  Calories, protein, carbs, and fat calculated using USDA FoodData Central.

- **Favorite Recipes**  
  Save recipes to MongoDB and view them anytime.

- **Modern Responsive UI**  
  Clean UI with dark/light mode support.

- **Ingredient Parsing**  
  Automatically parses raw ingredient input into structured data.

- **Production-Ready Deployment**  
  Backend on Render, frontend on Vercel.

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **UI Components**: Radix UI + Custom Components
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Charts**: Chart.js
- **Data Fetching**: Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas + Mongoose
- **AI Integration**: Claude API
- **Nutrition Data**: USDA FoodData Central API

> ⚠️ Authentication is intentionally not implemented to keep the app simple and focused.

## 📦 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Claude API key
- USDA FoodData Central API key

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/abhay1967/AI-Assisted-Recipe-Generator-and-Nutrition-Estimator-12.git
cd AI-Assisted-Recipe-Generator-and-Nutrition-Estimator-12
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
MONGODB_URI=your_mongodb_connection_string
CLAUDE_API_KEY=your_claude_api_key
USDA_API_KEY=your_usda_api_key
PORT=8000
```

Start backend:

```bash
npm start
```

Health check:

```
http://localhost:8000/health
```

### 3️⃣ Frontend Setup
```bash
cd ../recipe-generator-frontend-main
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Start frontend:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

## 🌐 Deployed Demo

- **Frontend (Vercel)**  
  https://ai-assisted-recipe-generator-and-nu.vercel.app

- **Backend (Render)**  
  https://ai-recipe-backend-ifrk.onrender.com

- **Backend Health Check**  
  https://ai-recipe-backend-ifrk.onrender.com/health

## 📂 Project Structure

```
AI-Assisted-Recipe-Generator-and-Nutrition-Estimator-12/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── recipe-generator-frontend-main/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── services/
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Recipes
- `POST /api/recipes/generate` – Generate recipe via AI
- `GET /api/recipes` – Get all recipes
- `PATCH /api/recipes/:id/favorite` – Toggle favorite
- `GET /api/recipes/favorites` – Get favorite recipes

### Ingredients
- `GET /api/ingredients`
- `POST /api/ingredients`

## 🔐 Environment Variables

### Backend (`.env`)
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLAUDE_API_KEY` | Claude AI API key |
| `USDA_API_KEY` | USDA nutrition API key |
| `PORT` | Server port (default: 8000) |

### Frontend (`.env.local`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit changes
4. Push to GitHub
5. Open a Pull Request

## 🙏 Acknowledgments

- **Claude AI** – Recipe generation
- **USDA FoodData Central** – Nutrition data
- **Next.js & React** – Frontend framework
- **MongoDB Atlas** – Database

---

## ❤️ Author

**Abhay Chaudhary**  
Built with passion for AI, nutrition, and clean system design.
