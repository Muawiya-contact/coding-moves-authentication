// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsAU0Sw038cATWH9PGXXqJDijuWYTdRdg",
    authDomain: "userauthapp-5a0ac.firebaseapp.com",
    projectId: "userauthapp-5a0ac",
    storageBucket: "userauthapp-5a0ac.firebasestorage.app",
    messagingSenderId: "841035606688",
    appId: "1:841035606688:web:71cfd73b2702532eaa77c5",
    measurementId: "G-KW0CPX1DHQ"
};

// 🚀 Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 📧 Initialize EmailJS
document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("1c2t1tJo3YTvKllgd"); // Replace with your EmailJS Public Key
});

// 🎯 **Sign-Up Function (With Auto Welcome Email)**
function signUp() {
    let name = document.getElementById("signupName").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let password = document.getElementById("signupPassword").value.trim();

    if (password.length < 8) {
        alert("⚠️ Password must be at least 8 characters long.");
        return;
    }

    if (!name || !email || !password) {
        alert("⚠️ Please fill in all fields.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;

            // Store user data in Firestore
            return db.collection("users").doc(user.uid).set({ name, email }).then(() => {
                // Send Welcome Email via EmailJS
                return emailjs.send("service_dmhhk6j", "template_jquit7z", {
                    user_name: name,
                    user_email: email,
                    to_email: email
                });
            }).then(() => {
                alert("✅ Sign-Up Successful! Welcome email sent to " + email);
                window.location.href = "welcome.html";
            }).catch((error) => {
                console.error("❌ Email Sending Failed:", error);
                alert("✅ Sign-Up Successful! But email failed to send.");
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

// 🎯 **Logout Function (Deletes User Data)**
function logOut() {
    let user = auth.currentUser;

    if (user) {
        // Delete user data from Firestore
        db.collection("users").doc(user.uid).delete().then(() => {
            return user.delete(); // Delete user from Firebase Auth
        }).then(() => {
            alert("✅ Logged out and data deleted!");
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("❌ Error deleting user:", error);
            alert("❌ Logout failed. Try again.");
        });
    } else {
        alert("⚠️ No user is logged in.");
    }
}

// 🎯 **Check User State on Welcome Page**
auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                document.getElementById("userInfo").innerHTML = 
                    `👋 Hello, <b>${doc.data().name}</b>! You are logged in as <b>${user.email}</b>.`;
            }
        });
    } else {
        console.log("❌ No user signed in");
    }
});
