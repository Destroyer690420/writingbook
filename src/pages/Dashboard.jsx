import React, { useState } from 'react';
import { StoriesProvider } from '../contexts/StoriesContext';
import Sidebar from '../components/Sidebar';
import Editor from '../components/Editor';
import { PanelLeftOpen } from 'lucide-react';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <StoriesProvider>
            <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>

                {/* Toggle Button when sidebar is closed (Absolute position top-left) */}
                {!sidebarOpen && (
                    <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 50 }}>
                        <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} title="Open Sidebar">
                            <PanelLeftOpen size={24} color="var(--text-tertiary)" />
                        </button>
                    </div>
                )}

                <Sidebar
                    isOpen={sidebarOpen}
                    toggle={() => setSidebarOpen(!sidebarOpen)}
                    width="260px"
                />

                <div style={{ flex: 1, height: '100vh', overflow: 'hidden', position: 'relative' }}>
                    {/* Pass sidebar toggle to editor if needed, or just let the absolute button handle it */}
                    <Editor />
                </div>
            </div>
        </StoriesProvider>
    );
}
