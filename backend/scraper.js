const puppeteer = require('puppeteer');
const { Pool } = require('pg');

const pool = new Pool ({
    user: "postgres",
    host: "localhost",
    database: "sudoku_db",
    password: "your_password",
    port: 5432,
});

async function getSudokuPuzzle(difficulty) {
    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();

    console.log(`Scraping NYT ${difficulty} puzzle...`);
    
    try{
        await page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.198 Safari/537.36"
        );
        await page.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
        });
        await page.setViewport({ width: 1280, height: 800 });

        console.log(`Navigating to: https://www.nytimes.com/puzzles/sudoku/${difficulty}`);
        await page.goto(`https://www.nytimes.com/puzzles/sudoku/${difficulty}`, { 
            waitUntil: "domcontentloaded", 
            timeout: 30000,

    });

    await page.waitForFunction(() => typeof window.gameData !== "undefined", {
        timeout: 10000,
    })

    await page.screenshot({ path: "nyt_sudoku.png", fullPage: true});
    console.log("Screenshot taken, check nyt_sudoku.png")

    const gameData = await page.evaluate(() => window.gameData);
    if (!gameData || !gameData[difficulty] || !gameData[difficulty].puzzle_data) {
        throw new Error(`gameData is missing puzzle_data for ${difficulty}`);
    }

    await browser.close();
    return gameData[difficulty].puzzle_data.puzzle;

} catch (error) {
    console.error(`Failed to fetch ${difficulty} puzzle:`, error);
    await browser.close();
    return null;
}
}

async function saveDailyPuzzle() {
    const dateStr = new Date().toISOString().split("T")[0];
    const difficulties = ["easy", "medium", "hard"];

    for (let difficulty of difficulties) {
        const puzzle = await getSudokuPuzzle(difficulty);
        if (!puzzle) {
            console.log(`Skipping ${difficulty} - No data found`);
            continue;
        }
        try {

            await pool.query(
                `INSERT INTO puzzles (date, difficulty, puzzle) 
                VALUES ($1, $2, $3) 
                ON CONFLICT (date, difficulty) 
                DO NOTHING`,
                [dateStr, difficulty, JSON.stringify(puzzle)]
            );

            console.log(`Saves ${difficulty} puzzle for ${dateStr}`);
        } catch(error) {
            console.error('Failed to fetch ${difficulty} puzzle:', error)
        }
        }
        await pool.end();
    }

    saveDailyPuzzle();
