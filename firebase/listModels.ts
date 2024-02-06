import { getStorage, ref, listAll } from "firebase/storage";
import firebaseApp from "./config";

export interface IModels {
  name: string;
  path: string;
}

const storage = getStorage(firebaseApp);

// Create a reference under which you want to list
const listRef = ref(storage, "models");

const listModels = async () => {
  const models: IModels[] = [];
  
  // Find all the prefixes and items.
  await listAll(listRef)
    .then((res) => {
      res.items.forEach((itemRef) => {
        // All the items under listRef.
        models.push({name: itemRef.name, path: itemRef.fullPath});
      });
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      console.error("Error while listing models: ", error);
    });

  return models;
};

export default listModels;
