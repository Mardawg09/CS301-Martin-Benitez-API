---

## 📊 API Data Information

The Recipe API contains 20 recipes. Each recipe contains the following information:

| Data | Description | Used By |
|---|---|---|
| **ID** | Unique number for each recipe | Website 1, 2, 3 |
| **Name** | Name of the recipe | Website 1, 2, 3 |
| **Ingredients** | List of ingredients needed for the recipe | Website 1, 2, 3 |
| **Difficulty** | Cooking difficulty: Easy, Medium, or Hard | Website 1, 2, 3 |
| **Steps** | Step-by-step cooking instructions | Website 1, 2, 3 |
| **Rating** | Recipe rating from 0 to 5 stars | Website 1, 2, 3 |
| **Type** | Cuisine or recipe category | Website 1, 2, 3 |
| **Carbohydrates** | Amount of carbohydrates in grams | Website 1, 3 |
| **Protein** | Amount of protein in grams | Website 1, 3 |
| **Allergen** | Possible allergens found in the recipe | Website 1, 3 |
| **Sugar** | Amount of sugar in grams | Website 1, 3 |
| **Fiber** | Amount of fiber in grams | Website 1, 3 |
| **Sodium** | Amount of sodium in milligrams | Website 1, 3 |
| **Servings** | Number of servings the recipe can provide | Website 1, 2, 3 |
| **Estimated Cost** | Estimated total price of the recipe in Philippine pesos | Website 2 |
| **Diet Tags** | Categories such as High Protein, Low Carb, Low Sugar, High Fiber, and Low Sodium | Website 3 |
| **Description** | Short description of the recipe | Website 1, 2, 3 |

---

## 🌐 How the Data Is Used

### Website 1 — International Recipes

The International Recipes website focuses on general recipe information and cuisine.

It uses:

- Recipe name
- Cuisine/type
- Ingredients
- Difficulty
- Cooking steps
- Rating
- Servings
- Description
- Nutrition information
- Allergens

Users can search and filter recipes based on different cuisines such as Filipino, Chinese, Italian, American, Spanish, Mediterranean, and Southeast Asian.

---

### Website 2 — Budget Recipes

The Budget Recipes website focuses on affordable meals.

It mainly uses:

- Recipe name
- Ingredients
- Difficulty
- Rating
- Servings
- Estimated cost
- Description

The estimated cost is used to help users find recipes that fit within their available budget.

For example:

- Recipe: Vegetable Scrambled Eggs
- Estimated Cost: ₱90
- Servings: 2
- Estimated Cost Per Serving: ₱45

---

### Website 3 — Diet Recipes

The Diet Recipes website focuses on nutritional information.

It mainly uses:

- Recipe name
- Ingredients
- Protein
- Carbohydrates
- Sugar
- Fiber
- Sodium
- Allergens
- Diet tags
- Description

The website provides filters such as:

- High Protein
- Low Carb
- Low Sugar
- High Fiber
- Low Sodium

These categories are used only for recipe filtering in the application.

---

## 📌 Project Overview

The project contains one FastAPI API that stores 20 recipes.

Instead of creating a different API for every website, all three websites connect to the same API.

The structure works like this:

```text
                 FastAPI Recipe API
                        |
                    /recipes
                        |
          --------------------------------
          |              |               |
          |              |               |
    Website 1       Website 2        Website 3
   International       Budget             Diet
     Recipes            Recipes           Recipes
          |              |               |
       Cuisine          Cost          Nutrition
       Recipes         Recipes          Recipes
