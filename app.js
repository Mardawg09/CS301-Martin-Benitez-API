const API_URL = "https://cs-301-martin-benitez-api.vercel.app";

// GET ALL RECIPES
async function loadRecipes() {
    try {
        const response = await fetch(`${API_URL}/recipes`);
        const data = await response.json();

        displayRecipes(data.recipes);
    }

    catch (error) {
        console.error(error);

        document.getElementById("recipeList").innerHTML =
            "Unable to connect to the API.";
    }
}


// DISPLAY RECIPES
function displayRecipes(recipes) {

    const recipeList =
        document.getElementById("recipeList");

    recipeList.innerHTML = "";

    recipes.forEach(recipe => {

        const card = document.createElement("div");

        card.className = "recipe-card";

        card.innerHTML = `
            <div class="recipe-type">
                ${recipe.type}
            </div>

            <h3>
                ${recipe.name}
            </h3>

            <p>
                <strong>Difficulty:</strong>
                ${recipe.difficulty}
            </p>

            <p>
                <strong>Rating:</strong>
                ${recipe.rating} ⭐
            </p>

            <p>
                <strong>Servings:</strong>
                ${recipe.servings}
            </p>

            <p>
                <strong>Protein:</strong>
                ${recipe.protein}g
            </p>

            <p>
                <strong>Carbs:</strong>
                ${recipe.carbs}g
            </p>

            <p>
                ${recipe.description}
            </p>

            <button onclick="viewRecipe(${recipe.id})">
                View Details
            </button>
        `;

        recipeList.appendChild(card);
    });
}


// GET ONE RECIPE
async function viewRecipe(id) {

    try {

        const response =
            await fetch(`${API_URL}/recipes/${id}`);

        const recipe =
            await response.json();

        alert(`
${recipe.name}

Type:
${recipe.type}

Difficulty:
${recipe.difficulty}

Rating:
${recipe.rating} ⭐

Ingredients:
${recipe.ingredients.join(", ")}

Steps:
${recipe.steps.join(" → ")}

Protein:
${recipe.protein}g

Carbs:
${recipe.carbs}g

Sugar:
${recipe.sugar}g

Fiber:
${recipe.fiber}g

Sodium:
${recipe.sodium}mg

Allergens:
${recipe.allergen.length > 0
    ? recipe.allergen.join(", ")
    : "None"}

Servings:
${recipe.servings}

Description:
${recipe.description}
        `);
    }

    catch (error) {

        console.error(error);

        alert("Unable to retrieve recipe.");
    }
}


// SEARCH RECIPES
async function searchRecipes() {

    const query =
        document.getElementById("searchInput").value;

    if (!query) {
        loadRecipes();
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/recipes/search?q=${encodeURIComponent(query)}`
            );

        const data =
            await response.json();

        displayRecipes(data.results);
    }

    catch (error) {

        console.error(error);

        alert("Search failed.");
    }
}


// LOAD RECIPES WHEN PAGE OPENS
loadRecipes();

