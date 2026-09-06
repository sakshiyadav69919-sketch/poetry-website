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


    } catch (error) {

        message.innerText =
            "Server se connection nahi ho pa raha.";

        console.error(error);

    }

}