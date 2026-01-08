import React, { useRef, useState, useEffect } from 'react';
import { transliterate } from '../services/transliterate';

export default function TransliteratingTextarea({ value, onChange, placeholder, style }) {
    const textareaRef = useRef(null);
    const [suggestionBox, setSuggestionBox] = useState({ visible: false, top: 0, left: 0, suggestions: [], wordStart: 0 });

    // Handle text changes (normal typing)
    const handleChange = (e) => {
        onChange(e.target.value);
    };

    const handleKeyDown = async (e) => {
        // We only care about Space or Enter to trigger transliteration
        if (e.key === ' ' || e.key === 'Enter') {
            const cursor = e.target.selectionStart;
            const text = e.target.value;

            // Find the word ending at cursor
            // Search backwards from cursor for whitespace
            let start = cursor - 1;
            while (start >= 0 && !/\s/.test(text[start])) {
                start--;
            }
            start++; // Start of the word

            const word = text.slice(start, cursor);

            // Only transliterate if it looks like an English word (Hinglish) and not already Hindi
            // Simple check: consist of latin characters
            if (word && /^[a-zA-Z]+$/.test(word)) {
                e.preventDefault(); // Prevent the space/enter momentarily

                try {
                    const suggestions = await transliterate(word);
                    const topSuggestion = suggestions[0];

                    if (topSuggestion) {
                        // Replace the word with the top suggestion
                        const newText = text.slice(0, start) + topSuggestion + text.slice(cursor) + (e.key === ' ' ? ' ' : '\n');

                        onChange(newText);

                        // Move cursor after the new word + space
                        // But we need to do this after render. React batches updates.
                        // Using requestAnimationFrame to set selection after render
                        requestAnimationFrame(() => {
                            if (textareaRef.current) {
                                const newCursorPos = start + topSuggestion.length + 1;
                                textareaRef.current.selectionStart = newCursorPos;
                                textareaRef.current.selectionEnd = newCursorPos;
                            }
                        });
                    } else {
                        // Failed, just insert the space/enter
                        const newText = text.slice(0, cursor) + (e.key === ' ' ? ' ' : '\n') + text.slice(cursor);
                        onChange(newText);
                        requestAnimationFrame(() => {
                            if (textareaRef.current) {
                                textareaRef.current.selectionStart = cursor + 1;
                                textareaRef.current.selectionEnd = cursor + 1;
                            }
                        })
                    }
                } catch (err) {
                    console.error(err);
                    // Fallback
                    const newText = text.slice(0, cursor) + (e.key === ' ' ? ' ' : '\n') + text.slice(cursor);
                    onChange(newText);
                    requestAnimationFrame(() => {
                        if (textareaRef.current) {
                            textareaRef.current.selectionStart = cursor + 1;
                            textareaRef.current.selectionEnd = cursor + 1;
                        }
                    })
                }
            }
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 200px)' }}>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    height: '100%',
                    padding: '1.5rem',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    resize: 'none',
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    outline: 'none',
                    fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif", // Ensure Hindi font support
                    ...style
                }}
            />
            {/* 
         TODO: Add custom suggestion dropdown here using caret coordinates library 
         For now, we just auto-replace with the top suggestion which is the most common behavior 
      */}
        </div>
    );
}
