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

let selectedDiet = "all";


async function loadRecipes() {

    try {

        const response = await fetch(
            `${API_URL}/recipes`,
            FETCH_OPTIONS
        );

        if (!response.ok) {
            throw new Error("Unable to load recipes.");
        }

        const data = await response.json();

        recipes = data.recipes || [];

        applyFiltersAndRender();

    } catch (error) {

        console.error(error);

        document.getElementById(
            "recipeList"
        ).innerHTML =
            "Unable to connect to API.";
    }
}


/* ========================
   DIET FILTER
======================== */

function matchesDiet(recipe) {

    switch (selectedDiet) {

        case "high-protein":

            return Number(recipe.protein) >= 20;


        case "low-carb":

            return Number(recipe.carbs) <= 30;


        case "low-sugar":

            return Number(recipe.sugar) <= 10;


        case "high-fiber":

            return Number(recipe.fiber) >= 5;


        case "low-sodium":

            return Number(recipe.sodium) <= 500;


        default:

            return true;
    }
}


/* ========================
   SEARCH + FILTER
======================== */

function applyFiltersAndRender() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();


    const results =
        recipes.filter(recipe => {

            const text = [

                recipe.name,

                recipe.type,

                recipe.description,

                ...(recipe.ingredients || [])

            ]
            .join(" ")
            .toLowerCase();


            return (
                text.includes(search) &&
                matchesDiet(recipe)
            );
        });


    displayRecipes(results);
}


/* ========================
   DISPLAY RECIPES
======================== */

function displayRecipes(data) {

    const container =
        document.getElementById(
            "recipeList"
        );


    container.classList.remove(
        "loading-state"
    );


    container.innerHTML = "";


    if (!data.length) {

        container.innerHTML =
            "No recipes match this diet filter.";

        return;
    }


    data.forEach(recipe => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "recipe-card";


        card.innerHTML = `

            <div class="recipe-type">
                ${recipe.type}
            </div>


            <h3>
                ${recipe.name}
            </h3>


            <div class="meta">

                <span>
                    ${recipe.protein}g protein
                </span>

                <span>
                    ${recipe.carbs}g carbs
                </span>

                <span>
                    ${recipe.sugar}g sugar
                </span>

            </div>


            <p class="desc">
                ${recipe.description}
            </p>


            <button
                onclick="viewRecipe(${recipe.id})"
            >
                View Nutrition
            </button>
        `;


        container.appendChild(card);
    });
}


/* ========================
   VIEW RECIPE
======================== */

async function viewRecipe(id) {

    try {

        const response = await fetch(
            `${API_URL}/recipes/${id}`,
            FETCH_OPTIONS
        );


        if (!response.ok) {
            throw new Error(
                "Recipe unavailable"
            );
        }


        const recipe =
            await response.json();


        openModal(recipe);

    } catch (error) {

        console.error(error);

        alert(
            "Unable to retrieve recipe."
        );
    }
}


/* ========================
   MODAL
======================== */

function openModal(recipe) {

    const body =
        document.getElementById(
            "modalBody"
        );


    body.innerHTML = `

        <div class="recipe-type">
            ${recipe.type}
        </div>


        <h3>
            ${recipe.name}
        </h3>


        <p class="desc">
            ${recipe.description}
        </p>


        <h4>Nutrition</h4>


        <div class="nutrition-grid">

            <div>
                <strong>
                    ${recipe.protein}g
                </strong>

                <span>
                    Protein
                </span>
            </div>


            <div>
                <strong>
                    ${recipe.carbs}g
                </strong>

                <span>
                    Carbs
                </span>
            </div>


            <div>
                <strong>
                    ${recipe.sugar}g
                </strong>

                <span>
                    Sugar
                </span>
            </div>


            <div>
                <strong>
                    ${recipe.fiber}g
                </strong>

                <span>
                    Fiber
                </span>
            </div>


            <div>
                <strong>
                    ${recipe.sodium}mg
                </strong>

                <span>
                    Sodium
                </span>
            </div>

        </div>


        <h4>Ingredients</h4>


        <ul class="ingredients">

            ${(recipe.ingredients || [])
                .map(
                    ingredient =>
                    `<li>${ingredient}</li>`
                )
                .join("")}

        </ul>


        <h4>Steps</h4>


        <ol class="steps">

            ${(recipe.steps || [])
                .map(
                    step =>
                    `<li>${step}</li>`
                )
                .join("")}

        </ol>

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


/* ========================
   FILTER BUTTONS
======================== */

document
    .querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".filter-btn"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                this.classList.add(
                    "active"
                );


                selectedDiet =
                    this.dataset.diet;


                applyFiltersAndRender();
            }
        );

    });


document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        applyFiltersAndRender
    );


function clearSearch() {

    document.getElementById(
        "searchInput"
    ).value = "";

    selectedDiet = "all";


    document
        .querySelectorAll(".filter-btn")
        .forEach(btn =>
            btn.classList.remove("active")
        );


    document
        .querySelector(
            '[data-diet="all"]'
        )
        .classList
        .add("active");


    applyFiltersAndRender();
}


loadRecipes();