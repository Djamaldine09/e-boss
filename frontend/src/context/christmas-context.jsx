import React, { createContext, useContext, useState, useEffect } from 'react';

const ChristmasContext = createContext();

export function ChristmasProvider({ children }) {
    const [isChristmasMode, setIsChristmasMode] = useState(false);
    
    // Vérifie si on est en période de Noël par défaut
    useEffect(() => {
        const currentMonth = new Date().getMonth();
        const isDecemberOrJanuary = currentMonth === 11 || currentMonth === 0;
        if (isDecemberOrJanuary) {
            setIsChristmasMode(true);
        }
    }, []);

    // Sauvegarde dans localStorage
    useEffect(() => {
        localStorage.setItem('christmasMode', JSON.stringify(isChristmasMode));
    }, [isChristmasMode]);

    // Charge depuis localStorage
    useEffect(() => {
        const savedMode = localStorage.getItem('christmasMode');
        if (savedMode !== null) {
            setIsChristmasMode(JSON.parse(savedMode));
        }
    }, []);

    const toggleChristmasMode = () => {
        setIsChristmasMode(prev => !prev);
    };

    const enableChristmasMode = () => {
        setIsChristmasMode(true);
    };

    const disableChristmasMode = () => {
        setIsChristmasMode(false);
    };

    return (
        <ChristmasContext.Provider value={{
            isChristmasMode,
            toggleChristmasMode,
            enableChristmasMode,
            disableChristmasMode
        }}>
            {children}
        </ChristmasContext.Provider>
    );
}

export const useChristmas = () => {
    const context = useContext(ChristmasContext);
    if (!context) {
        throw new Error('useChristmas must be used within ChristmasProvider');
    }
    return context;
};