from fastapi import FastAPI, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Sneakers",
    description="A beginner-friendly REST API containing information about sneakers.",
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
recipe = [
    {
        "id"
        "ingredients"
        "diffculty"
        "steps"
        "rating"
        "type"
        "carbs"
        "protein"
        "allergen"
        "sugar"
        "fiber"
        "sodium"
        "servings"
        "description"
    }
]

# HOME
@app.get("/")
def home():

    return {
        "message": "Welcome to the Simple Sneakers API!",
        "endpoints": [
            "/sneakers",
            "/sneakers/{id}",
            "/sneakers/search"
        ]
    }


# GET ALL CARS
@app.get("/sneakers")
def get_sneakers():

    return {
        "count": len(sneakers),
        "sneakers": sneakers
    }


@app.get("/sneakers/search")
def search_sneakers( q: str = Query(..., min_length=1)):
    q = q.lower()
    results = []
    for sneaker in sneakers:
        searchable_text = (
            f"{sneaker['brand']} "
            f"{sneaker['model']} "
            f"{sneaker['year']} "
            f"{sneaker['colorway']} "
            f"{sneaker['price']} "
        ).lower()

        if q in searchable_text:
            results.append(sneaker)

    return {
        "query": q,
        "count": len(results),
        "results": results
    }


# GET ONE CAR
@app.get("/sneakers/{sneaker_id}")
def get_sneakers(sneaker_id: int):

    for sneaker in sneakers:

        if sneaker["id"] == sneaker_id:
            return sneaker

    raise HTTPException(
        status_code=404,
        detail="Sneaker not found."
    )

# SEARCH CARS
