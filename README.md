# AI-Assisted Recipe Generator and Nutrition Estimator

A full-stack web application that generates recipes using AI and provides detailed nutritional information. Built with Next.js, React, Node.js, and MongoDB.

## 🚀 Features

- **AI-Powered Recipe Generation**: Generate unique recipes based on available ingredients
- **Nutritional Analysis**: Get detailed nutritional information for each recipe
- **Favorite Recipes**: Save and manage your favorite recipes
- **Modern UI**: Responsive design with dark/light mode support
- **Ingredient Management**: Track and manage your ingredients

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 13+ with App Router
- **UI Components**: Radix UI Primitives
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **Data Fetching**: SWR

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **AI Integration**: Claude AI API
- **Nutrition Data**: USDA FoodData Central API

## 📦 Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB Atlas account or local MongoDB instance
- Claude AI API key
- USDA FoodData Central API key

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/abhay1967/AI-Assisted-Recipe-Generator-and-Nutrition-Estimator-12.git
cd AI-Assisted-Recipe-Generator-and-Nutrition-Estimator-12
```

### 2. Set up the Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the backend directory and add:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLAUDE_API_KEY=your_claude_api_key
USDA_API_KEY=your_usda_api_key
PORT=5000

# Start the development server
npm run dev
```

### 3. Set up the Frontend
```bash
# Navigate to frontend directory
cd ../recipe-generator-frontend-main

# Install dependencies
npm install

# Create a .env.local file in the frontend directory and add:
NEXT_PUBLIC_API_URL=http://localhost:5000

# Start the development server
npm run dev
```

### 4. Open your browser
Visit `http://localhost:3000` to see the application in action.

## 📂 Project Structure

```
AI-Assisted-Recipe-Generator-and-Nutrition-Estimator-12/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic and external services
│   ├── server.js         # Express server entry point
│   └── package.json
├── recipe-generator-frontend-main/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions
│   ├── public/           # Static assets
│   ├── services/         # API service functions
│   └── package.json
└── README.md
```

## 🌐 API Endpoints

### Recipes
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create a new recipe
- `GET /api/recipes/:id` - Get a specific recipe
- `PUT /api/recipes/:id` - Update a recipe
- `DELETE /api/recipes/:id` - Delete a recipe

### Ingredients
- `GET /api/ingredients` - Get all ingredients
- `POST /api/ingredients` - Add a new ingredient

### Favorites
- `GET /api/favorites` - Get user's favorite recipes
- `POST /api/favorites` - Add recipe to favorites
- `DELETE /api/favorites/:id` - Remove recipe from favorites

## 🔒 Environment Variables

### Backend (`.env`)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `CLAUDE_API_KEY`: API key for Claude AI
- `USDA_API_KEY`: API key for USDA FoodData Central
- `PORT`: Server port (default: 5000)

### Frontend (`.env.local`)
- `NEXT_PUBLIC_API_URL`: Backend API URL (e.g., http://localhost:5000)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [Claude AI](https://www.anthropic.com/) for the recipe generation
- [USDA FoodData Central](https://fdc.nal.usda.gov/) for nutritional data
- [Next.js](https://nextjs.org/) and [React](https://reactjs.org/) for the frontend framework
- [MongoDB](https://www.mongodb.com/) for the database

---

Made with ❤️ by Abhay Chaudhary
