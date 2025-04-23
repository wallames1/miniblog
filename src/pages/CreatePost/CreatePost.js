import styles from './CreatePost.module.css'

import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useAuthValue} from "../../context/AuthContext"
import { useInsertDocument } from '../../hooks/useinsertDocuments'

const CreatePost = () => {

  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState([])
  const [formError, setFormError] = useState ("")
  const {insertDocument, response} = useInsertDocument("posts")
  const {user} = useAuthValue()


  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError("")

    //validar url da img
    try{
      new URL(image)
    }catch (error){
      setFormError("A imagem precisa dser uma URL")
    }


    //criar array de tags
    const tagsArray = tags.split (",").map((tag) => tag.trim().toLowerCase())

    //checar todos os valores
    if(!title || !image || !tags || !body){
      setFormError("Por Favor, preencha todos os campos")
    }

    if(formError) return

    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName,

    })

    //redirect to home page

    navigate("/")
  }

  return (
    <div className={styles.create_post}>
      <h2>Criar Post</h2>
      <p>Escreva sobre o que está pensando</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">
          <span>Título:</span>
          <input 
          type="text" 
          name='title' 
          required 
          placeholder='Pense em um bom Título' 
          onChange={(e) => setTitle(e.target.value)}
          value={title} />
        </label>
        <label htmlFor="">
          <span>Url:</span>
          <input 
          type="text" 
          name='image' 
          required 
          placeholder='Insira sua Imagem' 
          onChange={(e) => setImage(e.target.value)}
          value={image} />
        </label>
        <label htmlFor="">
          <span>Conteúdo:</span>
          <textarea 
          name='body' 
          required 
          placeholder='Insira o Conteúdo do post' 
          onChange={(e) => setBody(e.target.value)}
          value={body} >
          </textarea>
        </label>
        <label htmlFor="">
          <span>Tags:</span>
          <input 
          type="text" 
          name='tags' 
          required 
          placeholder='Insira as tags separadas por virgula' 
          onChange={(e) => setTags(e.target.value)}
          value={tags} />
        </label>
        {!response.loading && <button  className="btn" type="submit">Cadastrar</button>}
          {response.loading && (
            <button className="btn" disabled>Aguarde...</button>
          )}
          {response.error && <p className="error">{response.error}</p>}
          {formError && <p className="error">{formError}</p>}

      </form>
    </div>
  )
}

export default CreatePost