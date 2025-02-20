import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SudokuBoard from "./SudokuBoard";


function PuzzlePage() {
    const { date, difficulty } = useParams();
    const [puzzle, setPuzzle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPuzzle() {
            try {
                const response = await fetch(`http://localhost:5000/api/puzzle/${date}/${difficulty}`);
                if (!response.ok) {
                    throw new Error("Puzzle not found");
                }
                const data = await response.json();
                console.log("Fetched puzzle data:", data);

                // Ensure puzzle is an array of numbers
        let parsedPuzzle = data.puzzle;
        if (typeof parsedPuzzle === "string") {
            parsedPuzzle = JSON.parse(parsedPuzzle); // Convert if it's a string
        }

        // Convert to numbers if necessary
        parsedPuzzle = parsedPuzzle.map(num => Number(num));

        if (Array.isArray(parsedPuzzle) && parsedPuzzle.length === 81) {
            setPuzzle(parsedPuzzle);
        } else {
            throw new Error("Invalid puzzle format");
        }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPuzzle();
    }, [date, difficulty]);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <div>
            <h1>Sudoku Puzzle</h1>
            <p>Difficulty: {difficulty}</p>
            <p>Date: {date}</p>
            {/* Sudoku Board */}
            {puzzle ? <SudokuBoard initialPuzzle={puzzle} /> : <p>No puzzle found</p>}
        </div>

    );
}

export default PuzzlePage;