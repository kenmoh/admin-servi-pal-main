import React, { createContext, useContext, useEffect, useState } from 'react';

const FLASH_STYLE_KEY = 'flashStyle';
const FLASH_STYLE_OPTIONS = ['default', 'pulse', 'glow'] as const;

type FlashStyle = typeof FLASH_STYLE_OPTIONS[number];

interface FlashStyleContextType {
    flashStyle: FlashStyle;
    setFlashStyle: (style: FlashStyle) => void;
}

const FlashStyleContext = createContext<FlashStyleContextType | undefined>(undefined);

export const FlashStyleProvider = ({ children }: { children: React.ReactNode }) => {
    const [flashStyle, setFlashStyleState] = useState<FlashStyle>('default');

    useEffect(() => {
        const stored = localStorage.getItem(FLASH_STYLE_KEY);
        if (stored && FLASH_STYLE_OPTIONS.includes(stored as FlashStyle)) {
            setFlashStyleState(stored as FlashStyle);
        }
    }, []);

    const setFlashStyle = (style: FlashStyle) => {
        setFlashStyleState(style);
        localStorage.setItem(FLASH_STYLE_KEY, style);
    };

    return (
        <FlashStyleContext.Provider value={{ flashStyle, setFlashStyle }}>
            {children}
        </FlashStyleContext.Provider>
    );
};

export function useFlashStyle() {
    const ctx = useContext(FlashStyleContext);
    if (!ctx) throw new Error('useFlashStyle must be used within FlashStyleProvider');
    return ctx;
} 