import React from 'react';
import { Folder, ChevronDown, Plus } from 'lucide-react';

export default function Navigation({ width }) {
    return (
        <div className="flex-col" style={{
            width: width,
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--separator)',
            height: '100vh',
            paddingTop: '38px' // Space for window controls if native, otherwise padding
        }}>

            {/* Example Section */}
            <div style={{ padding: '0 16px 8px 16px', marginTop: '10px' }}>
                <div className="text-sidebar-header" style={{ marginBottom: '4px' }}>iCloud</div>
            </div>

            <div className="sidebar-item active">
                <Folder size={16} style={{ marginRight: '8px', color: 'var(--accent-yellow)' }} />
                <span>All Stories</span>
            </div>

            <div className="sidebar-item">
                <Folder size={16} style={{ marginRight: '8px', color: 'var(--text-secondary)' }} />
                <span>Personal</span>
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>2</span>
            </div>

            <div style={{ marginTop: 'auto', padding: '12px' }}>
                {/* Bottom actions if needed */}
            </div>
        </div>
    );
}
