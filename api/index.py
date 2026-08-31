from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

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

# Recipe DATA
recipes = [
    {
        "id": 1,
        "ingredients": ["chicken", "garlic", "soy sauce"],
        "difficulty": "Easy",
        "steps": ["Marinate chicken", "Cook chicken", "Serve"],
        "rating": 4.5,
        "type": "Main Course",
        "carbs": 10,
        "protein": 30,
        "allergen": ["soy"],
        "sugar": 3,
        "fiber": 2,
        "sodium": 500,
        "servings": 2,
        "description": "A simple and delicious chicken recipe."
    }
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
