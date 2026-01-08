import React, { createContext, useContext, useState } from 'react';

const TransliterationContext = createContext();

export function useTransliteration() {
    return useContext(TransliterationContext);
}

export function TransliterationProvider({ children }) {
    // Default to true as per current behavior, or load from local storage if desired
    const [isEnabled, setIsEnabled] = useState(true);

    const toggle = () => {
        setIsEnabled(prev => !prev);
    };

    const value = {
        isEnabled,
        setIsEnabled,
        toggle
    };

    return (
        <TransliterationContext.Provider value={value}>
            {children}
        </TransliterationContext.Provider>
    );
}
