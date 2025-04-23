import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const collectionRef = collection(db, docCollection);

    let q;

    if (search) {
      q = query(
        collectionRef,
        where("keywords", "array-contains", search),
        orderBy("createdAt", "desc")
      );
    } else if (uid) {
      q = query(
        collectionRef,
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(collectionRef, orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let results = [];

      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      setDocuments(results);
      setLoading(false);
    });

    return () => unsubscribe(); // cancela o listener ao desmontar
  }, [docCollection, search, uid]);

  return { documents, loading };
};
