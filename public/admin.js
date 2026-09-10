
async function publishPoem() {

    const title =
        document.getElementById("title").value.trim();

    const text =
        document.getElementById("poem").value.trim();

    const message =
        document.getElementById("message");


    if (!title || !text) {

        message.innerText =
            "Please enter both title and poem.";

        return;
    }


    try {

        const response = await fetch("/api/poems", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title,
                text: text
            })

        });


        const data = await response.json();


        if (!response.ok) {

            message.innerText =
                data.message || "Something went wrong.";

            return;
        }


        message.innerText =
            "✨ Poem published successfully!";


        document.getElementById("title").value = "";

        document.getElementById("poem").value = "";


        // Refresh poem list
        loadAdminPoems();


    } catch (error) {

        message.innerText =
            "Server se connection nahi ho pa raha.";

        console.error(error);

    }

}


// LOAD ALL POEMS

async function loadAdminPoems() {

    const container =
        document.getElementById("adminPoemContainer");


    try {

        const response =
            await fetch("/api/poems");


        const poems =
            await response.json();


        container.innerHTML = "";


        if (poems.length === 0) {

            container.innerHTML =
                "<p>No poems published yet.</p>";

            return;
        }


        poems.forEach((poem) => {

            const card =
                document.createElement("div");

            card.className = "poem-card";


            card.innerHTML = `

                <h3>${escapeHTML(poem.title)}</h3>

                <p>${escapeHTML(poem.text)}</p>

                <button
                    onclick="deletePoem('${poem._id}')"
                >
                    🗑 Delete
                </button>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Poems load nahi ho pa rahi hain.</p>";

    }

}


// DELETE POEM

async function deletePoem(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this poem?");


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(`/api/poems/${id}`, {

                method: "DELETE"

            });


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message || "Could not delete poem."
            );

            return;
        }


        alert("✨ Poem deleted successfully!");


        loadAdminPoems();


    } catch (error) {

        console.error(error);

        alert(
            "Server se connection nahi ho pa raha."
        );

    }

}


// SECURITY HELPER

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// LOAD WHEN ADMIN PAGE OPENS

loadAdminPoems();

