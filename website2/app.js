/* =========================================
   CONFIGURATION
========================================= */

const API_URL =
    "https://cs-301-martin-benitez-api.vercel.app";


const API_KEY =
    "recipe-api-key-123";


const FETCH_OPTIONS = {

    headers: {

        "x-api-key": API_KEY

    }

};



/* =========================================
   DATA
========================================= */

let recipes = [];

let matchingRecipes = [];

let currentRecipe = null;



/* =========================================
   LOAD RECIPES FROM API
========================================= */

async function loadRecipes() {

    try {

        const response = await fetch(
            `${API_URL}/recipes`,
            FETCH_OPTIONS
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load recipes."
            );

        }


        const data =
            await response.json();


        recipes =
            data.recipes || [];


        console.log(
            `${recipes.length} recipes loaded.`
        );

    }

    catch (error) {

        console.error(error);


        showGeneratorMessage(
            "Unable to connect to the Recipe API."
        );

    }

}



/* =========================================
   GENERATE BUDGET RECIPE
========================================= */

function generateBudgetRecipe() {

    const budget =
        Number(
            document
                .getElementById("budgetInput")
                .value
        );


    const people =
        Number(
            document
                .getElementById("peopleInput")
                .value
        );


    const cuisine =
        document
            .getElementById("cuisineInput")
            .value;


    const difficulty =
        document
            .getElementById("difficultyInput")
            .value;



    /* =====================================
       VALIDATION
    ===================================== */

    if (!budget || budget <= 0) {

        showGeneratorMessage(
            "Please enter a valid budget."
        );

        return;

    }


    if (!people || people <= 0) {

        showGeneratorMessage(
            "Please enter the number of people."
        );

        return;

    }


    if (!recipes.length) {

        showGeneratorMessage(
            "Recipes are still loading. Please try again."
        );

        return;

    }



    /* =====================================
       FILTER RECIPES
    ===================================== */

    matchingRecipes =
        recipes.filter(recipe => {


            /* ---------------------------------
               Estimated Cost
            --------------------------------- */

            const baseCost =
                Number(
                    recipe.estimated_cost
                );


            const baseServings =
                Number(
                    recipe.servings
                );


            /*
                If estimated_cost does not exist,
                do not include the recipe.
            */

            if (
                !Number.isFinite(baseCost) ||
                !Number.isFinite(baseServings) ||
                baseServings <= 0
            ) {

                return false;

            }



            /* ---------------------------------
               Adjust Cost Based on People
            --------------------------------- */

            const adjustedCost =
                calculateAdjustedCost(
                    baseCost,
                    baseServings,
                    people
                );


            /* ---------------------------------
               Budget Check
            --------------------------------- */

            const withinBudget =
                adjustedCost <= budget;



            /* ---------------------------------
               Cuisine Check
            --------------------------------- */

            const matchesCuisine =

                cuisine === "all" ||

                recipe.type === cuisine;



            /* ---------------------------------
               Difficulty Check
            --------------------------------- */

            const matchesDifficulty =

                difficulty === "all" ||

                recipe.difficulty === difficulty;



            return (

                withinBudget &&

                matchesCuisine &&

                matchesDifficulty

            );

        });



    /* =====================================
       NO MATCH
    ===================================== */

    if (
        matchingRecipes.length === 0
    ) {

        showNoMatch(
            budget,
            people
        );

        return;

    }



    /* =====================================
       RANDOM RECIPE
    ===================================== */

    const randomIndex =
        Math.floor(
            Math.random() *
            matchingRecipes.length
        );


    currentRecipe =
        matchingRecipes[randomIndex];


    displayGeneratedRecipe(
        currentRecipe,
        budget,
        people
    );

}



/* =========================================
   CALCULATE ADJUSTED COST
========================================= */

function calculateAdjustedCost(
    baseCost,
    baseServings,
    people
) {

    const costPerServing =
        baseCost / baseServings;


    return (
        costPerServing *
        people
    );

}



/* =========================================
   DISPLAY GENERATED RECIPE
========================================= */

