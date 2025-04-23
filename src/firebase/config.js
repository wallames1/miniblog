import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyAiiV7SHUk14tV7C26ycSvfkd2kCgS9MfQ",
    authDomain: "mini-blog-dc5e1.firebaseapp.com",
    projectId: "mini-blog-dc5e1",
    storageBucket: "mini-blog-dc5e1.firebasestorage.app",
    messagingSenderId: "971381418476",
    appId: "1:971381418476:web:91c7895e280fd4e618b8c9"
  };

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }  // Added 'app' to exports
