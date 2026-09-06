const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully ❤️");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });


// Middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


// Poem Schema
const poemSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


const Poem = mongoose.model("Poem", poemSchema);


// Get all poems
app.get("/api/poems", async (req, res) => {

    try {

        const poems = await Poem
            .find()
            .sort({ createdAt: -1 });

        res.json(poems);

    } catch (error) {

        res.status(500).json({
            message: "Could not load poems"
        });

    }

});


// Add a poem
app.post("/api/poems", async (req, res) => {

    try {

        const { title, text } = req.body;

        if (!title || !text) {

            return res.status(400).json({
                message: "Title and poem are required"
            });

        }

        const newPoem = await Poem.create({
            title: title,
            text: text
        });

        res.status(201).json(newPoem);

    } catch (error) {

        res.status(500).json({
            message: "Could not save poem"
        });

    }

});


// Start server
const PORT = process.env.PORT || 3000;
// ADMIN LOGIN

app.post("/api/admin/login", (req, res) => {

    const { username, password } = req.body;

    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (
        username === correctUsername &&
        password === correctPassword
    ) {

        res.json({
            success: true
        });

    } else {

        res.status(401).json({
            success: false,
            message: "Wrong username or password"
        });

    }

});

app.listen(PORT, () => {

    console.log(
        `Poetry website running at http://localhost:${PORT}`
    );

});
// Delete a poem
app.delete("/api/poems/:id", async (req, res) => {
    try {
        const deletedPoem = await Poem.findByIdAndDelete(req.params.id);

        if (!deletedPoem) {
            return res.status(404).json({
                message: "Poem not found"
            });
        }

        res.json({
            success: true,
            message: "Poem deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Could not delete poem"
        });
    }
});