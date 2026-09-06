javascript
async function loadPoems() {
    const container = document.getElementById("poemContainer");

    try {
        const response = await fetch("/api/poems");
        const poems = await response.json();

        displayPoems(poems);

    } catch (error) {
        container.innerHTML = `
            <p style="
                grid-column:1/-1;
                text-align:center;
                color:#888;
                font-size:20px;
            ">
                Poems load nahi ho pa rahi hain.
            </p>
        `;

        console.error(error);
    }
}


function displayPoems(poems) {
    const container = document.getElementById("poemContainer");

    container.innerHTML = "";

    if (poems.length === 0) {
        container.innerHTML = `
            <p style="
                grid-column:1/-1;
                text-align:center;
                color:#888;
                font-size:20px;
            ">
                Abhi koi poem publish nahi hui ✨
            </p>
        `;

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

            <button
                class="delete-btn"
                onclick="deletePoem('${poem._id}')">
                🗑️ Delete
            </button>
        `;

        container.appendChild(card);
    });
}


async function deletePoem(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this poem? 🥺"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`/api/poems/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Poem delete nahi ho paayi.");
            return;
        }

        alert("Poem deleted successfully 🗑️");

        loadPoems();

    } catch (error) {

        console.error(error);

        alert("Poem delete nahi ho paayi. Please try again.");
    }
}


function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


document
    .getElementById("searchInput")
    .addEventListener("input", async function () {

        const search = this.value.toLowerCase();

        try {

            const response = await fetch("/api/poems");
            const poems = await response.json();

            const filtered = poems.filter(poem =>
                poem.title.toLowerCase().includes(search) ||
                poem.text.toLowerCase().includes(search)
            );

            displayPoems(filtered);

        } catch (error) {
            console.error(error);
        }
    });


loadPoems();

