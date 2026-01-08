import React, { useState } from 'react';
import { useStories } from '../contexts/StoriesContext';
import { Plus, Search, Trash2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function Sidebar({ isOpen, toggle, width }) {
    const { stories, createStory, deleteStory, setSelectedStoryId } = useStories();
    const [search, setSearch] = useState('');

    // Filter stories
    const filteredStories = stories.filter(story =>
        story.title?.toLowerCase().includes(search.toLowerCase()) ||
        story.content?.toLowerCase().includes(search.toLowerCase())
    );

    async function handleCreate() {
        try {
            const docRef = await createStory();
            setSelectedStoryId(docRef.id);
            if (window.innerWidth < 768) {
                // toggle(); // Optional: close sidebar on mobile
            }
        } catch (err) {
            alert("Failed to create: " + err.message);
        }
    }

    async function handleDelete(e, id) {
        e.stopPropagation();
        if (window.confirm("Delete this story?")) {
            deleteStory(id);
        }
    }

    return (
        <div style={{
            width: isOpen ? width : '0px',
            opacity: isOpen ? 1 : 0,
            background: 'var(--bg-sidebar)',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            borderRight: isOpen ? '1px solid var(--border-color)' : 'none',
            transition: 'width 0.3s ease, opacity 0.2s ease',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* 1. Toggle Button (Inside Sidebar at top-right or separate?) 
          User said: "on the sidebar: 1. a button to hide and show sidebar"
          I'll place it at the top left of the sidebar.
      */}
            <div style={{ padding: '16px 12px 0 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={toggle} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} title="Close Sidebar">
                    <PanelLeftClose size={20} color="var(--text-secondary)" />
                </button>
            </div>

            <div style={{ padding: '16px 12px' }}>

                {/* 2. New Story Button */}
                <button className="sidebar-btn" onClick={handleCreate} style={{ marginBottom: '8px', background: 'var(--text-primary)', color: 'white', border: 'none' }}>
                    <Plus size={16} /> New Story
                </button>

                {/* 2b. Search Button (Visualizing as input as it's more practical, user said "Search button" but implies functionality) */}
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search stories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 8px 8px 34px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'transparent',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </div>

            {/* 3. Story History */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px 12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', paddingLeft: '4px' }}>
                    Today
                </div>
                {filteredStories.map(story => (
                    <div
                        key={story.id}
                        className="story-item"
                        onClick={() => setSelectedStoryId(story.id)}
                    >
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                            {story.title || 'Untitled Story'}
                        </span>

                        {/* 4. Delete Icon (Only on Hover) */}
                        <div
                            className="delete-icon"
                            onClick={(e) => handleDelete(e, story.id)}
                            role="button"
                            title="Delete"
                        >
                            <Trash2 size={14} color="var(--text-secondary)" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
