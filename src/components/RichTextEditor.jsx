import React, { useRef, useState, useEffect } from 'react';
import { transliterate } from '../services/transliterate';
import { useTransliteration } from '../contexts/TransliterationContext';

export default function RichTextEditor({ value, onChange, placeholder, style }) {
    const editorRef = useRef(null);
    const [toolbar, setToolbar] = useState({ visible: false, top: 0, left: 0 });
    const { isEnabled } = useTransliteration();

    // Initialize content
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            // Only update if significantly different to avoid cursor jumping
            if (!editorRef.current.innerHTML || (value && editorRef.current.innerText.trim() === '')) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [value]);

    // Handle Text Selection for Floating Toolbar
    const handleSelect = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            // Show toolbar above selection
            setToolbar({
                visible: true,
                top: rect.top - 40,
                left: rect.left
            });
        } else {
            setToolbar({ ...toolbar, visible: false });
        }
    };

    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
        handleChange(); // Update state
        setToolbar({ ...toolbar, visible: false });
    };

    const handleChange = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleKeyDown = async (e) => {
        // Transliteration Trigger (Space)
        if (e.key === ' ' || e.key === 'Enter') {
            if (!isEnabled) return; // Skip if disabled

            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const node = range.startContainer;

            // If we are in a text node
            if (node.nodeType === 3) {
                const text = node.textContent;
                const cursor = range.startOffset;

                // Find word back from cursor
                let start = cursor - 1;
                while (start >= 0 && !/\s/.test(text[start])) {
                    start--;
                }
                start++;

                const word = text.slice(start, cursor);

                if (word && /^[a-zA-Z]+$/.test(word)) {
                    e.preventDefault(); // Stop space/enter

                    try {
                        const suggestions = await transliterate(word);
                        const replacement = suggestions[0] || word;

                        // Replace text in the node
                        const before = text.slice(0, start);
                        const after = text.slice(cursor);
                        const newText = before + replacement + (e.key === ' ' ? ' ' : '\u00A0'); // Use nbsp for space to ensure renders

                        node.textContent = newText;

                        // Restore cursor
                        const newCursorPos = start + replacement.length + 1;
                        const newRange = document.createRange();
                        newRange.setStart(node, Math.min(newCursorPos, newText.length));
                        newRange.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(newRange);

                        handleChange();
                    } catch (err) {
                        console.error(err);
                        // Fallback: let event proceed
                    }
                }
            }
        }
    };

    return (
        <>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleChange}
                onSelect={handleSelect} // Note: onSelect doesn't bubble well on divs in React, usually managed by mouseUp/keyUp
                onMouseUp={handleSelect}
                onKeyUp={handleSelect}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning
                placeholder={placeholder}
                style={{
                    width: '100%',
                    outline: 'none',
                    minHeight: '300px',
                    ...style
                }}
            />

            {toolbar.visible && (
                <div className="floating-toolbar" style={{ top: toolbar.top, left: toolbar.left }}>
                    <button onClick={() => execCmd('hiliteColor', '#FFF9C4')} title="Highlight" style={{ background: '#FFF9C4', color: 'black' }}>A</button>
                    <button onClick={() => execCmd('foreColor', '#EF4444')} title="Red Text" style={{ color: '#EF4444' }}>A</button>
                    <button onClick={() => execCmd('foreColor', '#3B82F6')} title="Blue Text" style={{ color: '#3B82F6' }}>A</button>
                    <button onClick={() => execCmd('bold')} title="Bold"><strong>B</strong></button>
                </div>
            )}
        </>
    );
}
