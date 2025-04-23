import styles from './PostDetail.module.css'

import { Link } from 'react-router-dom'

const PostDetail = ({ post }) => {

    const tags = Array.isArray(post.tagsArray) ? post.tagsArray : [];
 


    return (
        <div className={styles.post_details}>
            <img src={post.image} alt={post.title} />
            <h2>{post.title}</h2>
            <p className={styles.createdBy}>{post.createdBy}</p>
            <div className={styles.tags}>
            {tags.map((tag, index) => (
          <p key={index}>

                        <span>#</span>
                        {tag}

                    </p>
                ))}
            </div>
                <Link to={`/posts/${post.id}`} className='btn btn-outline'>
                Ler
                </Link>
        </div>
    )
}

export default PostDetail