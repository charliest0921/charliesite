// Paste your Firebase web app config here after creating the Firebase project.
// Firebase Console > Project settings > Your apps > Web app > SDK setup and configuration > Config
export const firebaseConfig = {
  apiKey: "AIzaSyDQmVxYKZEKs-NGm67J2Dumax4Ub0fzvFY",
  authDomain: "charliesite-ae112.firebaseapp.com",
  projectId: "charliesite-ae112",
  storageBucket: "charliesite-ae112.firebasestorage.app",
  messagingSenderId: "420070493240",
  appId: "1:420070493240:web:93c9d953c4924f78da2acd",
  measurementId: "G-Z31BV396CB"
};

export function hasFirebaseConfig() {
  return !firebaseConfig.apiKey.includes("PASTE_") && !firebaseConfig.projectId.includes("PASTE_");
}
