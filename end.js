import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBt_57xN3T3VlcKKakGb63fd-WhgY783fg",
    authDomain: "onepiece-quiz-2022.firebaseapp.com",
    projectId: "onepiece-quiz-2022",
    storageBucket: "onepiece-quiz-2022.firebasestorage.app",
    messagingSenderId: "693060014516",
    appId: "1:693060014516:web:9f3e8d1ad15a4226f722e1",
    measurementId: "G-36MJF9TJ90",
};

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
