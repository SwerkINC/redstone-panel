import { create } from 'zustand';

/** Theme store */
export interface ThemeStore {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (isDark: boolean) => void;
    initTheme: () => void;
}

/** Theme store */
export const useThemeStore = create<ThemeStore>((set, get) => ({
    isDark: false,

    toggleTheme: () => {
        const newIsDark = !get().isDark;
        set({ isDark: newIsDark });

        // Update HTML class
        if (newIsDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save to localStorage
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    },

    setTheme: (isDark: boolean) => {
        set({ isDark });

        // Update HTML class
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    },

    initTheme: () => {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            const isDark = savedTheme === 'dark';
            get().setTheme(isDark);
        } else {
            // Default to light mode instead of system preference
            get().setTheme(false);
        }
    },
}));
