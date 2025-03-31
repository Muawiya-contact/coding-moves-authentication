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
async function signUp() {
    let name = document.getElementById("signupName").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password) {
        alert("⚠️ Please fill in all fields.");
        return;
    }

    if (password.length < 8) {
        alert("⚠️ Password must be at least 8 characters long.");
        return;
    }

    try {
        let userCredential = await auth.createUserWithEmailAndPassword(email, password);
        let user = userCredential.user;

        // Store user data in Firestore
        await db.collection("users").doc(user.uid).set({ name, email });

        // Send Welcome Email via EmailJS
        await emailjs.send("service_dmhhk6j", "template_jquit7z", {
            user_name: name,
            user_email: email,
            to_email: email
        });

        alert("✅ Sign-Up Successful! Welcome email sent to " + email);
        window.location.href = "welcome.html";
    } catch (error) {
        console.error("❌ Error: ", error);
        alert("❌ " + error.message);
    }
}

// 🎯 **Login Function (With Email Notification)**
async function logIn() {
    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("⚠️ Please enter your email and password.");
        return;
    }

    try {
        let userCredential = await auth.signInWithEmailAndPassword(email, password);
        let user = userCredential.user;

        // Send Login Notification Email using EmailJS
        await emailjs.send("service_dmhhk6j", "template_login_notify", {
            user_email: email,
            to_email: email,
            login_time: new Date().toLocaleString()
        });

        alert("✅ Login Successful! Email notification sent to " + email);
        window.location.href = "welcome.html";
    } catch (error) {
        console.error("❌ Error: ", error);
        alert("❌ " + error.message);
    }
}

// 🎯 **Logout Function**
async function logOut() {
    try {
        await auth.signOut();
        alert("✅ Logged Out!");
        window.location.href = "index.html";
    } catch (error) {
        console.error("❌ Error logging out: ", error);
        alert("❌ Logout failed. Try again.");
    }
}

// 🎯 **Check User State on Welcome Page**
auth.onAuthStateChanged(async (user) => {
    if (user) {
        let doc = await db.collection("users").doc(user.uid).get();
        if (doc.exists) {
            document.getElementById("userInfo").innerHTML = 
                `👋 Hello, <b>${doc.data().name}</b>! You are logged in as <b>${user.email}</b>.`;
        }
    } else {
        console.log("❌ No user signed in");
    }
});
