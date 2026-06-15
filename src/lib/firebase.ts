/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

// Support Vercel production environment variables override or fallback to local applet sandbox
const isCustomProd = !!(import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_PROJECT_ID);

const rawFirebaseConfig = isCustomProd ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (import.meta.env.VITE_FIREBASE_PROJECT_ID ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com` : ""),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (import.meta.env.VITE_FIREBASE_PROJECT_ID ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com` : ""),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID
} : {
  apiKey: appletConfig.apiKey,
  authDomain: appletConfig.authDomain,
  projectId: appletConfig.projectId,
  storageBucket: appletConfig.storageBucket,
  messagingSenderId: appletConfig.messagingSenderId,
  appId: appletConfig.appId,
  measurementId: appletConfig.measurementId || "",
  firestoreDatabaseId: appletConfig.firestoreDatabaseId
};

// Process and auto-sanitize the configuration to guard against user environment copy-paste typos
const sanitizeConfig = () => {
  const config = { ...rawFirebaseConfig };
  
  // Trim spaces and quotes from all string values of the configuration (e.g., handles '%20' leading space errors and extra quotes)
  Object.keys(config).forEach((key) => {
    const k = key as keyof typeof config;
    if (typeof config[k] === 'string') {
      let val = (config[k] as string).trim();
      // Remove accidental surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1).trim();
      }
      config[k] = val;
    }
  });

  // Repair authDomain if the user copy-pasted only the project ID (e.g., 'kitchenstore-7e5e0' without '.firebaseapp.com')
  if (config.authDomain && !config.authDomain.includes('.')) {
    config.authDomain = `${config.authDomain}.firebaseapp.com`;
  }

  return config;
};

const firebaseConfig = sanitizeConfig();

// Detailed Browser Console Diagnostics to help the user identify missing Vercel environment variables
console.log("=== Firebase Configuration Information ===");
console.log("Target Mode:", isCustomProd ? "Custom Production (Vercel)" : "AI Studio Sandbox Instance");
console.log("Configured API Key:", firebaseConfig.apiKey ? `✅ Found (${firebaseConfig.apiKey.substring(0, 5)}...)` : "❌ Missing VITE_FIREBASE_API_KEY");
console.log("Configured Project ID:", firebaseConfig.projectId ? `✅ ${firebaseConfig.projectId}` : "❌ Missing VITE_FIREBASE_PROJECT_ID");
console.log("Configured Auth Domain:", firebaseConfig.authDomain ? `✅ ${firebaseConfig.authDomain}` : "❌ Missing VITE_FIREBASE_AUTH_DOMAIN");
console.log("Configured App ID:", firebaseConfig.appId ? `✅ Found (${firebaseConfig.appId.substring(0, 10)}...)` : "❌ Missing VITE_FIREBASE_APP_ID");
console.log("==========================================");

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without the firestoreDatabaseId specified in second arg
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Handles Firestore error by packaging and logging specific JSON payload block.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL COUPLING CONSTRAINT: Test Firestore connection during initial app boot
import { getDocFromServer, doc } from 'firebase/firestore';

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();
