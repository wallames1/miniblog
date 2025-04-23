import { useContext, createContext, useState, useEffect } from "react"
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from "../firebase/config"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuthValue() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuthValue must be used within an AuthProvider")
    }
    return context
}
