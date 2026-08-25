const API_URL = "https://cs-301-martin-benitez-api.vercel.app/";


// GET ALL CARS
async function loadSneaker() {
    try {
        const response = await fetch(`${API_URL}/sneakers`);
        const data = await response.json();
        displaySneaker(data.sneaker);
    }

    catch (error) {
        console.error(error);
        document.getElementById("sneakerList").innerHTML = "Unable to connect to the API.";
    }
}


// DISPLAY CARS
function displaySneaker(sneakers) {
    const sneakerList =
        document.getElementById("sneakerList");

    sneakerList.innerHTML = "";

    sneakers.forEach(sneaker => {
        const card = document.createElement("div");
        card.className = "Sneakers-card";
        card.innerHTML = `
            <div class="Sneaker-year">${sneaker.year}</div>
            <h3>${sneaker.brand} ${sneaker.model}</h3>
            <p class="Sneaker-colorway">${sneaker.colorway}</p>
            <p>${sneaker.price} price/p>
            <p>${sneaker.description}</p>
            <button onclick="viewSneaker(${sneaker.id})"> View Details</button>
        `;

        sneakerList.appendChild(card);
    });

}

// GET ONE CAR
async function viewSneaker(id) {

    try {
        const response = await fetch(`${API_URL}/sneakers/${id}`);
        const sneaker = await response.json();

        alert(`
            ${sneaker.year} ${sneaker.brand} ${sneaker.model}
            Engine:
            ${sneaker.colorway}

            Horsepower:
            ${sneaker.price}

            Description:
            ${sneaker.description}
        `);
    }
    catch (error) {
        console.error(error);
        alert("Unable to retrieve car.");
    }

}

// SEARCH
async function searchSneakers() {

    const query = document.getElementById("searchInput").value;
    if (!query) {
        loadSneaker();
        return;
    }
    try {
        const response =
            await fetch(`${API_URL}/sneaker/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        displaySneaker(data.results);
    }

    catch (error) {
        console.error(error);
        alert("Search failed.");
    }
}

loadSneaker();
