import { db } from "../firebase/config"
import { doc, updateDoc, Timestamp } from "firebase/firestore"
import { useState, useEffect, useReducer } from "react"

const initialState = {
  loading: false,
  error: null,
}

const updateReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null }
    case "UPDATED_DOC":
      return { loading: false, error: null }
    case "ERROR":
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const useUpdateDocument = (docCollection) => {
  const [response, dispatch] = useReducer(updateReducer, initialState)

  const updateDocument = async (id, data) => {
    dispatch({ type: "LOADING" })
    try {
      const docRef = doc(db, docCollection, id)

      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      })

      dispatch({ type: "UPDATED_DOC" })
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.message })
    }
  }

  return { updateDocument, response }
}
