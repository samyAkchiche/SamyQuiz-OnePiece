// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    limit,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
