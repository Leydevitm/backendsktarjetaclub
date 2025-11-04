import { initializeApp } from "firebase-admin/app";
import { applicationDefault } from "firebase-admin/app";


const adminApp = initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://super-kompras.firebaseio.com"
});

export { adminApp }