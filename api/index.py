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

# Sneakers DATA
sneakers = [
    {
        "id": 1,
        "brand": "Nike",
        "model": "Air Jordan 1 High",
        "year": 1985,
        "colorway": "Chicago (White/Varsity Red/Black)",
        "price": 65,
        "description": "An iconic high-top basketball shoe that started a cultural revolution."
    },

    {
        "id": 2,
        "brand": "Adidas",
        "model": "Yeezy Boost 350 V2",
        "year": 2016,
        "colorway": "Beluga",
        "price": 220,
        "description": "A highly coveted lifestyle sneaker featuring a Primeknit upper and Boost midsole."
    },

    {
        "id": 3,
        "brand": "Puma",
        "model": "Suede Classic",
        "year": 1968,
        "colorway": "Black/White",
        "price": 70,
        "description": "A timeless low-top sneaker known for its smooth suede finish and street-style legacy."
    },

    {
        "id": 4,
        "brand": "New Balance",
        "model": "990v5",
        "year": 2019,
        "colorway": "Castlerock/Grey",
        "price": 175,
        "description": "A premium lifestyle shoe famous for its all-day comfort and classic dad-shoe aesthetic."
    },

    {
        "id": 5,
        "brand": "ASICS",
        "model": "Gel-Lyte III",
        "year": 1990,
        "colorway": "Salmon Toe",
        "price": 130,
        "description": "A classic retro runner renowned for its unique split-tongue design and Gel cushioning."
    }
    
]

# HOME
@app.get("/sneakers")
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
def get_cars():

    return {
        "count": len(sneakers),
        "sneakers": sneakers
    }


# GET ONE CAR
@app.get("/sneakers/{sneaker_id}")
def get_car(sneaker_id: int):

    for sneaker in sneakers:

        if sneaker["id"] == sneaker_id:
            return sneaker

    raise HTTPException(
        status_code=404,
        detail="Sneaker not found."
    )

# SEARCH CARS
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
