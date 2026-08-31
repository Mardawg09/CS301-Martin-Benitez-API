const API_URL = "https://cs-301-martin-benitez-api.vercel.app";


/* ============================================================
   TEXT TYPE — vanilla port of React Bits <TextType />
   (GSAP replaced with setTimeout loop + CSS blink animation)
   ============================================================ */

function startTypeType(el, {
    texts,
    typingSpeed = 60,
    deletingSpeed = 30,
    pauseDuration = 1600,
    initialDelay = 300,
    loop = true,
    cursorCharacter = "|",
    variableSpeed = null
} = {}) {

    const textSpan = document.createElement("span");
    textSpan.className = "text-type__content";

    const cursorSpan = document.createElement("span");
    cursorSpan.className = "text-type__cursor";
    cursorSpan.textContent = cursorCharacter;

    el.innerHTML = "";
    el.appendChild(textSpan);
    el.appendChild(cursorSpan);

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function getSpeed() {
        if (!variableSpeed) return typingSpeed;
        return Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min;
    }

    function tick() {
        const currentText = texts[textIndex];

        if (!isDeleting) {
            if (charIndex < currentText.length) {
                charIndex++;
                textSpan.textContent = currentText.slice(0, charIndex);
                setTimeout(tick, getSpeed());
            } else {
                setTimeout(() => {
                    isDeleting = true;
                    tick();
                }, pauseDuration);
            }
        } else {
            if (charIndex > 0) {
                charIndex--;
                textSpan.textContent = currentText.slice(0, charIndex);
                setTimeout(tick, deletingSpeed);
            } else {
                isDeleting = false;
                const atEnd = textIndex === texts.length - 1;
                textIndex = (textIndex + 1) % texts.length;

                if (atEnd && !loop) return;

                setTimeout(tick, typingSpeed);
            }
        }
    }

    setTimeout(tick, initialDelay);
}


/* ============================================================
   BORDER GLOW — vanilla port of React Bits <BorderGlow />
   (this component had no GSAP dependency to begin with —
   just the pointermove math + CSS custom properties)
   ============================================================ */

function parseHSL(hslStr) {
    const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
    if (!match) return { h: 210, s: 90, l: 65 };
    return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
    const { h, s, l } = parseHSL(glowColor);
    const base = `${h}deg ${s}% ${l}%`;
    const opacities = [100, 60, 50, 40, 30, 20, 10];
    const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
    const vars = {};
    for (let i = 0; i < opacities.length; i++) {
        vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
    }
    return vars;
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = ["--gradient-one", "--gradient-two", "--gradient-three", "--gradient-four", "--gradient-five", "--gradient-six", "--gradient-seven"];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
    const vars = {};
    for (let i = 0; i < 7; i++) {
        const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
        vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
    }
    vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
    return vars;
}

function isLightColor(color) {
    const value = color.trim().replace("#", "");
    if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
    const hex = value.length === 3 ? value.split("").map(c => c + c).join("") : value;
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);
    return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180;
}

function attachBorderGlow(card, {
    edgeSensitivity = 30,
    glowColor = "210 90% 65%",
    backgroundColor = "#ffffff",
    borderRadius = 20,
    glowRadius = 36,
    glowIntensity = 1.0,
    coneSpread = 25,
    colors = ["#60A5FA", "#818CF8", "#38BDF8"],
    fillOpacity = 0.35
} = {}) {

    card.classList.add("border-glow-card");
    if (isLightColor(backgroundColor)) card.classList.add("border-glow-card--light");

    card.style.setProperty("--card-bg", backgroundColor);
    card.style.setProperty("--edge-sensitivity", edgeSensitivity);
    card.style.setProperty("--border-radius", `${borderRadius}px`);
    card.style.setProperty("--glow-padding", `${glowRadius}px`);
    card.style.setProperty("--cone-spread", coneSpread);
    card.style.setProperty("--fill-opacity", fillOpacity);

    Object.entries(buildGlowVars(glowColor, glowIntensity)).forEach(([k, v]) => card.style.setProperty(k, v));
    Object.entries(buildGradientVars(colors)).forEach(([k, v]) => card.style.setProperty(k, v));

    card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;

        let kx = Infinity;
        let ky = Infinity;
        if (dx !== 0) kx = cx / Math.abs(dx);
        if (dy !== 0) ky = cy / Math.abs(dy);
        const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

        let angle = 0;
        if (!(dx === 0 && dy === 0)) {
            const radians = Math.atan2(dy, dx);
            let degrees = radians * (180 / Math.PI) + 90;
            if (degrees < 0) degrees += 360;
            angle = degrees;
        }

        card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
        card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
    });
}

