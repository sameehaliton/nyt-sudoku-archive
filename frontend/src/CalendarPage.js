import React, {useState} from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { useNavigate } from "react-router-dom";


function CalendarPage() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDifficultySelect = (difficulty) => {
        if (!selectedDate) return;
        const dateString = format(selectedDate, "yyyy-MM-dd");
        navigate(`/puzzle/${dateString}/${difficulty}`);
    
    };

    const [puzzleProgress, setPuzzleProgress] = useState({
        "2024-07-04": 2, // Example: 2 stars (2 puzzles solved)
        "2024-07-07": 3, // Example: 3 stars (all puzzles solved)
        "2024-07-15": 1, // Example: 1 star (one puzzle solved)
    });

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today);
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const handleDayClick = (date) => {setSelectedDate(date)};

    const changeMonth = (offset) => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + offset)));
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}> Sudoku Archive</h1>
            <p style={styles.subtitle}>Play past puzzles</p>

            <div style={styles.nav}>
                <button onClick={() => changeMonth(-1)}>{"<"}</button>
                <span>{format(currentMonth, "MMMM yyyy")}</span>
                <button onClick={() => changeMonth(1)}>{">"}</button>
            </div>

            <div style={styles.calendar}>
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key = {day} style={styles.dayLabel}>{day}</div>
                ))}

                {Array(getDay(monthStart)).fill(null).map((_, i) => (
                    <div key={`empty-${i}`} style={styles.emptyCell}></div>
                ))}

                {days.map((day) => {
                    const dayString = format(day, "yyyy-MM-dd");
                    const stars = puzzleProgress[dayString] || 0;

                    return (
                        <div
                            key={day}
                            style={styles.dayCell}
                            onClick={() => handleDayClick(day)}
                        >
                            {stars > 0 && (
                                <div style={styles.stars}>
                                    {"★".repeat(stars)}
                                    {"☆".repeat(3 - stars)}
                                    </div>
                            )}
                            <span>{format(day, "d")}</span>

                            </div>
                    );
                })}
            </div>

            {selectedDate && (
                <div style={styles.modal}>
                    <p>Select a difficulty</p>
                    <button style={styles.modalButton} onClick={() => handleDifficultySelect("easy")}>Easy</button>
                    <button style={styles.modalButton} onClick={() => handleDifficultySelect("medium")}>Medium</button>
                    <button style={styles.modalButton} onClick={() => handleDifficultySelect("hard")}>Hard</button>
                    <button style={styles.closeButton} onClick={() => setSelectedDate(null)}>Close</button>
                </div>
            )}
        </div>
    );
}
const styles = {
    container: {
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#F4F4F4",
        minHeight: "100vh",
        padding: "20px",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: "18px",
        marginBottom: "20px",
    },
    nav: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        fontSize: "18px",
        marginBottom: "10px",
    },
    calendar: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "10px",
        maxWidth: "400px",
        margin: "auto",
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    },
    dayLabel: {
        fontWeight: "bold",
        padding: "10px",
    },
    emptyCell: {
        height: "40px",
    },
    dayCell: {
        height: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5E5E5",
        borderRadius: "6px",
        cursor: "pointer",
        position: "relative",
    },
    stars: {
        position: "absolute",
        top: "5px",
        fontSize: "12px",
        color: "#FFD700",
    },
    modal: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
        borderRadius: "8px",
        zIndex: 10,
        textAlign: "center",
    },
    modalButton: {
        display: "block",
        margin: "10px auto",
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "black",
        color: "white",
    },
    closeButton: {
        display: "block",
        margin: "10px auto",
        padding: "5px 10px",
        fontSize: "14px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#DDDDDD",
    },
};

export default CalendarPage;