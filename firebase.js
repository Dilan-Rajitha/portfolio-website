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

// --------------- Contact Form Submission (Realtime Database) --------------- //
const contactFormDB = ref(database, "contactForm");

document.getElementById("contactForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  var name = getElementVal("name");
  var emailid = getElementVal("emailid");
  var msgContent = getElementVal("msgContent");

  saveMessages(name, emailid, msgContent);
}

// Function to get form input values
const getElementVal = (id) => document.getElementById(id).value;

// Function to save messages to Firebase Realtime Database
const saveMessages = (name, emailid, msgContent) => {
  const newContactRef = push(contactFormDB);
  set(newContactRef, {
    name: name,
    email: emailid,
    message: msgContent,
  })
    .then(() => console.log("Contact form submitted successfully!"))
    .catch((error) => console.error("Error saving data:", error));
};

// --------------- Load and Display Projects (Firestore) --------------- //
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

  // Handle "See More" button click
  document.querySelectorAll('.see-more-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = e.target.getAttribute('data-id');
      openProjectPopup(projectId);
    });
  });
}

async function openProjectPopup(projectId) {
  const docRef = doc(db, "projects", projectId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const project = docSnap.data();
    const popup = document.getElementById('project-popup');
    popup.querySelector('.popup-title').textContent = project.title;
    popup.querySelector('.popup-description').textContent = project.description;
    popup.style.display = 'flex';
  } else {
    console.log("No such document!");
  }
}

// Close Popup
document.querySelector('.popup-close-btn').addEventListener('click', () => {
  document.getElementById('project-popup').style.display = 'none';
});

// Load Projects on Window Load
window.onload = loadProjects;