// A different glow palette per card, cycled by index
const GLOW_PALETTES = [
    { glowColor: "217 91% 65%", colors: ["#60A5FA", "#818CF8", "#38BDF8"] }, // blue
    { glowColor: "158 84% 45%", colors: ["#34D399", "#10B981", "#6EE7B7"] }, // green
    { glowColor: "38 92% 60%", colors: ["#FBBF24", "#F59E0B", "#FCD34D"] },  // amber
    { glowColor: "0 84% 65%", colors: ["#F87171", "#EF4444", "#FCA5A5"] },   // red
    { glowColor: "270 80% 70%", colors: ["#C084FC", "#A78BFA", "#F472B6"] }, // purple
    { glowColor: "190 90% 50%", colors: ["#22D3EE", "#06B6D4", "#67E8F9"] }  // cyan
];

const TYPE_ICONS = {
    breakfast: "🍳",
    lunch: "🥪",
    dinner: "🍝",
    dessert: "🍰",
    snack: "🍿",
    drink: "🥤",
    vegan: "🥗",
    soup: "🍲"
};

function getIcon(type) {
    if (!type) return "🍽️";
    return TYPE_ICONS[type.toLowerCase()] || "🍽️";
}


/* ============================================================
   RECIPE APP
   ============================================================ */

// GET ALL RECIPES
async function loadRecipes() {
    const recipeList = document.getElementById("recipeList");

    try {
        recipeList.style.opacity = "0";

        const response = await fetch(`${API_URL}/recipes`);
        const data = await response.json();

        setTimeout(() => {
            displayRecipes(data.recipes);
            recipeList.style.opacity = "1";
        }, 150);
    }

    catch (error) {
        console.error(error);

        recipeList.innerHTML =
            "Unable to connect to the API.";
        recipeList.style.opacity = "1";
    }
}


// DISPLAY RECIPES AS BORDER-GLOW CARDS
function displayRecipes(recipes) {

    const recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = "";

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    recipes.forEach((recipe, index) => {

        const card = document.createElement("article");
        card.style.transitionDelay = `${Math.min(index * 60, 400)}ms`;

        card.innerHTML = `
            <span class="edge-light"></span>
            <div class="border-glow-inner">

                <div class="recipe-card-header">
                    <span class="recipe-icon">${getIcon(recipe.type)}</span>
                    <span class="recipe-type-badge">${recipe.type}</span>
                </div>

                <h3>${recipe.name}</h3>

                <div class="recipe-meta">
                    <span>⭐ ${recipe.rating}</span>
                    <span>${recipe.difficulty}</span>
                    <span>${recipe.servings} servings</span>
                </div>

                <div class="recipe-macros">
                    <span><strong>${recipe.protein}g</strong> protein</span>
                    <span><strong>${recipe.carbs}g</strong> carbs</span>
                </div>

                <p class="recipe-desc">${recipe.description}</p>

                <button onclick="viewRecipe(${recipe.id})">
                    View Details
                </button>
            </div>
        `;

        attachBorderGlow(card, GLOW_PALETTES[index % GLOW_PALETTES.length]);

        recipeList.appendChild(card);
        revealObserver.observe(card);
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

    const recipeList = document.getElementById("recipeList");

    try {
        recipeList.style.opacity = "0";

        const response =
            await fetch(
                `${API_URL}/recipes/search?q=${encodeURIComponent(query)}`
            );

        const data =
            await response.json();

        setTimeout(() => {
            displayRecipes(data.results);
            recipeList.style.opacity = "1";
        }, 150);
    }

    catch (error) {

        console.error(error);

        alert("Search failed.");
        recipeList.style.opacity = "1";
    }
}


// START HEADER TAGLINE
startTypeType(document.getElementById("tagline"), {
    texts: [
        "Discover recipes that inspire.",
        "Cook smarter, eat better.",
        "Fresh ideas for every craving."
    ],
    typingSpeed: 55,
    deletingSpeed: 25,
    pauseDuration: 1800,
    variableSpeed: { min: 40, max: 90 }
});


// LOAD RECIPES WHEN PAGE OPENS
loadRecipes();