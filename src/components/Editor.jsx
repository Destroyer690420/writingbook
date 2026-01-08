import React, { useEffect, useState, useCallback } from 'react';
import { useStories } from '../contexts/StoriesContext';
import { CheckSquare } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

function useDebounce(callback, delay) {
    const [timer, setTimer] = useState(null);
    return useCallback((...args) => {
        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
            callback(...args);
        }, delay);
        setTimer(newTimer);
    }, [callback, delay, timer]);
}

export default function Editor() {
    const { currentStory, updateStory } = useStories();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [lastSaved, setLastSaved] = useState(null);

    // Sync local state when story changes
    useEffect(() => {
        if (currentStory) {
            setTitle(currentStory.title || '');
            setContent(currentStory.content || '');
        } else {
            setTitle('');
            setContent('');
        }
    }, [currentStory?.id]);

    const debouncedUpdate = useDebounce((id, data) => {
        updateStory(id, data);
        setLastSaved(new Date());
    }, 1000);

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (currentStory) {
            debouncedUpdate(currentStory.id, { title: newTitle });
        }
    };

    const handleContentChange = (newContent) => {
        setContent(newContent);
        if (currentStory) {
            debouncedUpdate(currentStory.id, { content: newContent });
        }
    };

    if (!currentStory) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <h2>Writing Book By Gaurav</h2>
                <p>Select a story or create a new one to begin.</p>
            </div>
        );
    }

    return (
        <main style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-editor)' }}>
            {/* Top Status Bar (Minimal) */}
            <div style={{ padding: '8px 20px', display: 'flex', justifyContent: 'flex-end', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                {lastSaved ? <span>Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> : <span>Unsaved changes</span>}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '768px', padding: '0 24px 100px 24px' }}>

                    {/* 1. Story Title */}
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Story Title"
                        className="editor-title-input"
                    />

                    {/* 2. Story Writing Panel (Rich Text) */}
                    <RichTextEditor
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Start writing..."
                        style={{
                            fontSize: '16px',
                            lineHeight: '1.8',
                            color: 'var(--text-primary)',
                            whiteSpace: 'pre-wrap'
                        }}
                    />
                </div>
            </div>
        </main>
    );
}
