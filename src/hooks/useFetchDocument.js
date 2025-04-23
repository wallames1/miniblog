import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc
    ,getDoc
 } from "firebase/firestore";

export const useFetchDocument = (docCollection, id) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDocument = async () => {
      if (!docCollection) {
        console.error("Erro: Nome da coleção não foi fornecido.");
        setError("Erro ao buscar documentos.");
        return;
      }

      setLoading(true);
      setError(null);

      try{
        const docRef = await doc(db, docCollection, id)
        const docSnap = await getDoc(docRef)

        setDocument(docSnap.data())

        setLoading(false)
      }catch (error) {
        console.log(error)
        setError(error.message)

        setLoading(true)

      }

    };

    loadDocument();
  }, [docCollection, id,]);

  return { document, loading, error };
};
