// Paste your Firebase web app config here after creating the Firebase project.
// Firebase Console > Project settings > Your apps > Web app > SDK setup and configuration > Config
export const firebaseConfig = {
  apiKey: "AIzaSyAMWydxNTMsPxENrECTo6VeyS7YIwbLjZU",
  authDomain: "nameless-16961.firebaseapp.com",
  databaseURL: "https://nameless-16961-default-rtdb.firebaseio.com",
  projectId: "nameless-16961",
  storageBucket: "nameless-16961.firebasestorage.app",
  messagingSenderId: "49208226272",
  appId: "1:49208226272:web:da2c190a9d97f003f8fb85",
  measurementId: "G-QR1SDBTBVN"
};

export function hasFirebaseConfig() {
  return !firebaseConfig.apiKey.includes("PASTE_") && !firebaseConfig.projectId.includes("PASTE_");
}
