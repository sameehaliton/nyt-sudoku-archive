import React, {useState, useEffect} from "react";

function SudokuBoard ({ initialPuzzle}) {
    const [board, setBoard] = useState(() =>
        initialPuzzle && Array.isArray(initialPuzzle) && initialPuzzle.length === 81
            ? Array.from({ length: 9 }, (_, i) => initialPuzzle.slice(i * 9, i * 9 + 9))
            : Array(9).fill(null).map(() => Array(9).fill(""))
    );

    const [selectedCell, setSelectedCell] = useState(null);
    const [mode, setMode] = useState("normal");
    const [autoCandidate, setAutoCandidate] = useState(false);
    
    useEffect(() => {
        if (Array.isArray(initialPuzzle) && initialPuzzle.length === 81) {
            const formattedBoard = Array.from({ length: 9 }, (_, i) =>
                initialPuzzle.slice(i * 9, i * 9 + 9)
            );
            console.log("Formatted Board:", formattedBoard);
            setBoard(formattedBoard);
        } else {
            console.error("Invalid initialPuzzle format:", initialPuzzle);
        }
    }, [initialPuzzle]);

    console.log("Initial Puzzle:", initialPuzzle);

    // ✅ This effect initializes the board when auto-candidate mode is enabled
    useEffect(() => {
        console.log("Auto-candidate mode toggled:", autoCandidate);
    
        if (autoCandidate) {
            setBoard(prevBoard => {
                const newBoard = prevBoard.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        if (cell === "" || !isNaN(cell)) { // ✅ Only update empty cells
                            const candidates = getCandidateNumbers(rowIndex, colIndex, prevBoard);
                            console.log(`Final Candidates for (${rowIndex}, ${colIndex}):`, candidates);
                            return candidates.length > 0 ? candidates.join("") : "";
                        }
                        return cell; // Keep existing numbers
                    })
                );
    
                console.log("New Board with Candidates:", newBoard);
                return newBoard;
            });
        }
    }, [autoCandidate]); 
    

// ✅ This effect runs AFTER the board updates and calculates candidates
useEffect(() => {
    if (autoCandidate) {
        setBoard(prevBoard => {
            const newBoard = prevBoard.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (cell === "") { // Only update empty cells
                        const candidates = getCandidateNumbers(rowIndex, colIndex, prevBoard);
                        console.log(`Final Candidates for (${rowIndex}, ${colIndex}):`, candidates);
                        return candidates.length > 0 ? candidates.join("") : "";
                    }
                    return cell; // Keep existing numbers
                })
            );

            // ✅ Check if the board has changed before updating to prevent infinite loops
            if (JSON.stringify(newBoard) !== JSON.stringify(prevBoard)) {
                console.log("Updating board with candidates...");
                return newBoard;
            }
            return prevBoard; // No change, prevent re-render
        });
    }
}, [autoCandidate]);

    const handleCellClick = ( row, col) => {
        setSelectedCell({ row, col});
    };
    const getCandidateNumbers = (row, col, board) => {
        if (board[row][col] !== "" && board[row][col].length === 1) return []; // Don't overwrite filled cells
    
        const candidates = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
        // Remove numbers from the same row
        board[row].forEach(num => candidates.delete(Number(num)));
    
        // Remove numbers from the same column
        for (let i = 0; i < 9; i++) {
            candidates.delete(Number(board[i][col]));
        }
    
        // Remove numbers from the same 3x3 grid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
    
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                candidates.delete(Number(board[i][j]));
            }
        }
        console.log(`Final Candidates for (${row}, ${col}):`, Array.from(candidates));
        return Array.from(candidates);
    };
    

    const handleNumberClick = (number) => {
        if (!selectedCell) return;
    
        const { row, col } = selectedCell;
    
        setBoard(prevBoard => {
            const newBoard = prevBoard.map(rowArr => [...rowArr]); // Deep copy
    
            newBoard[row][col] = mode === "normal" ? number : `${newBoard[row][col]}${number}`;
    
            return newBoard; 
        });
    

        if (autoCandidate) {
            setBoard((prevBoard) => {
                const newBoard = prevBoard.map((r) => [...r]); // Deep copy
                const candidates = getCandidateNumbers(row, col, newBoard); // Pass updated board state
                newBoard[row][col] = candidates.join(""); // Convert array to string
                return newBoard;
            });
        }
    };

    return (
        <div>
        <div style={styles.board}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => {
                        const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;
                        const bgColor = isSelected ? "#FFD700" : "white";
                        
                        return (
                            <div 
                                key={`${rowIndex}-${colIndex}`}
                                style={{
                                    ...styles.cell, 
                                    backgroundColor: bgColor,
                                    fontSize: typeof cell === "string" && cell.length > 1 ? "12px" : "20px", // Smaller font for candidates
                                color: typeof cell === "string" && cell.length > 1 ? "gray" : "black" // Different color for candidates
                                }}
                                onClick={() => handleCellClick(rowIndex, colIndex )}
                            >
                                {cell !== 0 ? cell : ""}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>

        <div style={styles.modeSelector}>
            <button style={mode === "normal" ? styles.activeMode : styles.inactiveMode} onClick={() => setMode("normal")}>
                Normal
            </button>
            <button style={mode=== "candidate" ? styles.activeMode :styles.inactiveMode} onClick={() => setMode("candidate")}>
                Candidate
            </button>
        </div>
        {/* 🔹 Number Pad Component (Goes Below the Board) */}

        <div style={styles.numberPad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button key={num} style={styles.numButton} onClick={() => handleNumberClick(num)}>
                    {num}
                </button>
            ))}

            <button style={styles.numButton} onClick={() => handleNumberClick("")}>X</button>
            </div>
            <label>
                <input type="checkbox" checked={autoCandidate} onChange={() => setAutoCandidate(!autoCandidate)} />
                Auto Candidate Mode
            </label>
        </div>
        
    );

}

const styles = {
    board: {
        display: "grid",
        gridTemplateColumns: "repeat(9, 40px)",
        gap: "2px",
        margin: "20px auto",
        width: "fit-content",
        backgroundColor: "#000",
        padding: "5px",
        borderRadius: "5px"
    },
    row: {
        display: "contents",
    },
    cell: {
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        border: "1px solid black",
        cursor: "pointer",
    },
    numberPad: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)", // Arrange in a grid format
        gap: "10px",
        marginTop: "20px",
        justifyContent: "center",
    },
    numButton: {
        width: "50px",
        height: "50px",
        fontSize: "20px",
        cursor: "pointer",
        borderRadius: "5px",
        border: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
    }
};


export default SudokuBoard;