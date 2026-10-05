// =====================================
// MOTION.DEV
// =====================================

import {
    animate,
    stagger,
    inView
} from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";


// =====================================
// API CONFIGURATION
// =====================================

const API_URL =
    "https://cs-301-martin-benitez-api.vercel.app";

const API_KEY =
    "recipe-api-key-123";

const FETCH_OPTIONS = {
    headers: {
        "x-api-key": API_KEY
    }
};


// Store all recipes from API
let recipes = [];


// Check if user prefers reduced animations
const reduceMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


// =====================================
// LOAD RECIPES
// =====================================

async function loadRecipes() {

    const container =
        document.getElementById("recipeList");

    try {

        const response = await fetch(
            `${API_URL}/recipes`,
            FETCH_OPTIONS
        );


        if (!response.ok) {

            throw new Error(
                `Unable to load recipes. Status: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Recipe API data:",
            data
        );


        recipes =
            data.recipes || [];


        displayBudgetRecipes(
            recipes
        );

    }

    catch (error) {

        console.error(
            "Recipe API Error:",
            error
        );


        container.innerHTML = `

            <div class="dashboard-card">

                <div
                    class="
                        tw-flex
                        tw-items-center
                        tw-gap-3
                    "
                >

                    <i
                        class="
                            bi
                            bi-exclamation-circle
                            tw-text-xl
                        "
                    ></i>

                    <div>

                        <strong>
                            Unable to connect to recipe API.
                        </strong>

                        <p
                            class="
                                tw-text-sm
                                tw-text-gray-500
                                tw-mb-0
                                tw-mt-1
                            "
                        >
                            Please check your API connection.
                        </p>

                    </div>

                </div>

            </div>

        `;


        animateErrorMessage();

    }

}


// =====================================
// DISPLAY BUDGET RECIPES
// =====================================

function displayBudgetRecipes(data) {

    const container =
        document.getElementById("recipeList");


    container.innerHTML = "";


    // =====================================
    // NO RECIPES
    // =====================================

    if (data.length === 0) {

        container.innerHTML = `

            <div class="dashboard-card">

                <div
                    class="
                        tw-flex
                        tw-items-center
                        tw-gap-3
                    "
                >

                    <i
                        class="
                            bi
                            bi-search
                            tw-text-xl
                        "
                    ></i>

                    <div>

                        <strong>
                            No recipes found.
                        </strong>

                        <p
                            class="
                                tw-text-sm
                                tw-text-gray-500
                                tw-mb-0
                                tw-mt-1
                            "
                        >
                            Try selecting another budget.
                        </p>

                    </div>

                </div>

            </div>

        `;


        animateEmptyMessage();

        return;

    }


    // =====================================
    // CREATE RECIPE CARDS
    // =====================================

    data.forEach(recipe => {

        const card =
            document.createElement("div");


        card.className =
            "recipe-card-budget";


        // -------------------------------------
        // COST
        // -------------------------------------

        let costText =
            "Cost not set";


        let servingCost =
            "Price per serving unavailable";


        if (
            recipe.estimated_cost !== null &&
            recipe.estimated_cost !== undefined
        ) {

            const estimatedCost =
                Number(
                    recipe.estimated_cost
                );


            costText =
                `₱${estimatedCost.toFixed(2)}`;


            if (recipe.servings) {

                const costPerServing =
                    estimatedCost /
                    Number(recipe.servings);


                servingCost =
                    `₱${costPerServing.toFixed(2)} per serving`;

            }

        }


        // -------------------------------------
        // DESCRIPTION
        // -------------------------------------

        const description =
            recipe.description ||
            "No description available.";


        // -------------------------------------
        // TYPE
        // -------------------------------------

        const type =
            recipe.type ||
            "Recipe";


        // -------------------------------------
        // DIFFICULTY
        // -------------------------------------

        const difficulty =
            recipe.difficulty ||
            "Easy";


        // -------------------------------------
        // RATING
        // -------------------------------------

        const rating =
            recipe.rating ||
            0;


        // -------------------------------------
        // SERVINGS
        // -------------------------------------

        const servings =
            recipe.servings ||
            0;


        // =====================================
        // CARD HTML
        // =====================================

        card.innerHTML = `

            <div class="recipe-card-content">

                <!-- Recipe type -->

                <div class="recipe-type">

                    ${type}

                </div>


                <!-- Recipe name -->

                <h4
                    class="
                        tw-mt-2
                        tw-font-semibold
                        tw-text-xl
                    "
                >

                    ${recipe.name}

                </h4>


                <!-- Description -->

                <p
                    class="
                        recipe-description
                        tw-text-sm
                        tw-text-gray-500
                        tw-mt-2
                    "
                >

                    ${description}

                </p>


                <!-- Price -->

                <div class="recipe-price">

                    ${costText}

                </div>


                <!-- Per serving -->

                <div
                    class="
                        tw-text-sm
                        tw-text-gray-500
                        tw-mb-4
                    "
                >

                    ${servingCost}

                </div>


                <!-- Recipe information -->

                <div
                    class="
                        tw-flex
                        tw-gap-2
                        tw-flex-wrap
                        tw-mb-5
                    "
                >

                    <span
                        class="
                            badge
                            text-bg-light
                            recipe-badge
                        "
                    >

                        <i
                            class="
                                bi
                                bi-people
                                tw-mr-1
                            "
                        ></i>

                        ${servings}
                        servings

                    </span>


                    <span
                        class="
                            badge
                            text-bg-light
                            recipe-badge
                        "
                    >

                        <i
                            class="
                                bi
                                bi-speedometer2
                                tw-mr-1
                            "
                        ></i>

                        ${difficulty}

                    </span>


                    <span
                        class="
                            badge
                            text-bg-light
                            recipe-badge
                        "
                    >

                        <i
                            class="
                                bi
                                bi-star-fill
                                tw-mr-1
                            "
                        ></i>

                        ${rating}

                    </span>

                </div>


                <!-- Button -->

                <button
                    type="button"
                    class="
                        btn
                        btn-dark
                        w-100
                        view-recipe-btn
                    "
                    data-recipe-id="${recipe.id || ""}"
                >

                    <span>
                        View Recipe
                    </span>

                    <i
                        class="
                            bi
                            bi-arrow-right
                            tw-ml-2
                        "
                    ></i>

                </button>

            </div>

        `;


        // Add card to page
        container.appendChild(
            card
        );

    });


    // Animate cards after they exist
    animateRecipeCards();


    // Add button interactions
    setupRecipeButtons();

}


// =====================================
// RECIPE BUTTONS
// =====================================

function setupRecipeButtons() {

    const buttons =
        document.querySelectorAll(
            ".view-recipe-btn"
        );


    buttons.forEach(button => {

        // -----------------------------
        // Mouse enter
        // -----------------------------

        button.addEventListener(
            "mouseenter",
            () => {

                if (reduceMotion) {
                    return;
                }


                animate(
                    button,
                    {
                        scale: 1.02
                    },
                    {
                        duration: 0.2
                    }
                );

            }
        );


        // -----------------------------
        // Mouse leave
        // -----------------------------

        button.addEventListener(
            "mouseleave",
            () => {

                if (reduceMotion) {
                    return;
                }


                animate(
                    button,
                    {
                        scale: 1
                    },
                    {
                        duration: 0.2
                    }
                );

            }
        );


        // -----------------------------
        // Click
        // -----------------------------

        button.addEventListener(
            "click",
            () => {

                const recipeId =
                    button.dataset.recipeId;


                console.log(
                    "Selected recipe ID:",
                    recipeId
                );


                if (!reduceMotion) {

                    animate(
                        button,
                        {
                            scale: [
                                1,
                                0.96,
                                1
                            ]
                        },
                        {
                            duration: 0.3
                        }
                    );

                }

            }
        );

    });

}


// =====================================
// BUDGET FILTER
// =====================================

const budgetFilter =
    document.getElementById(
        "budgetFilter"
    );


if (budgetFilter) {

    budgetFilter.addEventListener(
        "change",
        function () {

            const selected =
                this.value;


            // =====================================
            // ALL
            // =====================================

            if (selected === "all") {

                displayBudgetRecipes(
                    recipes
                );

                return;

            }


            // =====================================
            // CONVERT BUDGET
            // =====================================

            const maxBudget =
                Number(selected);


            // =====================================
            // FILTER RECIPES
            // =====================================

            const filtered =
                recipes.filter(
                    recipe => {

                        const estimatedCost =
                            Number(
                                recipe.estimated_cost
                            );


                        return (
                            !Number.isNaN(
                                estimatedCost
                            ) &&
                            estimatedCost <=
                            maxBudget
                        );

                    }
                );


            // =====================================
            // DISPLAY FILTERED
            // =====================================

            displayBudgetRecipes(
                filtered
            );

        }
    );

}


// =====================================
// MOTION
// PAGE LOAD ANIMATIONS
// =====================================

function setupPageAnimations() {

    if (reduceMotion) {
        return;
    }


    // =====================================
    // SIDEBAR
    // =====================================

    const sidebar =
        document.querySelector(
            "aside"
        );


    if (sidebar) {

        animate(
            sidebar,
            {
                opacity: [
                    0,
                    1
                ],

                x: [
                    -40,
                    0
                ]
            },
            {
                duration: 0.65,

                ease: [
                    0.25,
                    0.1,
                    0.25,
                    1
                ]
            }
        );

    }


    // =====================================
    // SIDEBAR LOGO
    // =====================================

    const sidebarLogo =
        document.querySelector(
            "aside > div:first-child"
        );


    if (sidebarLogo) {

        animate(
            sidebarLogo,
            {
                opacity: [
                    0,
                    1
                ],

                y: [
                    -15,
                    0
                ]
            },
            {
                duration: 0.5,

                delay: 0.2
            }
        );

    }


    // =====================================
    // SIDEBAR LINKS
    // =====================================

    const sidebarLinks =
        document.querySelectorAll(
            ".sidebar-link"
        );


    if (sidebarLinks.length > 0) {

        animate(
            sidebarLinks,
            {
                opacity: [
                    0,
                    1
                ],

                x: [
                    -20,
                    0
                ]
            },
            {
                duration: 0.45,

                delay:
                    stagger(
                        0.07,
                        {
                            startDelay: 0.25
                        }
                    ),

                ease: "easeOut"
            }
        );

    }


    // =====================================
    // MAIN HEADER
    // =====================================

    const mainHeader =
        document.querySelector(
            "main > div:first-child"
        );


    if (mainHeader) {

        animate(
            mainHeader,
            {
                opacity: [
                    0,
                    1
                ],

                y: [
                    -25,
                    0
                ]
            },
            {
                duration: 0.6,

                delay: 0.15,

                ease: "easeOut"
            }
        );

    }


    // =====================================
    // DASHBOARD CARDS
    // =====================================

    setupDashboardCardAnimations();


    // =====================================
    // BUDGET CHART
    // =====================================

    setupBudgetChartAnimation();


    // =====================================
    // PROGRESS BARS
    // =====================================

    setupProgressBarAnimations();


    // =====================================
    // TRANSACTIONS
    // =====================================

    setupTransactionAnimations();


    // =====================================
    // PLAN ITEMS
    // =====================================

    setupPlanAnimations();


    // =====================================
    // SAVINGS GOALS
    // =====================================

    setupSavingsAnimation();

}


// =====================================
// DASHBOARD CARD SCROLL ANIMATION
// =====================================

function setupDashboardCardAnimations() {

    const cards =
        document.querySelectorAll(
            ".dashboard-card"
        );


    cards.forEach(card => {

        inView(
            card,

            element => {

                animate(
                    element,
                    {
                        opacity: [
                            0,
                            1
                        ],

                        y: [
                            35,
                            0
                        ],

                        scale: [
                            0.97,
                            1
                        ]
                    },
                    {
                        duration: 0.55,

                        ease: [
                            0.25,
                            0.1,
                            0.25,
                            1
                        ]
                    }
                );

            },

            {
                amount: 0.2
            }
        );

    });

}


// =====================================
// BUDGET DONUT CHART
// =====================================

function setupBudgetChartAnimation() {

    const chart =
        document.querySelector(
            ".budget-chart"
        );


    if (!chart) {
        return;
    }


    inView(
        chart,

        element => {

            animate(
                element,
                {
                    opacity: [
                        0,
                        1
                    ],

                    scale: [
                        0.65,
                        1
                    ],

                    rotate: [
                        -20,
                        0
                    ]
                },
                {
                    duration: 0.8,

                    ease: [
                        0.22,
                        1,
                        0.36,
                        1
                    ]
                }
            );


            // Center text animation

            const center =
                element.querySelector(
                    ".budget-chart-center"
                );


            if (center) {

                animate(
                    center,
                    {
                        opacity: [
                            0,
                            1
                        ],

                        scale: [
                            0.8,
                            1
                        ]
                    },
                    {
                        duration: 0.5,

                        delay: 0.35
                    }
                );

            }

        },

        {
            amount: 0.4
        }
    );

}


// =====================================
// PROGRESS BARS
// =====================================

function setupProgressBarAnimations() {

    const progressBars =
        document.querySelectorAll(
            ".progress-bar"
        );


    progressBars.forEach(bar => {

        const finalWidth =
            bar.style.width;


        if (!finalWidth) {
            return;
        }


        // Start at zero
        bar.style.width =
            "0%";


        inView(
            bar,

            element => {

                animate(
                    element,
                    {
                        width: [
                            "0%",
                            finalWidth
                        ]
                    },
                    {
                        duration: 1,

                        ease: [
                            0.22,
                            1,
                            0.36,
                            1
                        ]
                    }
                );

            },

            {
                amount: 0.3
            }
        );

    });

}


// =====================================
// TRANSACTION ANIMATIONS
// =====================================

function setupTransactionAnimations() {

    const expenseSection =
        document.getElementById(
            "expenses"
        );


    if (!expenseSection) {
        return;
    }


    inView(
        expenseSection,

        () => {

            const transactions =
                expenseSection.querySelectorAll(
                    ".transaction"
                );


            if (
                transactions.length === 0
            ) {

                return;

            }


            animate(
                transactions,
                {
                    opacity: [
                        0,
                        1
                    ],

                    x: [
                        -25,
                        0
                    ]
                },
                {
                    duration: 0.45,

                    delay:
                        stagger(
                            0.1
                        ),

                    ease: "easeOut"
                }
            );

        },

        {
            amount: 0.2
        }
    );

}


// =====================================
// PLAN ITEM ANIMATIONS
// =====================================

function setupPlanAnimations() {

    const planItems =
        document.querySelectorAll(
            ".plan-item"
        );


    if (
        planItems.length === 0
    ) {

        return;

    }


    inView(
        planItems[0],

        () => {

            animate(
                planItems,
                {
                    opacity: [
                        0,
                        1
                    ],

                    x: [
                        20,
                        0
                    ]
                },
                {
                    duration: 0.4,

                    delay:
                        stagger(
                            0.08
                        ),

                    ease: "easeOut"
                }
            );

        },

        {
            amount: 0.2
        }
    );

}


// =====================================
// SAVINGS GOALS
// =====================================

function setupSavingsAnimation() {

    const goals =
        document.getElementById(
            "goals"
        );


    if (!goals) {
        return;
    }


    inView(
        goals,

        element => {

            animate(
                element,
                {
                    opacity: [
                        0,
                        1
                    ],

                    y: [
                        25,
                        0
                    ]
                },
                {
                    duration: 0.6,

                    ease: "easeOut"
                }
            );

        },

        {
            amount: 0.2
        }
    );

}


// =====================================
// RECIPE CARD ANIMATION
// =====================================

function animateRecipeCards() {

    if (reduceMotion) {
        return;
    }


    const cards =
        document.querySelectorAll(
            ".recipe-card-budget"
        );


    if (
        cards.length === 0
    ) {

        return;

    }


    animate(
        cards,
        {
            opacity: [
                0,
                1
            ],

            y: [
                40,
                0
            ],

            scale: [
                0.95,
                1
            ]
        },
        {
            duration: 0.55,

            delay:
                stagger(
                    0.08
                ),

            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        }
    );

}


// =====================================
// EMPTY MESSAGE ANIMATION
// =====================================

function animateEmptyMessage() {

    if (reduceMotion) {
        return;
    }


    const card =
        document.querySelector(
            "#recipeList .dashboard-card"
        );


    if (!card) {
        return;
    }


    animate(
        card,
        {
            opacity: [
                0,
                1
            ],

            y: [
                20,
                0
            ]
        },
        {
            duration: 0.4
        }
    );

}


// =====================================
// ERROR MESSAGE ANIMATION
// =====================================

function animateErrorMessage() {

    if (reduceMotion) {
        return;
    }


    const card =
        document.querySelector(
            "#recipeList .dashboard-card"
        );


    if (!card) {
        return;
    }


    animate(
        card,
        {
            opacity: [
                0,
                1
            ],

            x: [
                -15,
                10,
                -7,
                0
            ]
        },
        {
            duration: 0.5
        }
    );

}


// =====================================
// SIDEBAR LINK CLICK ANIMATION
// =====================================

function setupSidebarInteractions() {

    const links =
        document.querySelectorAll(
            ".sidebar-link"
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (reduceMotion) {
                    return;
                }


                animate(
                    link,
                    {
                        scale: [
                            1,
                            0.96,
                            1
                        ]
                    },
                    {
                        duration: 0.25
                    }
                );

            }
        );

    });

}


// =====================================
// ADD EXPENSE BUTTON ANIMATION
// =====================================

function setupExpenseButtonAnimation() {

    const button =
        document.querySelector(
            '[data-bs-target="#expenseModal"]'
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "mouseenter",
        () => {

            if (reduceMotion) {
                return;
            }


            animate(
                button,
                {
                    scale: 1.04,

                    y: -2
                },
                {
                    duration: 0.2
                }
            );

        }
    );


    button.addEventListener(
        "mouseleave",
        () => {

            if (reduceMotion) {
                return;
            }


            animate(
                button,
                {
                    scale: 1,

                    y: 0
                },
                {
                    duration: 0.2
                }
            );

        }
    );

}


// =====================================
// MODAL ANIMATION
// =====================================

function setupModalAnimation() {

    const modal =
        document.getElementById(
            "expenseModal"
        );


    if (!modal) {
        return;
    }


    modal.addEventListener(
        "shown.bs.modal",
        () => {

            if (reduceMotion) {
                return;
            }


            const modalContent =
                modal.querySelector(
                    ".modal-content"
                );


            if (!modalContent) {
                return;
            }


            animate(
                modalContent,
                {
                    opacity: [
                        0,
                        1
                    ],

                    y: [
                        30,
                        0
                    ],

                    scale: [
                        0.95,
                        1
                    ]
                },
                {
                    duration: 0.35,

                    ease: [
                        0.22,
                        1,
                        0.36,
                        1
                    ]
                }
            );

        }
    );

}


// =====================================
// INITIALIZE WEBSITE
// =====================================

function initializeWebsite() {

    // Setup Motion animations
    setupPageAnimations();


    // Sidebar interactions
    setupSidebarInteractions();


    // Expense button
    setupExpenseButtonAnimation();


    // Bootstrap modal + Motion
    setupModalAnimation();


    // Get recipe API data
    loadRecipes();

}


// =====================================
// START
// =====================================

initializeWebsite();