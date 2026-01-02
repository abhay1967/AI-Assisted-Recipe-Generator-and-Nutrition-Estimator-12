const fetch = require("node-fetch");

// Switched to Groq (OpenAI-compatible) while preserving the function name for compatibility
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

function buildPrompt(ingredients, preferences) {
  const allowedIngredients = ingredients.map((i) => i.name).join(", ");

  return `
You are an expert chef.

You MUST use ONLY the following ingredients:
${allowedIngredients}

Rules (VERY IMPORTANT):
- Use ONLY the ingredients listed above
- Ingredient names must match EXACTLY
- Quantities MUST be in grams (number only)
- Do NOT add new ingredients
- Do NOT include units like tbsp, pieces, tsp
- Do NOT include nutrition

Return STRICT JSON ONLY:
{
  "title": "",
  "ingredients": [{ "name": "", "quantity": 0 }],
  "steps": [],
  "servings": 0,
  "tags": []
}
`;
}

async function generateRecipeWithClaude(ingredients = [], preferences = {}) {
  if (!GROQ_API_KEY) {
    return {
      title: "Mocked AI Pasta",
      description: "Mock recipe (Groq key missing)",
      ingredients: [
        { name: "Pasta", quantity: 200 },
        { name: "Tomato", quantity: 150 },
      ],
      steps: ["Boil pasta", "Make sauce", "Combine"],
      servings: 2,
      tags: ["mock"],
    };
  }

  // Groq OpenAI-compatible Chat Completions API
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.7,
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: buildPrompt(ingredients, preferences),
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || "";

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Invalid Groq JSON output");

  return JSON.parse(match[0]);
}

module.exports = { generateRecipeWithClaude };
