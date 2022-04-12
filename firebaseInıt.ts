import { credential, ServiceAccount } from "firebase-admin";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import firebaseCredentials from "./firebase-servs.json";

const app = initializeApp({
  credential: credential.cert(firebaseCredentials as ServiceAccount),
});

export const fireBaseAuth = getAuth(app);
