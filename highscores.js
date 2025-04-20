// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { firebaseConfig } from "./firebaseConfig.js";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    limit,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const highScoresList = document.getElementById("highScoresList");
// ! Doesnt display yet(err):
const medals = ["🥇", "🥈", "🥉"];

const getScores = async () => {
    try {
        const scoresQuery = query(
            collection(db, "quizScores"),
            orderBy("score", "desc"),
            limit(5)
        );

        const querySnapshot = await getDocs(scoresQuery);

        highScoresList.innerHTML = "";

        querySnapshot.forEach((doc, index) => {
            const { username, score } = doc.data();
            console.log(`Fetching score: ${username} - ${score}`);

            const li = document.createElement("li");
            li.className = "high-score";
            // ! Doesn't display the icons yet:
            const medal = medals[index] || "";
            li.innerHTML = `<span class="medal">${medal}</span> ${username} - ${score}`;
            console.log(li);

            highScoresList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading scores: ", error);
        highScoresList.innerHTML = "<li>Error loading scores</li>";
    }
};

getScores();
