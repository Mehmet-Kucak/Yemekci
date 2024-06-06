import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAn3Z80r4gnvYmo7TnoeMlYXQjzL0iD4V4",
    authDomain: "yemek-ci.firebaseapp.com",
    projectId: "yemek-ci",
    storageBucket: "yemek-ci.appspot.com",
    messagingSenderId: "420794041823",
    appId: "1:420794041823:web:4bc41d4fde967469a6f06a",
    measurementId: "G-CKP5NWE313"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
