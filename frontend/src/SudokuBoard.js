import React, {useState, useEffect} from "react";

function SudokuBoard ({ initialPuzzle}) {
    const [originalBoard, setOriginalBoard] = useState([]);
    const [board, setBoard] = useState(() =>
        initialPuzzle && Array.isArray(initialPuzzle) && initialPuzzle.length === 81
            ? Array.from({ length: 9 }, (_, i) => initialPuzzle.slice(i * 9, i * 9 + 9))
            : Array(9).fill(null).map(() => Array(9).fill(""))
    );

    const [selectedCell, setSelectedCell] = useState(null);
    const [mode, setMode] = useState("normal");
    const isThickBorder = (rowIndex, colIndex) => ({
        borderRight: colIndex === 8  ? "3px solid black" : colIndex % 3 === 2 ? "3px solid black" : "1px solid black",
    
    });

    useEffect(() => {
        if (Array.isArray(initialPuzzle) && initialPuzzle.length === 81) {
            const formattedBoard = Array.from({ length: 9 }, (_, i) =>
                initialPuzzle.slice(i * 9, i * 9 + 9)
            );
            console.log("Formatted Board:", formattedBoard);
            setOriginalBoard([...formattedBoard.map(row => [...row])]); 
            setBoard([...formattedBoard.map(row => [...row])]);  
        } else {
            console.error("Invalid initialPuzzle format:", initialPuzzle);
        }
    }, [initialPuzzle]);

    console.log("Initial Puzzle:", initialPuzzle);
    const [autoCandidate, setAutoCandidate] = useState(false);

    useEffect(() => {
        console.log("Auto-candidate mode toggled:", autoCandidate);
    
        if (autoCandidate) {
            setBoard(prevBoard =>
                prevBoard.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        if (originalBoard?.[rowIndex]?.[colIndex] === 0) { // ✅ Only update empty cells
                            const candidates = getCandidateNumbers(rowIndex, colIndex, prevBoard);
                            console.log(`Final Candidates for (${rowIndex}, ${colIndex}):`, candidates);
                            return candidates.length > 0 ? candidates.join("") : "";
                        }
                        return cell; // ✅ Keep original numbers
                    })
                )
            );
        } else {
            console.log("Restoring original board...");
            setBoard(originalBoard);
        }
    }, [autoCandidate, originalBoard]); // ✅ Runs only when Auto-Candidate Mode toggles
    
    

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
        if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
            setSelectedCell(null);
        } else{
        setSelectedCell({ row, col});
        }
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
    <div style={styles.wrapper}>
        <div style={styles.board}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => {
                        const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;

                        return (
                            <div 
                                key={`${rowIndex}-${colIndex}`}
                                style={{
                                    ...styles.cell, 
                                    ...isThickBorder(rowIndex, colIndex), // ✅ APPLY BORDER FUNCTION

                                    fontSize: typeof cell === "string" && cell.length > 1 ? "12px" : "20px", // Smaller font for candidates
                                    color: typeof cell === "string" && cell.length > 1 ? "gray" : "black",
                                    backgroundColor: 
                                        selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex 
                                            ? "#FFD700"  // Highlighted yellow
                                            : originalBoard?.[rowIndex]?.[colIndex] !== undefined && originalBoard[rowIndex][colIndex]!== 0 
                                                ? "#d3d3d3"  // Gray for original numbers
                                                : "white",   // Default
                                    fontWeight: (originalBoard[rowIndex] && originalBoard[rowIndex][colIndex] !== undefined && originalBoard[rowIndex][colIndex] !== 0) 
                                        ? "bold" 
                                        : "normal",


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
        <button
        style={{
            ...styles.modeButton,
            
            ...(mode === "normal" ? styles.activeMode : styles.inactiveMode),
        }}
        onClick={() => setMode("normal")}
    >
        Normal
    </button>
    
    <button
        style={{
            ...styles.modeButton,
            ...(mode === "candidate" ? styles.activeMode : styles.inactiveMode),
        }}
        onClick={() => setMode("candidate")}
    >
        Candidate
    </button>
        </div>
        {/* 🔹 Number Pad Component (Goes Below the Board) */}

        <div style={styles.numberPadContainer}>
            <div style={styles.numberPad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button key={num} style={styles.numButton} onClick={() => handleNumberClick(num)}>
                        {num}
                    </button>
                ))}
                <button style={styles.numButton} onClick={() => handleNumberClick("")}>X</button>
            </div>
        </div>

        <label>
            <input type="checkbox" checked={autoCandidate} onChange={() => setAutoCandidate(!autoCandidate)} />
            Auto Candidate Mode
        </label>
    </div>
);

}

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // ✅ Center everything including the board & number pad
        justifyContent: "center",
        width: "100%",
        paddingTop: "20px",
    },
    boardContainer: {
        display: "flex",
        justifyContent: "center", // Ensures it's centered horizontally
        alignItems: "center",
        width: "100%",  // Takes full width to allow centering
        marginTop: "20px", 
    },
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
    modeSelector: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "15px",
    },
    modeButton: {
        padding: "10px 20px",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        borderRadius: "5px",
        width: "120px",  // ✅ Ensures buttons are equal size
        height: "50px",  // ✅ Bigger size for better UX
        textAlign: "center",
        border: "1px solid black",  // ✅ Thin border for unselected buttons
        transition: "all 0.2s ease-in-out", // ✅ Smooth effect on hover
        display: "flex",
        alignItems: "center",  // ✅ Vertically center text
        justifyContent: "center",  // ✅ Horizontally center text

    },
    activeMode: {
        backgroundColor: "black",
        color: "white",
    },
    inactiveMode: {
        backgroundColor: "white",
        color: "black",
    },
    touching: {
        marginLeft: "-1px",  // ✅ Ensures buttons always touch
    },
    numberPadContainer: {
        display: "flex",
        justifyContent: "center", // ✅ Center the number pad
        marginTop: "20px",
    },
    numberPad: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))", // Makes buttons auto-adjust
        gap: "10px",
        width: "90%", // Ensures number pad scales well
        maxWidth: "400px",
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