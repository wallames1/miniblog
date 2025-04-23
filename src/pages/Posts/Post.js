import styles from './Post.module.css'

// hooks
import { useParams } from 'react-router-dom'
import { useFetchDocument } from '../../hooks/useFetchDocument'

const Posts = () => {
  const { id } = useParams()
  const { document: post } = useFetchDocument("posts", id)
  console.log(post)


  return (
    <div>
      {post && (
        <div className={styles.post_container}>
          <h1>{post.title}</h1>
          <img src={post.image} alt={post.title} />
          <p>{post.body}</p>
          <h3>Este post trata sobre:</h3>
          <div className={styles.tags}>
            {post.tagsArray.map((tag) => (
              <p key={tag}>
                <span>#</span>
                {tag}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Posts
