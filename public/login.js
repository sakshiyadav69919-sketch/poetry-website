async function login() {

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");


    try {

        const response = await fetch("/api/admin/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });


        const data = await response.json();


        if (data.success) {

            window.location.href = "/admin.html";

        } else {

            message.innerText =
                "❌ Wrong username or password.";

        }

    } catch (error) {

        message.innerText =
            "Server se connection nahi ho pa raha.";

    }

}