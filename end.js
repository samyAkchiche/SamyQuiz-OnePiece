import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { firebaseConfig } from "./firebaseConfig.js";
import {
	getFirestore,
	collection,
	addDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usernameInput = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");

const mostRecentScore = localStorage.getItem("mostRecentScore");

const MAX_HIGH_SCORES = 5;
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
finalScore.innerText = mostRecentScore;

usernameInput.addEventListener("keyup", () => {
	saveScoreBtn.disabled = !usernameInput.value.trim();
});

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const enteredUsername = usernameInput.value.trim();
	if (!enteredUsername) return;

	try {
		const response = await fetch(
			`https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(enteredUsername)}&add=sex,gay,porn,ass`,
		);

		const containsProfanity = await response.text();

		if (containsProfanity === "true") {
			alert("⚠️ Username contains inappropriate language.");
			return;
		}

		const score = {
			score: mostRecentScore,
			name: enteredUsername,
		};
		highScores.push(score);
		highScores.sort((a, b) => b.score - a.score);
		highScores.splice(MAX_HIGH_SCORES);
		localStorage.setItem("highScores", JSON.stringify(highScores));

		await addDoc(collection(db, "quizScores"), {
			username: enteredUsername,
			score: parseInt(score.score),
			timestamp: new Date(),
		});

		console.log("✅ Score saved to Firebase!");

		window.location.assign("index.html");
	} catch (error) {
		console.error("Error saving score:", error);
		alert("❌ Failed to save score. Please try again.");
	}
});
