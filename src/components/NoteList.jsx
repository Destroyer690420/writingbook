import React, { useState } from 'react';
import { useStories } from '../contexts/StoriesContext';
import { SquarePen, Trash2, Search } from 'lucide-react';

export default function NoteList({ width }) {
    const { stories, createStory, deleteStory, selectedStoryId, setSelectedStoryId } = useStories();
    const [search, setSearch] = useState('');

    const filteredStories = stories.filter(story =>
        story.title.toLowerCase().includes(search.toLowerCase()) ||
        story.content.slice(0, 100).toLowerCase().includes(search.toLowerCase())
    );

    async function handleCreate() {
        try {
            const docRef = await createStory();
            setSelectedStoryId(docRef.id);
        } catch (err) {
            console.error("Failed to create story", err);
            // Re-added alert for user feedback
            alert("Failed to create story: " + err.message);
        }
    }

    async function handleDelete(e, id) {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this note?")) {
            await deleteStory(id);
            if (selectedStoryId === id) {
                setSelectedStoryId(null);
            }
        }
    }

    // Format date like macOS (Time if today, Date otherwise)
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();

        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString();
    };

    return (
        <div className="flex-col" style={{
            width: width,
            backgroundColor: 'var(--bg-list)',
            borderRight: '1px solid var(--separator)',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Toolbar / Header */}
            <div style={{ padding: '0 8px', height: '52px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    {/* macOS-style search box would go here */}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingTop: '8px' }}>
                {filteredStories.map(story => {
                    const isSelected = selectedStoryId === story.id;
                    return (
                        <div
                            key={story.id}
                            onClick={() => setSelectedStoryId(story.id)}
                            className={`note-item ${isSelected ? 'selected' : ''}`}
                        >
                            <div className="text-list-title" style={{ fontWeight: isSelected ? 600 : 700 }}>
                                {story.title || 'New Note'}
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                                <span style={{ fontSize: '12px', color: isSelected ? 'var(--text-primary)' : 'var(--text-primary)', opacity: 0.8 }}>
                                    {formatDate(story.lastModified)}
                                </span>
                                <span className="text-list-preview" style={{ color: isSelected ? 'var(--text-secondary)' : 'var(--text-secondary)' }}>
                                    {story.content?.slice(0, 50) || 'No additional text'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
