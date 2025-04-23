import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'  // Changed from @firebase/auth to firebase/auth
import { useState, useEffect } from "react"
import { app } from "../firebase/config"  // Import app from firebase config

const auth = getAuth(app)  // Initialize auth here

export const useAuthentication = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [cancelled, setCancelled] = useState(false)

    function checkIfIsCancelled() {
        if (cancelled) return true;
        return false;
    }
//register
    const createUser = async (data) => {
        if (checkIfIsCancelled()) return

        setLoading(true)
        setError(null)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
            const user = userCredential.user;

            await updateProfile(user, { displayName: data.displayName });

            setLoading(false);
            return user;

        } catch (error) {
            console.log(error.message);
            let systemErrorMessage;

            if (error.code === "auth/weak-password") {
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
            } else if (error.code === "auth/email-already-in-use") {
                systemErrorMessage = "E-mail já cadastrado.";
            } else {
                systemErrorMessage = "Ocorreu um erro, tente mais tarde.";
            }

            setError(systemErrorMessage);
            setLoading(false);
        }
    };
//logout
const logout = () => {

    checkIfIsCancelled()

    signOut(auth)

}

//login
const login = async(data) => {
    checkIfIsCancelled()
    setLoading(true)
    setError(null)

    try{
        await signInWithEmailAndPassword(auth, data.email, data.password)
        setLoading(false);
    }catch(error){
        let systemErrorMessage
        if (error.code === "auth/user-not-found") {
            systemErrorMessage = "Usuário não encontrado";
        } else if (error.code === "auth/wrong-password") {
            systemErrorMessage = "Senha incorreta";
        }
        else{
            systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde"
        }
        setError(systemErrorMessage)
        setLoading(false)
    }
}

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login
    }
}
