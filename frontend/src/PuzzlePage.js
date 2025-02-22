import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SudokuBoard from "./SudokuBoard";
import Header from "./components/Header";
import { minutesInHour } from "date-fns/constants";

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

    if (loading) return <p style={styles.loading}>Loading Sudoku Puzzle...</p>;
    if (error) return <p style={styles.error}>Error: {error}</p>;
    
    return (
        <div style={styles.container}>
        <Header difficulty={difficulty} date={date} />  {/* ✅ Add the Header at the top */}
        
        <div style={styles.boardWrapper}>
            {puzzle ? <SudokuBoard initialPuzzle={puzzle} /> : <p>No puzzle found</p>}
     </div>
    </div>

    );
}
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Centers all content horizontally
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        width: "100%"
    },
    boardWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Ensures the Sudoku board stays centered
        justifyContent: "center",
        width: "100%",
        maxWidth: "500px",
        marginTop: "20px",
    },
    loading: {
        fontSize: "20px",
        fontStyle: "italic",
        color: "gray",
    },
    error: {
        fontSize: "18px",
        color: "red",
        fontWeight: "bold",
    },
};


export default PuzzlePage;