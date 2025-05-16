
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

export const FIREBASE_CONFIG_PLACEHOLDER = "YOUR_API_KEY";

export function checkFirebaseConfig() {
  if (firebaseConfig.apiKey === FIREBASE_CONFIG_PLACEHOLDER) {
    console.warn(
      "Firebase configuration is not set. Please update src/firebase.js with your Firebase project details."
    );
    alert(
      "La configuración de Firebase no está completa. Por favor, actualiza src/firebase.js con los detalles de tu proyecto Firebase y luego refresca la página. La aplicación podría no funcionar correctamente hasta que esto se haga."
    );
    return false;
  }
  return true;
}
  