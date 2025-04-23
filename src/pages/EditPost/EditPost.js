import styles from './EditPost.module.css'

import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {useAuthValue} from "../../context/AuthContext"
import { useFetchDocument } from '../../hooks/useFetchDocument'
import { useUpdateDocument } from '../../hooks/useUpdateDocument'
import { Timestamp } from "firebase/firestore"


const EditPost = () => {
  

  const {id} = useParams()
  const {document: post} = useFetchDocument("posts", id)

  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState([])
  const [formError, setFormError] = useState ("")
  const {updateDocument, response} = useUpdateDocument("posts")
  const {user} = useAuthValue()

  useEffect(() => {
    if(post ) {
      setTitle(post.title)
      setBody(post.body)
      setImage(post.image)

      const textTags = post.tagsArray.join(", ")

      setTags(textTags)
    }
  }, [post])


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

    const data = {
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName,

    }
    updateDocument(id, data)

    //redirect to home page

    navigate("/dashboard")
  }

  return (
    <div className={styles.edit_post}>
      {post && (
        <>
        <h2>Editando Post: {post.title}</h2>
      <p>altere od dados do post como desejar</p>
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
        <p className={styles.preview_title}>Preview da imagem atual</p>
        <img className={styles.image_preview} src={post.image}  alt={post.title}/>
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
        {!response.loading && <button  className="btn" type="submit">Editar</button>}
          {response.loading && (
            <button className="btn" disabled>Aguarde...</button>
          )}
          {response.error && <p className="error">{response.error}</p>}
          {formError && <p className="error">{formError}</p>}

      </form>
        </>
      )}
    </div>
  )
}

export default EditPost