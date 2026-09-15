// ============ CONFIG ============
const API_URL = "https://cs-301-martin-benitez-api.vercel.app";
const API_KEY = "recipe-api-key-123";

const FETCH_OPTIONS = {
    headers: { "x-api-key": API_KEY }
};

const hasAnime = typeof anime !== "undefined";

let allRecipesCache = [];   // full catalog, fetched once
let activeCuisine = "all";  // currently selected filter chip
let searchDebounceId = null;


// ============ HERO ENTRANCE (one orchestrated sequence) ============
function playHeroIntro() {
    const items = document.querySelectorAll("[data-hero]");
    if (!items.length) return;

    if (!hasAnime) {
        items.forEach(el => { el.style.opacity = 1; });
        return;
    }

    anime.timeline({ easing: "easeOutExpo" })
        .set(items, { translateY: 18 })
        .add({
            targets: items,
            opacity: [0, 1],
            translateY: 0,
            duration: 700,
            delay: anime.stagger(120)
        });
}


// ============ CUISINE FILTER PILL ============
function moveFilterPill(button, animate = true) {
    const pill = document.getElementById("filterPill");
    const group = document.getElementById("filterGroup");
    if (!pill || !button || !group) return;

    const groupBox = group.getBoundingClientRect();
    const btnBox = button.getBoundingClientRect();
    const left = btnBox.left - groupBox.left;

    if (hasAnime && animate) {
        anime({
            targets: pill,
            left,
            width: btnBox.width,
            duration: 380,
            easing: "easeOutQuint"
        });
    } else {
        pill.style.left = `${left}px`;
        pill.style.width = `${btnBox.width}px`;
    }
}

function initFilters() {
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCuisine = btn.dataset.cuisine;
            moveFilterPill(btn);
            applyFiltersAndRender();
        });
    });

    const active = document.querySelector(".filter-btn.active");
    // position instantly on load, no animation
    requestAnimationFrame(() => moveFilterPill(active, false));
    window.addEventListener("resize", () => {
        moveFilterPill(document.querySelector(".filter-btn.active"), false);
    });
}


// ============ SCROLL-REVEAL FOR CARDS ============
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        revealObserver.unobserve(el);

        if (hasAnime) {
            anime({
                targets: el,
                opacity: [0, 1],
                translateY: [16, 0],
                duration: 500,
                delay: Number(el.dataset.delay || 0),
                easing: "easeOutCubic"
            });
        } else {
            el.style.opacity = 1;
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

function observeCards() {
    document.querySelectorAll(".recipe-card").forEach(card => {
        revealObserver.observe(card);
    });
}


// ============ FETCH ALL RECIPES ============
async function loadRecipes() {
    setLoadingState();

    try {
        const response = await fetch(`${API_URL}/recipes`, FETCH_OPTIONS);
        if (!response.ok) throw new Error("API request failed.");
        const data = await response.json();
        allRecipesCache = data.recipes || [];
        applyFiltersAndRender();
    } catch (error) {
        console.error(error);
        showError("Unable to connect to the API.");
    }
}


// ============ FILTER + SEARCH (client-side, runs on every keystroke) ============
function applyFiltersAndRender() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();

    let results = allRecipesCache;

    if (activeCuisine !== "all") {
        results = results.filter(r =>
            (r.type || "").toLowerCase() === activeCuisine
        );
    }

    if (query) {
        results = results.filter(r => {
            const haystack = [
                r.name,
                r.type,
                r.description,
                ...(Array.isArray(r.ingredients) ? r.ingredients : [])
            ].join(" ").toLowerCase();
            return haystack.includes(query);
        });
    }

    displayRecipes(results);
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    applyFiltersAndRender();
}


// ============ UI STATES ============
function setLoadingState() {
    const recipeList = document.getElementById("recipeList");
    recipeList.classList.add("loading-state");
    recipeList.innerHTML = "Loading recipes...";
}

function showError(message) {
    const recipeList = document.getElementById("recipeList");
    recipeList.classList.add("loading-state");
    recipeList.innerHTML = message;
}


// ============ RENDER RECIPE GRID ============
function displayRecipes(recipes) {
    const recipeList = document.getElementById("recipeList");
    recipeList.classList.remove("loading-state");
    recipeList.innerHTML = "";

    if (!recipes || recipes.length === 0) {
        recipeList.classList.add("loading-state");
        recipeList.innerHTML = "No recipes found. Try a different search or cuisine.";
        return;
    }

    recipes.forEach((recipe, index) => {
        const card = document.createElement("article");
        card.className = "recipe-card";
        card.dataset.delay = String(Math.min(index, 8) * 45);

        card.innerHTML = `
            <div class="recipe-type">${recipe.type}</div>

            <h3>${recipe.name}</h3>

            <div class="meta">
                <span>${recipe.difficulty}</span>
                <span>${recipe.rating} ⭐</span>
                <span>${recipe.servings} servings</span>
            </div>

            <p class="desc">${recipe.description}</p>

            <button type="button" onclick="viewRecipe(${recipe.id})">
                View details
            </button>
        `;

        recipeList.appendChild(card);
    });

    requestAnimationFrame(observeCards);
}


// ============ RECIPE DETAIL MODAL ============
async function viewRecipe(id) {
    try {
        const response = await fetch(`${API_URL}/recipes/${id}`, FETCH_OPTIONS);
        if (!response.ok) throw new Error("API request failed.");
        const recipe = await response.json();
        openModal(recipe);
    } catch (error) {
        console.error(error);
        alert("Unable to retrieve recipe.");
    }
}

function openModal(recipe) {
    const body = document.getElementById("modalBody");

    const allergens = recipe.allergen && recipe.allergen.length > 0
        ? recipe.allergen.map(a => `<span class="allergen-tag">${a}</span>`).join("")
        : `<span class="allergen-tag">None</span>`;

    body.innerHTML = `
        <div class="recipe-type">${recipe.type}</div>
        <h3 id="modalTitle">${recipe.name}</h3>

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

    const overlay = document.getElementById("modalOverlay");
    const card = document.getElementById("modalCard");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";

    if (hasAnime) {
        anime.set(card, { translateY: 40, opacity: 0.6 });
        anime({
            targets: card,
            translateY: 0,
            opacity: 1,
            duration: 420,
            easing: "easeOutQuint"
        });
    }
}

function closeModal() {
    const overlay = document.getElementById("modalOverlay");
    const card = document.getElementById("modalCard");

    const finish = () => {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    };

    if (hasAnime) {
        anime({
            targets: card,
            translateY: 40,
            opacity: 0,
            duration: 260,
            easing: "easeInQuad",
            complete: finish
        });
    } else {
        finish();
    }
}

document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});


// ============ LIVE SEARCH (fires as the user types, debounced) ============
document.getElementById("searchInput").addEventListener("input", () => {
    clearTimeout(searchDebounceId);
    searchDebounceId = setTimeout(applyFiltersAndRender, 200);
});

document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        clearTimeout(searchDebounceId);
        applyFiltersAndRender();
    }
});


// ============ INIT ============
playHeroIntro();
initFilters();
loadRecipes();