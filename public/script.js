

let allPoems = [];

async function loadPoems() {
    const container = document.getElementById("poemContainer");

    try {
        const response = await fetch("/api/poems");
        allPoems = await response.json();

        displayPoems(allPoems);
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Poems load nahi ho pa rahi hain.</p>";
    }
}

function displayPoems(poems) {
    const container = document.getElementById("poemContainer");

    container.innerHTML = "";

    if (poems.length === 0) {
        container.innerHTML = "<p>Koi poem nahi mili ✨</p>";
        return;
    }

    poems.forEach((poem, index) => {
        const card = document.createElement("div");

        card.className = "poem-card";

        card.innerHTML = `
            <div class="poem-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <h3>${escapeHTML(poem.title)}</h3>

            <p>${escapeHTML(poem.text)}</p>
        `;

        container.appendChild(card);
    });
}


// 🔍 SEARCH
const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function () {

        const search = this.value.toLowerCase().trim();

        const filteredPoems = allPoems.filter(poem => {

            const title = (poem.title || "").toLowerCase();
            const text = (poem.text || "").toLowerCase();

            return title.includes(search) || text.includes(search);
        });

        displayPoems(filteredPoems);
    });
}


// Security helper
function escapeHTML(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


loadPoems();