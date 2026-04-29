import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { OperationType, FirestoreErrorInfo, UserProfile as UserProfileData, ProgressData } from '../types';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
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
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const firebaseService = {
  // --- USER PROFILE ---
  async getUserProfile(userId: string): Promise<UserProfileData | null> {
    const path = `users/${userId}`;
    try {
      const docRef = doc(db, path);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? snapshot.data() as UserProfileData : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async createUserProfile(userId: string, data: Partial<UserProfileData>) {
    const path = `users/${userId}`;
    try {
      const docRef = doc(db, path);
      const profile = {
        ...data,
        uid: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(docRef, profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateUserProfile(userId: string, data: Partial<UserProfileData>) {
    const path = `users/${userId}`;
    try {
      const docRef = doc(db, path);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // --- PROGRESS ---
  async syncProgress(userId: string, progress: ProgressData) {
    const path = `users/${userId}/progress/${progress.lessonId}`;
    try {
      const docRef = doc(db, path);
      await setDoc(docRef, {
        ...progress,
        lastAccessed: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getAllProgress(userId: string): Promise<ProgressData[]> {
    const path = `users/${userId}/progress`;
    try {
      const colRef = collection(db, path);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(doc => doc.data() as ProgressData);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
};
