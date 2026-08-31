const API_URL = "https://cs-301-martin-benitez-api.vercel.app";

let currentRecipes = [];

// SCROLL-REVEAL OBSERVER
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

function observeCards() {
    document.querySelectorAll(".recipe-card:not(.visible)").forEach(card => {
        revealObserver.observe(card);
    });
}


// GET ALL RECIPES
async function loadRecipes() {
    setLoadingState();

    try {
        const response = await fetch(`${API_URL}/recipes`);
        const data = await response.json();

        displayRecipes(data.recipes);
    }

    catch (error) {
        console.error(error);
        showError("Unable to connect to the API.");
    }
}


// SET LOADING STATE
function setLoadingState() {
    const recipeList = document.getElementById("recipeList");
    recipeList.classList.add("loading-state");
    recipeList.innerHTML = "Loading recipes...";
}


// SHOW ERROR
function showError(message) {
    const recipeList = document.getElementById("recipeList");
    recipeList.classList.add("loading-state");
    recipeList.innerHTML = message;
}


// DISPLAY RECIPES
function displayRecipes(recipes) {

    currentRecipes = recipes;

    const recipeList = document.getElementById("recipeList");
    recipeList.classList.remove("loading-state");
    recipeList.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        recipeList.classList.add("loading-state");
        recipeList.innerHTML = "No recipes found.";
        return;
    }

    recipes.forEach((recipe, index) => {

        const card = document.createElement("div");
        card.className = "recipe-card";
        card.style.transitionDelay = `${Math.min(index, 8) * 60}ms`;

        card.innerHTML = `
            <div class="recipe-type">${recipe.type}</div>

            <h3>${recipe.name}</h3>

            <div class="meta">
                <span>${recipe.difficulty}</span>
                <span>${recipe.rating} ⭐</span>
                <span>${recipe.servings} servings</span>
            </div>

            <p class="desc">${recipe.description}</p>

            <button onclick="viewRecipe(${recipe.id})">
                View details
            </button>
        `;

        recipeList.appendChild(card);
    });

    // trigger reflow so the transition runs, then observe for scroll-reveal
    requestAnimationFrame(observeCards);
}


// GET ONE RECIPE
async function viewRecipe(id) {
    try {
        const response = await fetch(`${API_URL}/recipes/${id}`);
        const recipe = await response.json();

        openModal(recipe);
    }

    catch (error) {
        console.error(error);
        alert("Unable to retrieve recipe.");
    }
}


// OPEN MODAL WITH RECIPE DETAILS
function openModal(recipe) {
    const body = document.getElementById("modalBody");

    const allergens = recipe.allergen && recipe.allergen.length > 0
        ? recipe.allergen.map(a => `<span class="allergen-tag">${a}</span>`).join("")
        : `<span class="allergen-tag">None</span>`;

    body.innerHTML = `
        <div class="recipe-type">${recipe.type}</div>
        <h3>${recipe.name}</h3>

        <div class="meta">
            <span>${recipe.difficulty}</span>
            <span>${recipe.rating} ⭐</span>
            <span>${recipe.servings} servings</span>
        </div>

        <p class="desc">${recipe.description}</p>

        <h4>Ingredients</h4>
        <ul class="ingredients">
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>

        <h4>Steps</h4>
        <ol class="steps">
            ${recipe.steps.map(s => `<li>${s}</li>`).join("")}
        </ol>

        <h4>Nutrition</h4>
        <div class="nutrition-grid">
            <div><strong>${recipe.protein}g</strong><span>Protein</span></div>
            <div><strong>${recipe.carbs}g</strong><span>Carbs</span></div>
            <div><strong>${recipe.sugar}g</strong><span>Sugar</span></div>
            <div><strong>${recipe.fiber}g</strong><span>Fiber</span></div>
            <div><strong>${recipe.sodium}mg</strong><span>Sodium</span></div>
        </div>

        <h4>Allergens</h4>
        <div>${allergens}</div>
    `;

    document.getElementById("modalOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
}


// CLOSE MODAL
function closeModal() {
    document.getElementById("modalOverlay").classList.remove("open");
    document.body.style.overflow = "";
}

document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});


// SEARCH RECIPES
async function searchRecipes() {

    const query = document.getElementById("searchInput").value;

    if (!query) {
        loadRecipes();
        return;
    }

    setLoadingState();

    try {
        const response = await fetch(
            `${API_URL}/recipes/search?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        displayRecipes(data.results);
    }

    catch (error) {
        console.error(error);
        showError("Search failed.");
    }
}

document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchRecipes();
});


// LOAD RECIPES WHEN PAGE OPENS
loadRecipes();