const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database: "sudoku_db",
    password: "your_password",
    port: 5432,
});

const sdkDir = path.join(__dirname, "sdk_puzzles");

function parseSDKFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8").trim();
    const lines = content.split("\n").slice(2);
    const rows = lines
        .map(row => row.trim())
        .filter(row => row.length > 0)
        .map(row => row.split("").map(char => (char === "." ? 0 : Number(char))));


    if (rows.length !== 9 || rows.some(row => row.length !== 9)) {
        console.error(`Invalid SDK file: ${filePath}`);
        console.error(rows);
        return null;
    }

    return rows.flat();
}

async function importPuzzles() { 
    const files = fs.readdirSync(sdkDir).filter(file => file.endsWith(".sdk"));

    for (const file of files) {
        const filePath = path.join(sdkDir, file);
        console.log(`Processing: ${file}`);

        const puzzle = parseSDKFile(filePath);
        if (!puzzle) continue;

        const match = file.match(/nyt-hard-(\d{4}-\d{2}-\d{2})\.sdk/);
        const dateStr = match ? match[1] : null;

        if (! dateStr) {
            console.error(`Failed to extract date from filename: ${file}`);
            continue;
        }
        const difficulty = "hard";

        try {

            await pool.query (
                `INSERT INTO puzzles (date, difficulty, puzzle)
                VALUES ($1, $2, $3)
                ON CONFLICT (date, difficulty) DO NOTHING`,
                [dateStr, difficulty, JSON.stringify(puzzle)]
            );
            console.log(`Imported: ${file} to ${dateStr}`);
        } catch (error) {
            console.error(`Database error for ${file}:`, error);

        }
    }
    
    await pool.end();
}

importPuzzles();