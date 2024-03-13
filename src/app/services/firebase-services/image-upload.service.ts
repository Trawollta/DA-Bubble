import { Injectable } from '@angular/core';
import { Storage, ref, getStorage, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor() { }

  async uploadImage(file: File, userId: string): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, 'userImages/' + userId + '/' + file.name);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url; // Dies ist die URL des hochgeladenen Bildes
    } catch (error) {
      console.error("Fehler beim Hochladen: ", error);
      throw error;
    }
  }
}

