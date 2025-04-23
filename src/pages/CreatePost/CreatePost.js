import styles from './CreatePost.module.css'

import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useAuthValue} from "../../context/AuthContext"
import { useInsertDocument } from '../../hooks/useinsertDocuments'
import { storage } from '../../firebase/config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const CreatePost = () => {

  const [title, setTitle] = useState("")
  // Remove unused state if not needed
  const [image, setImage] = useState(null)
  // Remove imageURL state if not needed
  // const [imageURL, setImageURL] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState([])
  const [formError, setFormError] = useState ("")
  const {insertDocument, response} = useInsertDocument("posts")
  const {user} = useAuthValue()


  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    try {
      // Validate inputs
      if(!title || !image || !tags || !body){
        setFormError("Por Favor, preencha todos os campos")
        return
      }

      // Create tags array
      const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase())

      // Create a unique filename
      const timestamp = new Date().getTime()
      const filename = `${timestamp}_${image.name}`
      const storageRef = ref(storage, `images/${filename}`)

      // Upload the file
      await uploadBytesResumable(storageRef, image)
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Create post document
      await insertDocument({
        title,
        image: downloadURL,
        body,
        tagsArray,
        uid: user.uid,
        createdBy: user.displayName,
      })

      // Redirect to home page
      navigate("/")
    
    } catch (error) {
      console.error("Error details:", error)
      setFormError("Erro ao criar post: " + error.message)
    }
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
          <span>Imagem:</span>
          <input 
            type="file" 
            name='image' 
            required 
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
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