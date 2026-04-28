import React, { createContext, useContext, useState, useCallback } from 'react';

interface AppContextType {
    refreshTrigger: number;
    triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    return (
        <AppContext.Provider value={{ refreshTrigger, triggerRefresh }}>
        {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext должен использоваться в AppProvider');
    }
    return context;
}