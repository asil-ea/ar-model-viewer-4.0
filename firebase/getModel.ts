import firebaseApp from "./config";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);
const docRef = doc(db, "objects", "objectInDisplay");

const getModelFromFirestore = async () => {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().path;
  } else {
    console.error("Document not found in Firestore: objects/objectInDisplay");
  }
};

export const getModelPath = async () => {
  return await getModelFromFirestore();
}

export const getModelUrl = async () => {
  const modelPath = await getModelFromFirestore();

  return await getDownloadURL(ref(storage, modelPath))
    .then((url) => {
      return url;
    })
    .catch((error) => {
      return error;
    });
};