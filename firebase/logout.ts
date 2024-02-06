import firebaseApp from "./config";
import { signInWithEmailAndPassword, getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebaseApp);

const logOut = async () => {
    let result = null,
        error = null;
    try {
        result = await signOut(auth);
    } catch (e) {
        error = e;
    }

    return { result, error };
}

export default logOut;