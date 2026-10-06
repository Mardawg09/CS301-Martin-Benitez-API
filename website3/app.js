/* =========================================
   API CONFIGURATION
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

let currentPlan = [];



/* =========================================
   LOAD RECIPES
========================================= */

async function loadRecipes() {

    try {

        const response =
            await fetch(
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


        showPlannerMessage(
            "Unable to connect to the Recipe API."
        );

    }

}



/* =========================================
   DIET RULES
========================================= */

function matchesDiet(
    recipe,
    diet
) {

    switch (diet) {


        case "high-protein":

            return (
                Number(recipe.protein) >= 20
            );


        case "low-carb":

            return (
                Number(recipe.carbs) <= 30
            );


        case "low-sugar":

            return (
                Number(recipe.sugar) <= 10
            );


        case "high-fiber":

            return (
                Number(recipe.fiber) >= 5
            );


        case "low-sodium":

            return (
                Number(recipe.sodium) <= 500
            );


        default:

            return true;

    }

}



/* =========================================
   ALLERGEN CHECK
========================================= */

function avoidsAllergen(
    recipe,
    allergen
) {

    if (
        allergen === "none"
    ) {

        return true;

    }


    const recipeAllergens =
        Array.isArray(recipe.allergen)

            ? recipe.allergen.map(
                item =>
                    String(item)
                        .toLowerCase()
            )

            : [];


    return !recipeAllergens.includes(
        allergen.toLowerCase()
    );

}



/* =========================================
   GENERATE MEAL PLAN
========================================= */

function generateMealPlan() {


    /* GET FORM VALUES */

    const diet =
        document
            .getElementById(
                "dietInput"
            )
            .value;


    const mealCount =
        Number(
            document
                .getElementById(
                    "mealCountInput"
                )
                .value
        );


    const cuisine =
        document
            .getElementById(
                "cuisineInput"
            )
            .value;


    const difficulty =
        document
            .getElementById(
                "difficultyInput"
            )
            .value;


    const allergen =
        document
            .getElementById(
                "allergenInput"
            )
            .value;



    /* CHECK API DATA */

    if (
        recipes.length === 0
    ) {

        showPlannerMessage(
            "Recipes are still loading. Please try again."
        );

        return;

    }



    /* =====================================
       FILTER RECIPES
    ===================================== */

    const matches =
        recipes.filter(
            recipe => {


                const dietMatch =
                    matchesDiet(
                        recipe,
                        diet
                    );


                const cuisineMatch =

                    cuisine === "all" ||

                    recipe.type === cuisine;


                const difficultyMatch =

                    difficulty === "all" ||

                    recipe.difficulty ===
                    difficulty;


                const allergenMatch =
                    avoidsAllergen(
                        recipe,
                        allergen
                    );


                return (

                    dietMatch &&

                    cuisineMatch &&

                    difficultyMatch &&

                    allergenMatch

                );

            }
        );



    /* =====================================
       NO MATCH
    ===================================== */

    if (
        matches.length === 0
    ) {

        showNoPlan();

        return;

    }



    /* =====================================
       SHUFFLE RECIPES
    ===================================== */

    const shuffled =
        shuffleRecipes(matches);



    /* =====================================
       SELECT MEALS
    ===================================== */

    currentPlan =
        shuffled.slice(
            0,
            Math.min(
                mealCount,
                shuffled.length
            )
        );



    /* =====================================
       DISPLAY
    ===================================== */

    displayMealPlan(
        currentPlan,
        diet,
        mealCount
    );

}



/* =========================================
   SHUFFLE
========================================= */

function shuffleRecipes(
    recipeList
) {

    const copy =
        [...recipeList];


    for (
        let i =
            copy.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            copy[i],
            copy[j]
        ]
        =
        [
            copy[j],
            copy[i]
        ];

    }


    return copy;

}



/* =========================================
   DIET LABEL
========================================= */

function getDietLabel(
    diet
) {

    const labels = {

        "all":
            "Balanced / Any",

        "high-protein":
            "High Protein",

        "low-carb":
            "Low Carb",

        "low-sugar":
            "Low Sugar",

        "high-fiber":
            "High Fiber",

        "low-sodium":
            "Low Sodium"

    };


    return (
        labels[diet] ||
        "Meal Plan"
    );

}



/* =========================================
   DISPLAY MEAL PLAN
========================================= */

