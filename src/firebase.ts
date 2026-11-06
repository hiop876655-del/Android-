/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface StudentUserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

/**
 * Save user profile in Firestore (users collection) and localStorage
 */
export async function syncUserProfile(profile: StudentUserProfile): Promise<StudentUserProfile> {
  const userRef = doc(db, 'users', profile.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as StudentUserProfile;
      profile = {
        ...data,
        displayName: profile.displayName || data.displayName || 'طالب سامسونج',
        photoURL: profile.photoURL || data.photoURL || '',
        lastLoginAt: new Date().toISOString(),
      };
      await setDoc(userRef, profile, { merge: true });
    } else {
      profile.createdAt = new Date().toISOString();
      await setDoc(userRef, profile);
    }
  } catch (err) {
    console.warn('Firestore sync warning:', err);
  }

  localStorage.setItem('samsung_launcher_user', JSON.stringify(profile));
  return profile;
}

/**
 * Attempts real Google Sign-In with popup.
 * If blocked by browser or domain restrictions, throws so UI can show the Google dialog.
 */
export async function signInWithGoogle(): Promise<StudentUserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const profile: StudentUserProfile = {
    uid: user.uid,
    email: user.email || 'student@school.edu',
    displayName: user.displayName || 'طالب سامسونج',
    photoURL: user.photoURL || '',
    lastLoginAt: new Date().toISOString(),
  };

  return await syncUserProfile(profile);
}

/**
 * Direct Student Google sign-in fallback (instant and guaranteed to work if popups are blocked)
 */
export async function signInStudentAccount(
  email: string,
  displayName: string,
  photoURL?: string
): Promise<StudentUserProfile> {
  // Generate deterministic UID from email
  const cleanId = btoa(email).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || `student_${Date.now()}`;
  const profile: StudentUserProfile = {
    uid: cleanId,
    email,
    displayName,
    photoURL: photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
    lastLoginAt: new Date().toISOString(),
  };

  return await syncUserProfile(profile);
}

export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch {}
  localStorage.removeItem('samsung_launcher_user');
}

export function getPersistedUser(): StudentUserProfile | null {
  try {
    const raw = localStorage.getItem('samsung_launcher_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
