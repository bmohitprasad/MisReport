import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const fbconfig = {
    apiKey: "AIzaSyC1DPLYevB2JVERxWAerQWki83WEIdVpuA",
    authDomain: "newproject-75e9f.firebaseapp.com",
    projectId: "newproject-75e9f",
    storageBucket: "newproject-75e9f.firebasestorage.app",
    messagingSenderId: "896342010506",
    appId: "1:896342010506:web:1340aa32f637dc79745b73",
    measurementId: "G-VRS3314CPK"
  };
  
const app = initializeApp(fbconfig);
export const db = getFirestore(app);