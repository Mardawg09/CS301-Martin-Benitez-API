const API_URL =
    "https://cs-301-martin-benitez-api.vercel.app";

const API_KEY =
    "recipe-api-key-123";

const FETCH_OPTIONS = {
    headers: {
        "x-api-key": API_KEY
    }
};

let recipes = [];


/* =========================
   LOAD RECIPES
========================= */

async function loadRecipes() {

    const container =
        document.getElementById("recipeList");

    try {

        const response = await fetch(
            `${API_URL}/recipes`,
            FETCH_OPTIONS
        );

        if (!response.ok) {
            throw new Error("Unable to load recipes");
        }

        const data = await response.json();

        recipes = data.recipes || [];

        applyFiltersAndRender();

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "Unable to connect to the API.";
    }
}


/* =========================
   FILTER
========================= */

function applyFiltersAndRender() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();

    const budgetValue =
        document
            .getElementById("budgetInput")
            .value;

    const maxBudget =
        budgetValue
            ? Number(budgetValue)
            : Infinity;


    const results = recipes.filter(recipe => {

        const text = [
            recipe.name,
            recipe.type,
            recipe.description,
            ...(recipe.ingredients || [])
        ]
        .join(" ")
        .toLowerCase();


        const matchesSearch =
            text.includes(search);


        const cost =
            Number(recipe.estimated_cost || 0);


        const matchesBudget =
            cost <= maxBudget;


        return matchesSearch && matchesBudget;
    });


    displayRecipes(results);
}


/* =========================
   DISPLAY
========================= */

function displayRecipes(data) {

    const container =
        document.getElementById("recipeList");

    container.classList.remove("loading-state");

    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            "No budget recipes found.";

        return;
    }


    data.forEach(recipe => {

        const card =
            document.createElement("article");

        card.className = "recipe-card";


        card.innerHTML = `

            <div class="recipe-type">
                ${recipe.type}
            </div>

            <h3>
                ${recipe.name}
            </h3>

            <div class="meta">

                <span>
                    ₱${recipe.estimated_cost}
                </span>

                <span>
                    ${recipe.servings} servings
                </span>

                <span>
                    ${recipe.rating} ⭐
                </span>

            </div>

            <p class="desc">
                ${recipe.description}
            </p>

            <button
                onclick="viewRecipe(${recipe.id})"
            >
                View Recipe
            </button>
        `;

        container.appendChild(card);
    });
}


/* =========================
   RECIPE DETAILS
========================= */

async function viewRecipe(id) {

    try {

        const response = await fetch(
            `${API_URL}/recipes/${id}`,
            FETCH_OPTIONS
        );

        if (!response.ok) {
            throw new Error("Unable to load recipe.");
        }

        const recipe =
            await response.json();

        openModal(recipe);

    } catch (error) {

        console.error(error);

        alert("Unable to retrieve recipe.");
    }
}


function openModal(recipe) {

    const body =
        document.getElementById("modalBody");


    body.innerHTML = `

        <div class="recipe-type">
            ${recipe.type}
        </div>

        <h3>
            ${recipe.name}
        </h3>

        <div class="meta">

            <span>
                ₱${recipe.estimated_cost}
            </span>

            <span>
                ${recipe.servings} servings
            </span>

            <span>
                ${recipe.rating} ⭐
            </span>

        </div>

        <p class="desc">
            ${recipe.description}
        </p>


        <h4>Ingredients</h4>

        <ul class="ingredients">

            ${(recipe.ingredients || [])
                .map(item =>
                    `<li>${item}</li>`
                )
                .join("")}

        </ul>


        <h4>Steps</h4>

        <ol class="steps">

            ${(recipe.steps || [])
                .map(step =>
                    `<li>${step}</li>`
                )
                .join("")}

        </ol>


        <h4>Estimated Cost</h4>

        <div class="nutrition-grid">

            <div>
                <strong>
                    ₱${recipe.estimated_cost}
                </strong>

                <span>
                    Total Cost
                </span>
            </div>

            <div>
                <strong>
                    ₱${(
                        recipe.estimated_cost /
                        recipe.servings
                    ).toFixed(2)}
                </strong>

                <span>
                    Per Serving
                </span>
            </div>

        </div>
    `;


    document
        .getElementById("modalOverlay")
        .classList
        .add("open");


    document.body.style.overflow =
        "hidden";
}


function closeModal() {

    document
        .getElementById("modalOverlay")
        .classList
        .remove("open");


    document.body.style.overflow =
        "";
}


function clearSearch() {

    document.getElementById("searchInput").value = "";

    document.getElementById("budgetInput").value = "";

    applyFiltersAndRender();
}


document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        applyFiltersAndRender
    );


loadRecipes();