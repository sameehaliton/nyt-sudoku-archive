const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "sudoku_db",
    password: "your_password",
    port: 5432,
});

const PORT = 5000;

app.get("/api/puzzle/:date/:difficulty", async (req, res) => {
    const { date, difficulty } = req.params;

    try {
        const result = await pool.query (
            "SELECT puzzle FROM puzzles WHERE date = $1 AND difficulty = $2",
            [date, difficulty]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: "Puzzle not found"});
        }
        res.json({ puzzle: result.rows[0].puzzle});
    } catch (error) {
        console.error("Databse error", error);
        res.status(500).json({error: "Internal Server Error"});
    }
});



app.get("/api/puzzle-dates", async (req, res) => {
    try {
        const result = await pool.query("SELECT DISTINCT date FROM puzzles ORDER BY date DESC");

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No puzzle dates found" });
        }

        const dates = result.rows.map(row => row.date);
        res.json(dates);
    } catch (error) {
        console.error("Database error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Sudoku puzzle server running at http://localhost:${PORT}`);
});