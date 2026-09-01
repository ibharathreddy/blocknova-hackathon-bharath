import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import {
  initializeFirestore,
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

// Initialize Firestore safely with ignoreUndefinedProperties enabled
export const db: Firestore = (() => {
  try {
    return initializeFirestore(app, {
      ignoreUndefinedProperties: true
    });
  } catch {
    return getFirestore(app);
  }
})();

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
// FIRESTORE DATA SANITIZATION HELPER
// -------------------------------------------------------------
/**
 * Recursively removes undefined keys and ensures clean JSON-compatible data for Firestore.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        sanitized[key] = sanitizeForFirestore(val);
      }
    }
    return sanitized as any;
  }
  return data;
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
    if (!registration || !registration.registrationId) {
      throw new Error('Invalid registration data: missing registrationId');
    }
    const sanitizedData = sanitizeForFirestore(registration);
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registration.registrationId);
    await setDoc(docRef, sanitizedData, { merge: true });
    console.log(`[Firestore] Successfully saved registration ${registration.registrationId} to cloud database.`);
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
    let snapshot;
    try {
      const q = query(colRef, orderBy('createdAt', 'desc'));
      snapshot = await getDocs(q);
    } catch {
      // Fallback query without orderBy in case of indexing or schema variance
      snapshot = await getDocs(colRef);
    }
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
        console.warn('Firestore real-time subscription query warning, retrying plain collection:', err);
        // Fallback subscription to collection without ordering query
        try {
          return onSnapshot(colRef, (snapshot) => {
            const items: RegistrationData[] = [];
            snapshot.forEach((d) => {
              items.push(d.data() as RegistrationData);
            });
            onData(items);
          });
        } catch (innerErr: any) {
          if (onError) onError(innerErr);
        }
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

    const sanitizedData = sanitizeForFirestore(updateData);
    await updateDoc(docRef, sanitizedData);
    console.log(`[Firestore] Updated registration ${registrationId} status to ${status}`);
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
    console.log(`[Firestore] Deleted registration ${registrationId}`);
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
    const sanitized = sanitizeForFirestore(config);
    await setDoc(docRef, sanitized, { merge: true });
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