function displayMealPlan(
    plan,
    diet,
    requestedMeals
) {

    const result =
        document.getElementById(
            "plannerResult"
        );


    /* =====================================
       CALCULATE TOTAL NUTRITION
    ===================================== */

    const totals =
        calculateNutritionTotals(
            plan
        );



    /* =====================================
       CREATE MEAL CARDS
    ===================================== */

    const mealCards =
        plan.map(
            (recipe, index) => {

                return `

                    <article class="planned-meal">

                        <div class="meal-top">

                            <span class="meal-number">

                                MEAL
                                ${index + 1}

                            </span>


                            <span class="meal-rating">

                                ${recipe.rating}
                                ★

                            </span>

                        </div>


                        <div class="recipe-cuisine">

                            ${recipe.type}

                        </div>


                        <h3>

                            ${recipe.name}

                        </h3>


                        <p>

                            ${recipe.description}

                        </p>


                        <div class="meal-nutrition">


                            <span>

                                <strong>
                                    ${recipe.protein}g
                                </strong>

                                Protein

                            </span>


                            <span>

                                <strong>
                                    ${recipe.carbs}g
                                </strong>

                                Carbs

                            </span>


                            <span>

                                <strong>
                                    ${recipe.sugar}g
                                </strong>

                                Sugar

                            </span>


                        </div>


                        <button
                            type="button"
                            onclick="viewRecipe(${recipe.id})"
                        >

                            View Recipe

                        </button>

                    </article>

                `;

            }
        )
        .join("");



    /* =====================================
       WARNING IF FEWER MATCHES EXIST
    ===================================== */

    const limitedMessage =

        plan.length < requestedMeals

            ? `

                <div class="plan-notice">

                    Only ${plan.length}
                    matching recipe${plan.length === 1 ? "" : "s"}
                    could be found using your current filters.

                </div>

            `

            : "";



    /* =====================================
       OUTPUT
    ===================================== */

    result.innerHTML = `

        <div class="generated-plan">


            <div class="plan-header">

                <div>

                    <span class="success-label">
                        PLAN GENERATED
                    </span>


                    <h2>

                        ${getDietLabel(diet)}
                        Meal Plan

                    </h2>

                </div>


                <button
                    type="button"
                    class="another-plan-button"
                    onclick="generateMealPlan()"
                >

                    Generate Another

                </button>

            </div>


            ${limitedMessage}


            <div class="meal-plan-grid">

                ${mealCards}

            </div>



            <div class="nutrition-summary">


                <div class="summary-heading">

                    <span>
                        COMBINED VALUES
                    </span>


                    <h3>
                        Plan Nutrition Summary
                    </h3>

                </div>



                <div class="summary-grid">


                    <div>

                        <strong>
                            ${totals.protein}g
                        </strong>

                        <span>
                            Protein
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${totals.carbs}g
                        </strong>

                        <span>
                            Carbs
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${totals.sugar}g
                        </strong>

                        <span>
                            Sugar
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${totals.fiber}g
                        </strong>

                        <span>
                            Fiber
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${totals.sodium}mg
                        </strong>

                        <span>
                            Sodium
                        </span>

                    </div>


                </div>


                <p class="summary-note">

                    These totals simply add the nutrition
                    values stored in the selected recipe
                    records. They are not daily nutritional
                    recommendations.

                </p>


            </div>

        </div>

    `;

}



/* =========================================
   NUTRITION TOTALS
========================================= */

function calculateNutritionTotals(
    plan
) {

    return plan.reduce(

        (
            total,
            recipe
        ) => {


            total.protein +=
                Number(
                    recipe.protein || 0
                );


            total.carbs +=
                Number(
                    recipe.carbs || 0
                );


            total.sugar +=
                Number(
                    recipe.sugar || 0
                );


            total.fiber +=
                Number(
                    recipe.fiber || 0
                );


            total.sodium +=
                Number(
                    recipe.sodium || 0
                );


            return total;

        },

        {

            protein: 0,

            carbs: 0,

            sugar: 0,

            fiber: 0,

            sodium: 0

        }

    );

}



/* =========================================
   VIEW ONE RECIPE
========================================= */

function viewRecipe(
    id
) {

    const recipe =
        recipes.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!recipe) {

        return;

    }


    openModal(
        recipe
    );

}



/* =========================================
   OPEN MODAL
========================================= */

function openModal(
    recipe
) {

    const body =
        document.getElementById(
            "modalBody"
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


        <div class="modal-meta">


            <span>

                ${recipe.difficulty}

            </span>


            <span>

                ${recipe.rating} ★

            </span>


            <span>

                ${recipe.servings}
                servings

            </span>


        </div>


        <p class="modal-description">

            ${recipe.description}

        </p>



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

function showNoPlan() {

    const result =
        document.getElementById(
            "plannerResult"
        );


    result.innerHTML = `

        <div class="empty-result">

            <div class="result-icon warning">

                !

            </div>


            <h3>
                No matching meals found
            </h3>


            <p>

                Your current combination of diet,
                cuisine, difficulty, and allergen
                filters did not match any recipes.

            </p>


            <p class="suggestion">

                Try selecting Any Cuisine,
                Any Difficulty, or another
                nutrition preference.

            </p>

        </div>

    `;

}



/* =========================================
   MESSAGE
========================================= */

function showPlannerMessage(
    message
) {

    const result =
        document.getElementById(
            "plannerResult"
        );


    result.innerHTML = `

        <div class="empty-result">

            <div class="result-icon warning">

                !

            </div>


            <h3>
                Meal Planner
            </h3>


            <p>

                ${message}

            </p>

        </div>

    `;

}



/* =========================================
   RESET
========================================= */

function resetPlanner() {

    document
        .getElementById(
            "dietInput"
        )
        .value = "all";


    document
        .getElementById(
            "mealCountInput"
        )
        .value = "3";


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


    document
        .getElementById(
            "allergenInput"
        )
        .value = "none";


    currentPlan = [];


    document
        .getElementById(
            "plannerResult"
        )
        .innerHTML = `

            <div class="empty-result">

                <div class="result-icon">

                    +

                </div>


                <h3>

                    Your meal plan will appear here

                </h3>


                <p>

                    Choose your preferences and
                    press Generate Meal Plan.

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
        function (
            event
        ) {

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
    function (
        event
    ) {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal();

        }

    }
);



/* =========================================
   START APPLICATION
========================================= */

loadRecipes();
