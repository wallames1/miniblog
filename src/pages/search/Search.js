import styles from "./Search.module.css"

import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQuery } from "../../hooks/useQuery";
  //components
import PostDetail from "../../components/PostDetail";
import {Link} from "react-router-dom"

const Search = () => {
  const query = useQuery();
  const search = query.get("q");
  const { documents: posts, loading } = useFetchDocuments("posts", search);



  

  return (
    <div className={styles.search_container}>
      <h2>Resultados da busca</h2>
      {loading && <p>Carregando...</p>}
      {posts && posts.length === 0 && (
        <div className={styles.noposts}>
        <p>Não foram encontrados posts</p> 
        <Link to="/" className="btn btn-dark">
        Voltar
        </Link>
        </div>
      )}
        <div>
          {posts && posts.map((post) => <PostDetail key={post.id} post={post}/>)}
        </div>
    </div>
  );
};

export default Search;