function displayGeneratedRecipe(
    recipe,
    budget,
    people
) {

    const result =
        document.getElementById(
            "generatorResult"
        );


    const adjustedCost =
        calculateAdjustedCost(
            recipe.estimated_cost,
            recipe.servings,
            people
        );


    const costPerPerson =
        adjustedCost / people;


    const remainingBudget =
        budget - adjustedCost;



    result.innerHTML = `

        <div class="generated-recipe">

            <div class="generated-top">

                <span class="success-label">
                    BUDGET MATCH
                </span>

                <span class="rating">
                    ${recipe.rating} ★
                </span>

            </div>


            <div class="recipe-cuisine">
                ${recipe.type}
            </div>


            <h2>
                ${recipe.name}
            </h2>


            <p class="generated-description">

                ${recipe.description}

            </p>



            <div class="budget-summary">


                <div>

                    <span>
                        Your Budget
                    </span>

                    <strong>
                        ₱${formatMoney(budget)}
                    </strong>

                </div>


                <div>

                    <span>
                        Estimated Cost
                    </span>

                    <strong>
                        ₱${formatMoney(adjustedCost)}
                    </strong>

                </div>


                <div>

                    <span>
                        Remaining
                    </span>

                    <strong class="remaining">
                        ₱${formatMoney(remainingBudget)}
                    </strong>

                </div>

            </div>



            <div class="recipe-information">


                <div>

                    <span>
                        People
                    </span>

                    <strong>
                        ${people}
                    </strong>

                </div>


                <div>

                    <span>
                        Per Person
                    </span>

                    <strong>
                        ₱${formatMoney(costPerPerson)}
                    </strong>

                </div>


                <div>

                    <span>
                        Difficulty
                    </span>

                    <strong>
                        ${recipe.difficulty}
                    </strong>

                </div>

            </div>



            <div class="ingredient-preview">

                <span class="preview-title">
                    Main ingredients
                </span>

                <div class="ingredient-tags">

                    ${recipe.ingredients
                        .slice(0, 5)
                        .map(
                            ingredient =>
                            `<span>${ingredient}</span>`
                        )
                        .join("")
                    }

                </div>

            </div>



            <div class="result-actions">


                <button
                    type="button"
                    onclick="viewCurrentRecipe()"
                    class="details-button"
                >
                    View Recipe
                </button>


                <button
                    type="button"
                    onclick="generateAnotherRecipe()"
                    class="another-button"
                >
                    Generate Another
                </button>

            </div>

        </div>

    `;

}



/* =========================================
   GENERATE ANOTHER MATCH
========================================= */

function generateAnotherRecipe() {

    if (
        matchingRecipes.length === 0
    ) {

        return;

    }


    if (
        matchingRecipes.length === 1
    ) {

        generateBudgetRecipe();

        return;

    }


    let nextRecipe;


    do {

        const randomIndex =
            Math.floor(
                Math.random() *
                matchingRecipes.length
            );


        nextRecipe =
            matchingRecipes[randomIndex];

    }

    while (
        currentRecipe &&
        nextRecipe.id === currentRecipe.id
    );


    currentRecipe =
        nextRecipe;


    const budget =
        Number(
            document
                .getElementById("budgetInput")
                .value
        );


    const people =
        Number(
            document
                .getElementById("peopleInput")
                .value
        );


    displayGeneratedRecipe(
        currentRecipe,
        budget,
        people
    );

}



/* =========================================
   VIEW CURRENT RECIPE
========================================= */

function viewCurrentRecipe() {

    if (!currentRecipe) {

        return;

    }


    openModal(
        currentRecipe
    );

}



/* =========================================
   MODAL
========================================= */

