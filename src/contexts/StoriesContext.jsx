import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    orderBy
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const StoriesContext = createContext();

export function useStories() {
    return useContext(StoriesContext);
}

export function StoriesProvider({ children }) {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStoryId, setSelectedStoryId] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            setStories([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "stories"),
            where("userId", "==", currentUser.uid)
            // orderBy("lastModified", "desc") // Commented out to avoid immediate index requirement
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (error) => {
            console.error("Firestore Error:", error);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    function createStory() {
        return addDoc(collection(db, "stories"), {
            userId: currentUser.uid,
            title: "Untitled Story",
            content: "",
            createdAt: serverTimestamp(),
            lastModified: serverTimestamp()
        });
    }

    function updateStory(id, data) {
        const storyRef = doc(db, "stories", id);
        return updateDoc(storyRef, {
            ...data,
            lastModified: serverTimestamp()
        });
    }

    function deleteStory(id) {
        return deleteDoc(doc(db, "stories", id));
    }

    const value = {
        stories,
        loading,
        selectedStoryId,
        setSelectedStoryId,
        createStory,
        updateStory,
        deleteStory,
        currentStory: stories.find(s => s.id === selectedStoryId)
    };

    return (
        <StoriesContext.Provider value={value}>
            {children}
        </StoriesContext.Provider>
    );
}
