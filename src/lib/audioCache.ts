
export class AudioCache {
  private static dbName = 'spi_audio_cache';
  private static storeName = 'audio_blobs';
  private static version = 1;

  private static openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  static async get(id: string): Promise<string | null> {
    try {
      const db = await this.openDB();
      const localData = await new Promise<string | null>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || null);
      });
      
      if (localData) return localData;
      
      // Fallback: Check pre-generated static cache in `/audio_cache/`
      // The id here is a cacheKey like "1.1_hash" or "onboarding_complete_hash" so we extract the lessonId.
      const lastUnderscore = id.lastIndexOf('_');
      const lessonId = lastUnderscore !== -1 ? id.substring(0, lastUnderscore) : id;
      if (lessonId && lessonId.length > 0) {
        try {
          const res = await fetch(`/audio_cache/${lessonId}.txt`);
          if (res.ok) {
            const b64 = await res.text();
            if (b64 && b64.length > 100) {
              // Save into IndexedDB for next time
              await this.set(id, b64);
              return b64;
            }
          }
        } catch (e) {
          console.warn("Could not fetch pre-generated cache for", lessonId);
        }
      }

      return null;
    } catch (e) {
      console.error('IndexedDB get error:', e);
      return null;
    }
  }

  static async set(id: string, data: string): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(data, id);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (e) {
      console.error('IndexedDB set error:', e);
    }
  }

  static async clear(): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (e) {
      console.error('IndexedDB clear error:', e);
    }
  }

  static async getAllKeys(): Promise<string[]> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result as string[]);
      });
    } catch (e) {
      console.error('IndexedDB getAllKeys error:', e);
      return [];
    }
  }
}
