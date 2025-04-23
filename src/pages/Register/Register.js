import { useAuthentication } from "../../hooks/useAuthentication"
import {useState, useEffect} from 'react'
import styles from "./Register.module.css"

const Register = () => {

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const {createUser, error: authError, loading} = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")

    const user = {
      displayName,
      email,
      password
    }

    if(password !== confirmPassword){
      setError("As senhas precisam ser iguais!")
      return
    }

    const res = await createUser(user)

    console.log(res)
  }

  // Add dependency array to useEffect
  useEffect(() => {
    if(authError) {
      setError(authError)
    }
  }, [authError])

  return (
    <div className={styles.register}>
        <h1>Cadastre-se para postar</h1>
        <p>Crie seu Usuário e compartilhe sua história</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="">
            <span>Nome:</span>
            <input 
            type="text"
            name="displayName"
            required
            placeholder="Nome do usauário"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
             />
          </label>
          <label htmlFor="">
            <span>Email:</span>
            <input 
            type="email"
            name="email"
            required
            placeholder="E-mail do usauário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
             />
          </label>
          <label htmlFor="">
            <span>senha:</span>
            <input 
            type="password"
            name="password"
            required
            placeholder="insira sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             />
          </label>
          <label htmlFor="">
            <span>Confirmação de senha:</span>
            <input 
            type="password"
            name="confirmPassword"
            required
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
             />
          </label>
          {!loading && <button  className="btn" type="submit">Cadastrar</button>}
          {loading && (
            <button className="btn" disabled>Aguarde...</button>
          )}
          {error && <p className="error">{error}</p>}
        </form>
    </div>
  )
}

export default Register