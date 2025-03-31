// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsAU0Sw038cATWH9PGXXqJDijuWYTdRdg",
    authDomain: "userauthapp-5a0ac.firebaseapp.com",
    projectId: "userauthapp-5a0ac",
    storageBucket: "userauthapp-5a0ac.firebasestorage.app",
    messagingSenderId: "841035606688",
    appId: "1:841035606688:web:71cfd73b2702532eaa77c5",
    measurementId: "G-KW0CPX1DHQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 🎯 **Sign-Up Function**
function signUp() {
    let name = document.getElementById("signupName").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let password = document.getElementById("signupPassword").value.trim();

    if (password.length < 8) {
        alert("⚠️ Password must be at least 8 characters.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            db.collection("users").doc(user.uid).set({ name, email }).then(() => {
                alert("✅ Account Created! Redirecting...");
                window.location.href = "welcome.html";
            });
        })
        .catch((error) => alert("❌ " + error.message));
}

// 🎯 **Login Function**
function logIn() {
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert("✅ Login Successful!");
            window.location.href = "welcome.html";
        })
        .catch((error) => alert("❌ " + error.message));
}

// 🎯 **Logout Function**
function logOut() {
    auth.signOut()
        .then(() => {
            alert("✅ Logged Out!");
            window.location.href = "index.html";
        })
        .catch((error) => alert("❌ " + error.message));
}
