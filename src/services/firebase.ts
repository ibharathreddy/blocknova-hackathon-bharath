import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Firestore
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  Auth,
  User
} from 'firebase/auth';
import { RegistrationData, RegistrationStatus } from '../types';

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCV29Sl_na8W1eRYjcxX2dTMWkDCyGNyg",
  authDomain: "hackathonvce-dbe0a.firebaseapp.com",
  projectId: "hackathonvce-dbe0a",
  storageBucket: "hackathonvce-dbe0a.firebasestorage.app",
  messagingSenderId: "415569971672",
  appId: "1:415569971672:web:2aa6230fee2b31fbffcaad",
  measurementId: "G-0QZCDFP06K"
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Initialize Authentication
export const auth: Auth = getAuth(app);

// Initialize Analytics if supported in browser environment
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported or blocked
  });
}

// -------------------------------------------------------------
// FIRESTORE REGISTRATION OPERATIONS
// -------------------------------------------------------------
const REGISTRATIONS_COLLECTION = 'registrations';

/**
 * Save or overwrite a team registration document in Firestore
 */
export async function saveRegistrationToFirestore(registration: RegistrationData): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registration.registrationId);
    await setDoc(docRef, registration, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error('Error saving registration to Firestore:', error);
    return {
      success: false,
      error: error.message || 'Failed to save registration to cloud database'
    };
  }
}

/**
 * Fetch all registrations from Firestore
 */
export async function fetchRegistrationsFromFirestore(): Promise<RegistrationData[]> {
  try {
    const colRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const results: RegistrationData[] = [];
    snapshot.forEach((d) => {
      results.push(d.data() as RegistrationData);
    });
    return results;
  } catch (error) {
    console.error('Error fetching registrations from Firestore:', error);
    return [];
  }
}

/**
 * Real-time listener for registrations collection
 */
export function subscribeToRegistrationsFirestore(
  onData: (data: RegistrationData[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: RegistrationData[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as RegistrationData);
        });
        onData(items);
      },
      (err) => {
        console.warn('Firestore real-time subscription error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.warn('Could not establish Firestore subscription:', err);
    return () => {};
  }
}

/**
 * Update registration status in Firestore
 */
export async function updateRegistrationStatusInFirestore(
  registrationId: string,
  status: RegistrationStatus,
  notes?: string,
  reviewer?: string
): Promise<boolean> {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    const now = new Date().toISOString();
    const updateData: any = {
      status,
      updatedAt: now
    };
    if (notes !== undefined) updateData.adminNotes = notes;
    if (reviewer) updateData.reviewedBy = reviewer;
    updateData.reviewedAt = now;

    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error(`Error updating registration ${registrationId} in Firestore:`, error);
    return false;
  }
}

/**
 * Delete a registration from Firestore
 */
export async function deleteRegistrationFromFirestore(registrationId: string): Promise<boolean> {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting registration ${registrationId} from Firestore:`, error);
    return false;
  }
}

/**
 * Fetch a single registration by Registration ID
 */
export async function fetchRegistrationByIdFromFirestore(registrationId: string): Promise<RegistrationData | null> {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as RegistrationData;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching registration ${registrationId}:`, error);
    return null;
  }
}

// -------------------------------------------------------------
// FIRESTORE SYSTEM CONFIG (PROBLEM STATEMENTS RELEASE & LIMITS)
// -------------------------------------------------------------
const SYSTEM_CONFIG_COLLECTION = 'system_config';
const PS_CONFIG_DOC = 'problem_statements_config';

export async function savePSConfigToFirestore(config: { isPSReleased?: boolean; problemStatements?: any[] }): Promise<void> {
  try {
    const docRef = doc(db, SYSTEM_CONFIG_COLLECTION, PS_CONFIG_DOC);
    await setDoc(docRef, config, { merge: true });
  } catch (error) {
    console.warn('Could not save PS config to Firestore:', error);
  }
}

export function subscribeToPSConfigFirestore(
  onData: (data: { isPSReleased?: boolean; problemStatements?: any[] }) => void
) {
  try {
    const docRef = doc(db, SYSTEM_CONFIG_COLLECTION, PS_CONFIG_DOC);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          onData(snap.data() as any);
        }
      },
      (err) => {
        console.warn('Firestore PS config subscription notice:', err);
      }
    );
  } catch (error) {
    console.warn('Could not subscribe to PS config in Firestore:', error);
    return () => {};
  }
}

// -------------------------------------------------------------
// FIREBASE AUTHENTICATION HELPERS
// -------------------------------------------------------------

/**
 * Sign up a new user with email and password
 */
export async function firebaseSignUp(email: string, password: string, displayName?: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
}

/**
 * Sign in existing user with email and password
 */
export async function firebaseSignIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign out current user
 */
export async function firebaseSignOut(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to Auth state changes
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