function openModal(recipe) {

    const body =
        document.getElementById(
            "modalBody"
        );


    const people =
        Number(
            document
                .getElementById("peopleInput")
                .value
        );


    const adjustedCost =
        calculateAdjustedCost(
            recipe.estimated_cost,
            recipe.servings,
            people
        );



    const allergens =

        recipe.allergen &&
        recipe.allergen.length > 0

            ? recipe.allergen
                .map(
                    allergen =>
                    `
                    <span class="allergen-tag">
                        ${allergen}
                    </span>
                    `
                )
                .join("")

            : `
                <span class="allergen-tag">
                    None
                </span>
            `;



    body.innerHTML = `

        <div class="recipe-cuisine">
            ${recipe.type}
        </div>


        <h2>
            ${recipe.name}
        </h2>


        <p class="modal-description">
            ${recipe.description}
        </p>



        <div class="modal-cost">

            <div>

                <span>
                    Estimated Cost
                </span>

                <strong>
                    ₱${formatMoney(adjustedCost)}
                </strong>

            </div>


            <div>

                <span>
                    People
                </span>

                <strong>
                    ${people}
                </strong>

            </div>


            <div>

                <span>
                    Difficulty
                </span>

                <strong>
                    ${recipe.difficulty}
                </strong>

            </div>

        </div>



        <h3>
            Ingredients
        </h3>


        <ul class="ingredients">

            ${recipe.ingredients
                .map(
                    ingredient =>
                    `<li>${ingredient}</li>`
                )
                .join("")
            }

        </ul>



        <h3>
            Cooking Steps
        </h3>


        <ol class="steps">

            ${recipe.steps
                .map(
                    step =>
                    `<li>${step}</li>`
                )
                .join("")
            }

        </ol>



        <h3>
            Nutrition
        </h3>


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



        <h3>
            Allergens
        </h3>


        <div>
            ${allergens}
        </div>

    `;



    document
        .getElementById(
            "modalOverlay"
        )
        .classList
        .add("open");


    document.body.style.overflow =
        "hidden";

}



/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

    document
        .getElementById(
            "modalOverlay"
        )
        .classList
        .remove("open");


    document.body.style.overflow =
        "";

}



/* =========================================
   NO MATCH
========================================= */

function showNoMatch(
    budget,
    people
) {

    const result =
        document.getElementById(
            "generatorResult"
        );


    result.innerHTML = `

        <div class="empty-result">

            <div class="result-icon warning">
                !
            </div>


            <h3>
                No recipe found
            </h3>


            <p>

                We could not find a recipe
                for ${people} people within
                a ₱${formatMoney(budget)} budget.

            </p>


            <p class="suggestion">

                Try increasing your budget,
                reducing the number of people,
                or selecting Any Cuisine.

            </p>

        </div>

    `;

}



/* =========================================
   MESSAGE
========================================= */

function showGeneratorMessage(
    message
) {

    const result =
        document.getElementById(
            "generatorResult"
        );


    result.innerHTML = `

        <div class="empty-result">

            <div class="result-icon warning">
                !
            </div>

            <h3>
                Generator
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;

}



/* =========================================
   FORMAT MONEY
========================================= */

function formatMoney(value) {

    return Number(value)
        .toFixed(2);

}



/* =========================================
   RESET GENERATOR
========================================= */

function resetGenerator() {

    document
        .getElementById(
            "budgetInput"
        )
        .value = "";


    document
        .getElementById(
            "peopleInput"
        )
        .value = 2;


    document
        .getElementById(
            "cuisineInput"
        )
        .value = "all";


    document
        .getElementById(
            "difficultyInput"
        )
        .value = "all";


    matchingRecipes = [];

    currentRecipe = null;


    document
        .getElementById(
            "generatorResult"
        )
        .innerHTML = `

            <div class="empty-result">

                <div class="result-icon">
                    ₱
                </div>

                <h3>
                    Your meal will appear here
                </h3>

                <p>

                    Enter your budget and number
                    of people, then press
                    Generate Meal.

                </p>

            </div>

        `;

}



/* =========================================
   MODAL EVENTS
========================================= */

document
    .getElementById(
        "modalOverlay"
    )
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target.id ===
                "modalOverlay"
            ) {

                closeModal();

            }

        }
    );



document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);



/* =========================================
   ENTER KEY
========================================= */

document
    .getElementById(
        "budgetInput"
    )
    .addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                generateBudgetRecipe();

            }

        }
    );



/* =========================================
   START APPLICATION
========================================= */

loadRecipes();
