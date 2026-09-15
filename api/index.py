from fastapi import FastAPI, HTTPException, Query, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, Literal


#==========================
# CONFIGURATION
#==========================
API_KEY = "recipe-api-key-123"
API_VERSION = "1.0"

app = FastAPI(
    title="Recipe",
    description="A beginner-friendly REST API containing information about recipes.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

#==============================
# Data model 
#==============================

class Recipe(BaseModel):
    id: int
    name: str = Field(min_length=1)

    ingredients: list[str]

    difficulty: Literal["Easy", "Medium", "Hard"]

    steps: list[str]

    rating: float = Field(ge=0, le=5)

    type: Literal[
        "American",
        "Filipino",
        "Italian",
        "Chinese",
        "Mediterranean",
        "Spanish",
        "Southeast Asian"
    ]

    carbs: int = Field(ge=0)
    protein: int = Field(ge=0)

    allergen: list[str]

    sugar: int = Field(ge=0)
    fiber: int = Field(ge=0)
    sodium: int = Field(ge=0)

    servings: int = Field(gt=0)

    description: str = Field(
        min_length=10,
        max_length=500
    )

# Recipe DATA
recipes = [
    {
        "id": 1,
        "name": "Garlic Soy Chicken",
        "ingredients": ["chicken", "garlic", "soy sauce", "pepper"],
        "difficulty": "Easy",
        "steps": ["Marinate chicken", "Heat the pan", "Cook chicken", "Serve"],
        "rating": 4.5,
        "type": "Chinese",
        "carbs": 8,
        "protein": 32,
        "allergen": ["soy"],
        "sugar": 3,
        "fiber": 2,
        "sodium": 520,
        "servings": 2,
        "description": "Simple garlic chicken cooked with soy sauce and pepper."
    },
    {
        "id": 2,
        "name": "Classic Beef Spaghetti",
        "ingredients": ["spaghetti", "tomato sauce", "ground beef", "onion"],
        "difficulty": "Medium",
        "steps": ["Boil pasta", "Cook beef", "Add tomato sauce", "Combine with pasta"],
        "rating": 4.7,
        "type": "Italian",
        "carbs": 45,
        "protein": 25,
        "allergen": ["wheat"],
        "sugar": 8,
        "fiber": 5,
        "sodium": 650,
        "servings": 4,
        "description": "Classic spaghetti with savory ground beef and tomato sauce."
    },
    {
        "id": 3,
        "name": "Chicken Fried Rice",
        "ingredients": ["rice", "chicken", "carrots", "peas", "soy sauce", "egg"],
        "difficulty": "Easy",
        "steps": ["Cook rice", "Stir-fry chicken", "Add vegetables", "Add rice and soy sauce", "Mix in egg"],
        "rating": 4.6,
        "type": "Chinese",
        "carbs": 42,
        "protein": 28,
        "allergen": ["soy", "egg"],
        "sugar": 4,
        "fiber": 4,
        "sodium": 600,
        "servings": 3,
        "description": "Flavorful fried rice with chicken, vegetables, and egg."
    },
    {
        "id": 4,
        "name": "Hearty Beef Stew",
        "ingredients": ["beef", "potatoes", "carrots", "onion"],
        "difficulty": "Medium",
        "steps": ["Cut ingredients", "Brown the beef", "Add vegetables", "Simmer until tender"],
        "rating": 4.4,
        "type": "American",
        "carbs": 30,
        "protein": 29,
        "allergen": [],
        "sugar": 5,
        "fiber": 6,
        "sodium": 480,
        "servings": 4,
        "description": "Hearty beef stew with potatoes, carrots, and onions."
    },
    {
        "id": 5,
        "name": "Vegetable Scrambled Eggs",
        "ingredients": ["eggs", "tomato", "onion", "bell pepper"],
        "difficulty": "Easy",
        "steps": ["Chop vegetables", "Cook vegetables", "Add eggs", "Stir until cooked"],
        "rating": 4.3,
        "type": "American",
        "carbs": 9,
        "protein": 14,
        "allergen": ["egg"],
        "sugar": 5,
        "fiber": 2,
        "sodium": 300,
        "servings": 2,
        "description": "Quick scrambled eggs with fresh tomatoes, onions, and peppers."
    },
    {
        "id": 6,
        "name": "Filipino Pork Adobo",
        "ingredients": ["pork", "garlic", "vinegar", "soy sauce", "bay leaves"],
        "difficulty": "Medium",
        "steps": ["Marinate pork", "Brown the pork", "Add sauce", "Simmer until tender"],
        "rating": 4.9,
        "type": "Filipino",
        "carbs": 6,
        "protein": 35,
        "allergen": ["soy"],
        "sugar": 2,
        "fiber": 1,
        "sodium": 700,
        "servings": 4,
        "description": "Traditional Filipino pork adobo with garlic, vinegar, and soy sauce."
    },
    {
        "id": 7,
        "name": "Chicken Tinola",
        "ingredients": ["chicken", "ginger", "garlic", "fish sauce", "rice"],
        "difficulty": "Easy",
        "steps": ["Saute garlic and ginger", "Add chicken", "Add water", "Simmer", "Serve with rice"],
        "rating": 4.7,
        "type": "Filipino",
        "carbs": 35,
        "protein": 27,
        "allergen": ["fish"],
        "sugar": 2,
        "fiber": 1,
        "sodium": 580,
        "servings": 4,
        "description": "Warm Filipino chicken soup with ginger, garlic, and rice."
    },
    {
        "id": 8,
        "name": "Banana Pancakes",
        "ingredients": ["banana", "flour", "egg", "milk", "sugar"],
        "difficulty": "Easy",
        "steps": ["Mash bananas", "Mix ingredients", "Heat pan", "Cook pancakes"],
        "rating": 4.6,
        "type": "American",
        "carbs": 38,
        "protein": 8,
        "allergen": ["wheat", "egg", "milk"],
        "sugar": 16,
        "fiber": 3,
        "sodium": 280,
        "servings": 4,
        "description": "Soft and sweet banana pancakes perfect for breakfast."
    },
    {
        "id": 9,
        "name": "Fresh Chicken Salad",
        "ingredients": ["lettuce", "tomato", "cucumber", "chicken", "olive oil"],
        "difficulty": "Easy",
        "steps": ["Chop vegetables", "Cook chicken", "Combine ingredients", "Add dressing"],
        "rating": 4.2,
        "type": "Mediterranean",
        "carbs": 12,
        "protein": 25,
        "allergen": [],
        "sugar": 5,
        "fiber": 4,
        "sodium": 220,
        "servings": 2,
        "description": "Fresh chicken salad with crisp vegetables and olive oil dressing."
    },
    {
        "id": 10,
        "name": "Grilled Cheese Sandwich",
        "ingredients": ["bread", "cheese", "butter"],
        "difficulty": "Easy",
        "steps": ["Butter bread", "Add cheese", "Heat pan", "Toast both sides"],
        "rating": 4.5,
        "type": "American",
        "carbs": 28,
        "protein": 12,
        "allergen": ["wheat", "milk"],
        "sugar": 3,
        "fiber": 2,
        "sodium": 450,
        "servings": 2,
        "description": "Crispy grilled cheese sandwich with melted cheese."
    },
    {
        "id": 11,
        "name": "Lemon Garlic Salmon",
        "ingredients": ["salmon", "lemon", "garlic", "butter", "pepper"],
        "difficulty": "Medium",
        "steps": ["Season salmon", "Prepare garlic butter", "Pan-sear salmon", "Add lemon"],
        "rating": 4.8,
        "type": "Mediterranean",
        "carbs": 3,
        "protein": 34,
        "allergen": ["fish", "milk"],
        "sugar": 1,
        "fiber": 1,
        "sodium": 350,
        "servings": 2,
        "description": "Pan-seared salmon with lemon, garlic, and butter."
    },
    {
        "id": 12,
        "name": "Creamy Mashed Potatoes",
        "ingredients": ["potatoes", "milk", "butter", "salt", "pepper"],
        "difficulty": "Easy",
        "steps": ["Boil potatoes", "Mash potatoes", "Add milk and butter", "Season"],
        "rating": 4.4,
        "type": "American",
        "carbs": 32,
        "protein": 5,
        "allergen": ["milk"],
        "sugar": 3,
        "fiber": 4,
        "sodium": 320,
        "servings": 4,
        "description": "Creamy mashed potatoes that make a perfect side dish."
    },
    {
        "id": 13,
        "name": "Crispy Fried Chicken",
        "ingredients": ["chicken", "flour", "egg", "breadcrumbs", "oil"],
        "difficulty": "Medium",
        "steps": ["Coat chicken in flour", "Dip in egg", "Cover with breadcrumbs", "Fry until golden"],
        "rating": 4.6,
        "type": "American",
        "carbs": 24,
        "protein": 30,
        "allergen": ["wheat", "egg"],
        "sugar": 2,
        "fiber": 2,
        "sodium": 500,
        "servings": 4,
        "description": "Crispy breaded chicken with a golden crunchy coating."
    },
    {
        "id": 14,
        "name": "Banana Honey Oatmeal",
        "ingredients": ["oats", "milk", "banana", "honey", "cinnamon"],
        "difficulty": "Easy",
        "steps": ["Combine oats and milk", "Cook oats", "Add banana", "Drizzle with honey"],
        "rating": 4.5,
        "type": "American",
        "carbs": 42,
        "protein": 10,
        "allergen": ["milk"],
        "sugar": 14,
        "fiber": 6,
        "sodium": 120,
        "servings": 2,
        "description": "Warm oatmeal topped with banana, honey, and cinnamon."
    },
    {
        "id": 15,
        "name": "Garlic Butter Shrimp",
        "ingredients": ["shrimp", "garlic", "butter", "lemon", "parsley"],
        "difficulty": "Easy",
        "steps": ["Clean shrimp", "Melt butter", "Cook garlic", "Add shrimp", "Finish with lemon"],
        "rating": 4.7,
        "type": "Spanish",
        "carbs": 4,
        "protein": 28,
        "allergen": ["shellfish", "milk"],
        "sugar": 1,
        "fiber": 1,
        "sodium": 410,
        "servings": 2,
        "description": "Juicy garlic butter shrimp finished with fresh lemon."
    },
    {
        "id": 16,
        "name": "Coconut Chicken Rice",
        "ingredients": ["rice", "coconut milk", "chicken", "ginger", "garlic"],
        "difficulty": "Medium",
        "steps": ["Cook chicken", "Add garlic and ginger", "Add coconut milk", "Add rice", "Simmer"],
        "rating": 4.6,
        "type": "Southeast Asian",
        "carbs": 40,
        "protein": 26,
        "allergen": [],
        "sugar": 4,
        "fiber": 2,
        "sodium": 390,
        "servings": 4,
        "description": "Creamy coconut chicken rice with garlic and ginger."
    },
    {
        "id": 17,
        "name": "Creamy Tomato Soup",
        "ingredients": ["tomato", "onion", "garlic", "vegetable broth", "cream"],
        "difficulty": "Easy",
        "steps": ["Saute onion and garlic", "Add tomatoes", "Add broth", "Blend", "Add cream"],
        "rating": 4.3,
        "type": "Italian",
        "carbs": 15,
        "protein": 5,
        "allergen": ["milk"],
        "sugar": 8,
        "fiber": 3,
        "sodium": 420,
        "servings": 4,
        "description": "Smooth and creamy tomato soup with garlic and herbs."
    },
    {
        "id": 18,
        "name": "Classic Beef Burger",
        "ingredients": ["beef", "lettuce", "tomato", "cheese", "burger bun"],
        "difficulty": "Medium",
        "steps": ["Form beef patty", "Grill patty", "Toast bun", "Add vegetables and cheese"],
        "rating": 4.7,
        "type": "American",
        "carbs": 35,
        "protein": 27,
        "allergen": ["wheat", "milk"],
        "sugar": 7,
        "fiber": 3,
        "sodium": 620,
        "servings": 1,
        "description": "Classic beef burger with lettuce, tomato, and melted cheese."
    },
    {
        "id": 19,
        "name": "Mango Banana Smoothie",
        "ingredients": ["mango", "banana", "yogurt", "honey", "ice"],
        "difficulty": "Easy",
        "steps": ["Cut fruit", "Add ingredients to blender", "Blend until smooth", "Serve cold"],
        "rating": 4.8,
        "type": "Filipino",
        "carbs": 35,
        "protein": 7,
        "allergen": ["milk"],
        "sugar": 27,
        "fiber": 4,
        "sodium": 80,
        "servings": 2,
        "description": "Refreshing mango and banana smoothie with creamy yogurt."
    },
    {
        "id": 20,
        "name": "Fudgy Chocolate Brownies",
        "ingredients": ["flour", "cocoa powder", "sugar", "egg", "butter", "chocolate"],
        "difficulty": "Medium",
        "steps": ["Mix dry ingredients", "Add wet ingredients", "Add chocolate", "Bake", "Cool and serve"],
        "rating": 4.9,
        "type": "American",
        "carbs": 45,
        "protein": 6,
        "allergen": ["wheat", "egg", "milk"],
        "sugar": 30,
        "fiber": 3,
        "sodium": 210,
        "servings": 8,
        "description": "Rich and fudgy chocolate brownies with chocolate pieces."
    }
]


# ==================================
# ON-BOOT DATA VALIDATION
# ==================================
validated_recipes = [
    Recipe(**recipe).model_dump()
    for recipe in recipes
]




# HOME
@app.get("/")
def home():
    return {
        "message": "Welcome to the Simple Recipe API!",
        "endpoints": [
            "/recipes",
            "/recipes/{id}",
            "/recipes/search"
        ]
    }


# GET ALL RECIPES
@app.get("/recipes")
def get_recipes():
    return {
        "count": len(recipes),
        "recipes": recipes
    }


# SEARCH RECIPES
@app.get("/recipes/search")
def search_recipes(q: str = Query(..., min_length=1)):
    q = q.lower()
    results = []

    for recipe in recipes:
        searchable_text = (
            f"{recipe['name']}"
            f"{recipe['ingredients']} "
            f"{recipe['difficulty']} "
            f"{recipe['type']} "
            f"{recipe['description']} "
            f"{recipe['allergen']} "
        ).lower()

        if q in searchable_text:
            results.append(recipe)

    return {
        "query": q,
        "count": len(results),
        "results": results
    }


# GET ONE RECIPE
@app.get("/recipes/{recipe_id}")
def get_recipe(recipe_id: int):
    for recipe in recipes:
        if recipe["id"] == recipe_id:
            return recipe

    raise HTTPException(
        status_code=404,
        detail="Recipe not found."
    )


#============================
# API KEY AUTHENTICATION 
#============================

def verify_api_key(x_api_key: Optional[str] = Header(default = None)):
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key"
        )
    return True


# ============================================================
# HEALTH CHECK (Public)
# ============================================================
@app.get("/health")
def health_check():
    return{
        "status": "ok",
        "services": "Simple Recipe API",
        "version": "API_VERSION",
        "timestamp": datetime.utcnow().isoFormat() + "Z" 
    }



#==========================================================
# GET ALL RECIPES (PROTECTED)
#==========================================================
@app.get("/api/v1/recipe", dependencies=[Depends(verify_api_key)])
def get_recipe():
    return {
        "count": len(recipes),
        "recipes": recipes
    }

#==========================================================
# GET ONE RECIPES (PROTECTED)
#==========================================================

@app.get("/api/v1/recipe/{recipe_id}", dependencies=[Depends(verify_api_key)])
def get_recipe(recipe_id: int):
    for recipe in recipes:
        if recipe["id"] == recipe_id:
            return recipe
    raise HTTPException(status_code=404, detail="Recipe Not Found")