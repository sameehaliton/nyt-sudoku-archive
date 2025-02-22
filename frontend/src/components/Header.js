import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ difficulty, date }) => {
    const navigate = useNavigate();

    let formattedDate = "Invalid Date";
    if (date) {
        const parsedDate = new Date(date.replace(/-/g, "/"));

        if (!isNaN(parsedDate.getTime())) {
            formattedDate = parsedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
    }
    

    return (
        <div style={styles.headerWrapper}>
        <div style={styles.headerContainer}>
            <button style={styles.backButton} onClick={() => navigate(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="48px" height="48px">
                    <path d="M 32 10 C 19.85 10 10 19.85 10 32 C 10 44.15 19.85 54 32 54 C 44.15 54 54 44.15 54 32 C 54 19.85 44.15 10 32 10 z M 32 14 C 41.941 14 50 22.059 50 32 C 50 41.941 41.941 50 32 50 C 22.059 50 14 41.941 14 32 C 14 22.059 22.059 14 32 14 z M 29.386719 23 C 28.874969 23.00825 28.365922 23.212375 27.982422 23.609375 L 21.205078 30.609375 C 20.454078 31.384375 20.454078 32.615625 21.205078 33.390625 L 27.982422 40.390625 C 28.374422 40.795625 28.897922 41 29.419922 41 C 29.920922 41 30.4235 40.8135 30.8125 40.4375 C 31.6055 39.6695 31.626422 38.402375 30.857422 37.609375 L 27.363281 34 L 41.357422 34 C 42.462422 34 43.357422 33.104 43.357422 32 C 43.357422 30.896 42.461422 30 41.357422 30 L 27.361328 30 L 30.855469 26.390625 C 31.623469 25.597625 31.603547 24.3315 30.810547 23.5625 C 30.413047 23.1785 29.898469 22.99175 29.386719 23 z"/>
                </svg>
            </button>
            
            <div style={styles.logoContainer}>
            <span style={styles.logoText}>SUDOKU ARCHIVE</span>
                    <img src="/icons8-sudoku.svg" alt="Sudoku Archive Logo" style={styles.logoIcon} />
                </div>
            <div style={styles.infoContainer}>
                <span style={styles.date}>{formattedDate}</span>

                <p style={styles.infoText}><strong>Difficulty: </strong>{difficulty}</p>
            </div>
            
        </div>
        </div>
    );
};
const styles = {
    headerWrapper: {
        display: "flex",
        justifyContent: "center",  // ✅ Keeps header centered on all screen sizes
        width: "100%",  // ✅ Ensures it spans the full width of the page
        padding: "1vw 0", // ✅ Responsive spacing
    },
    headerContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",  // Space between Back button & Date
        width: "90%",
        maxWidth: "1100px",
        backgroundColor: "#f9f9f9",
        padding: "15px 20px",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        position: "relative",  // Allows absolute positioning inside
    },
    backButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "none",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    logoContainer: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",  // Moves the element back by 50% of its width
        display: "flex",
        alignItems: "center",
        backgroundColor: "black",
        padding: "8px 15px",
        borderRadius: "20px",
    },
    logoBox: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "black",
        padding: "8px 15px",
        borderRadius: "20px",
    },

    /** ✅ Logo Text (Raleway Font) **/
    logoText: {
        fontFamily: "'Raleway', sans-serif",
        fontSize: "22px",
        fontWeight: "bold",
        color: "white",
        marginRight: "10px",
    },

    /** ✅ Logo Icon **/
    logoIcon: {
        width: "30px",
        height: "30px",
    },
    infoContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
    infoText: {
        margin: "2px 0",
        fontSize: "14px",
        color: "#555",
    },
    date: {
        fontSize: "18px",
        color: "#333",
        fontWeight: "bold",
    },
    difficulty: {
        fontSize: "18px",
        color: "#222",
    },
};

export default Header;