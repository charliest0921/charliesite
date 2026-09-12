// Firebase config for the card system only.
// Do not put initializeApp() here. card-draw.html and card-status.html initialize Firebase after importing this config.
export const cardFirebaseConfig = {
  apiKey: "AIzaSyATVQkSigFi8P_MT2Xoqb3I-VEoGoAerkg",
  authDomain: "cardsystem-dbac1.firebaseapp.com",
  projectId: "cardsystem-dbac1",
  storageBucket: "cardsystem-dbac1.firebasestorage.app",
  messagingSenderId: "254364970300",
  appId: "1:254364970300:web:d26d8895f3b39b63780239",
  measurementId: "G-4BB2M3KGTF"
};

export function hasCardFirebaseConfig() {
  return !cardFirebaseConfig.apiKey.includes("PASTE_")
    && !cardFirebaseConfig.projectId.includes("PASTE_");
}
