import firebaseApp from "./config";
import { ref, getStorage, uploadBytes } from "firebase/storage";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

export const uploadModel = async (file: File) => {
  const storageRef = ref(storage, `models/${file.name}`);
  await uploadBytes(storageRef, file)
    .then((snapshot) => console.log("Uploaded: ", snapshot))
    .catch((e) => console.error("Error while uploading file: ", e));
};

export const updateModelInDisplay = async (path: string) => {
  await setDoc(doc(db, "objects", "objectInDisplay"), {
    path: path,
  });
};
