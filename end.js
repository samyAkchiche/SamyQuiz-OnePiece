import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { firebaseConfig } from "./firebaseConfig.js";
import {
    getFirestore,
    collection,
    addDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const MAX_HIGH_SCORES = 5;
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const badWords = [
    "zebbi",
    "fuck",
    "hechun",
    "ass",
    "pussy",
    "sex",
    "porn",
    "milf",
    "abouch",
    "winiw",
    "boob",
    "thigh",
]; // Add whatever you want

function containsBadWord(username) {
    const lower = username.toLowerCase();
    return badWords.some((word) => lower.includes(word));
}

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
    saveScoreBtn.disabled = !username.value;
});

export const saveHighScore = async (e) => {
    e.preventDefault();

    if (containsBadWord(username.value)) {
        alert("⚠️ That username is not allowed. Please choose another.");
        return;
    }

    const score = {
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);
    localStorage.setItem("highScores", JSON.stringify(highScores));

    try {
        await addDoc(collection(db, "quizScores"), {
            username: score.name,
            score: parseInt(score.score),
            timestamp: new Date(),
        });
        console.log("✅ Score saved to Firebase!");
    } catch (error) {
        console.error("❌ Error saving to Firestore:", error);
    }

    window.location.assign("index.html");
};

const form = document.querySelector("form");
form.addEventListener("submit", saveHighScore);
