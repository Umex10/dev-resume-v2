import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

/**
 * Initializes the Firebase Admin SDK.
 * 
 * This configuration is **CRITICAL** for Server Actions (`use server`) and API routes.
 * Unlike the client SDK, the Admin SDK provides privileged access to Firebase services,
 * bypassing client-side security rules. It uses a Service Account for authentication.
 * 
 * The check `!admin.apps.length` ensures the Admin app is initialized only once per server instance.
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,

      // Handles newline characters in the private key, which can be problematic in some environment variable systems.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

/**
 * Firestore Database instance (Admin SDK).
 * Used for performing database operations on the server side with full admin privileges.
 */
const db = admin.firestore();

/**
 * Firebase Auth instance (Admin SDK).
 * Used for managing users and authentication on the server side with full admin privileges.
 */
const adminAuth = getAuth();

export { db, adminAuth };