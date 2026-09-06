

let allPoems = [];


// LOAD POEMS
async function loadPoems() {

    const container = document.getElementById("poemContainer");

    try {

        const response = await fetch("/api/poems");

        allPoems = await response.json();

        displayPoems(allPoems);

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


// DISPLAY POEMS
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
                Koi poem nahi mili ✨
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


// DELETE POEM
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

            alert(
                result.message ||
                "Poem delete nahi ho paayi."
            );

            return;
        }


        alert("Poem deleted successfully 🗑️");

        await loadPoems();


    } catch (error) {

        console.error(error);

        alert(
            "Poem delete nahi ho paayi. Please try again."
        );

    }
}


// SEARCH
document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const search = this.value
            .trim()
            .toLowerCase();


        const filteredPoems = allPoems.filter(poem => {

            const title =
                (poem.title || "").toLowerCase();

            const text =
                (poem.text || "").toLowerCase();


            return (
                title.includes(search) ||
                text.includes(search)
            );

        });


        displayPoems(filteredPoems);

    });


// SECURITY: ESCAPE HTML
function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// START
loadPoems();

