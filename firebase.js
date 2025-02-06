import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, push, ref, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { collection, doc, getDoc, getDocs, getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAknOuxJx8EZTBGro5ScaoRXnwjWvCdCGA",
  authDomain: "porfolio-site-66a97.firebaseapp.com",
  databaseURL: "https://porfolio-site-66a97-default-rtdb.firebaseio.com",
  projectId: "porfolio-site-66a97",
  storageBucket: "porfolio-site-66a97.appspot.com",
  messagingSenderId: "329882807742",
  appId: "1:329882807742:web:221500924d522f750b1def"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);

// Contact Form Handling (Web3Forms & Firebase)
const contactForm = document.querySelector("form");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");

        if (!name || !email || !message) {
            alert("Please fill in all fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Save to Firebase
        const contactFormDB = ref(database, "contactForm");
        const newContactRef = push(contactFormDB);
        set(newContactRef, { name, email, message })
            .then(() => console.log("Contact form submitted successfully!"))
            .catch((error) => console.error("Error saving data:", error));

        // Submit to Web3Forms
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Message sent successfully!");
                    contactForm.reset();
                } else {
                    alert("Error sending message. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            });
    });
}

// Load and Display Projects (Firestore)
async function loadProjects() {
    const projectsContainer = document.getElementById("projects-container");
    const querySnapshot = await getDocs(collection(db, "projects"));
    projectsContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const project = doc.data();
        const projectCard = `
            <div class="project-card">
                <img src="${project.image}" alt="${project.title}" />
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <button class="see-more-btn" data-id="${doc.id}">See More</button>
                </div>
            </div>
        `;
        projectsContainer.innerHTML += projectCard;
    });

    document.querySelectorAll(".see-more-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const projectId = e.target.getAttribute("data-id");
            openProjectPopup(projectId);
        });
    });
}

async function openProjectPopup(projectId) {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const project = docSnap.data();
        const popup = document.getElementById("project-popup");
        popup.querySelector(".popup-title").textContent = project.title;
        popup.querySelector(".popup-description").textContent = project.description;
        popup.style.display = "flex";
    } else {
        console.log("No such document!");
    }
}

document.querySelector(".popup-close-btn").addEventListener("click", () => {
    document.getElementById("project-popup").style.display = "none";
});

window.onload = loadProjects;
