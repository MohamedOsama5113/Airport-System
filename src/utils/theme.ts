export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'airport-theme-mode';

function getSystemTheme(): ThemeMode {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): ThemeMode | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const rawTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return rawTheme === 'dark' || rawTheme === 'light' ? rawTheme : null;
}

export function getCurrentTheme(): ThemeMode {
    if (typeof document === 'undefined') {
        return 'light';
    }

    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function applyTheme(theme: ThemeMode): void {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = theme;

    if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
}

export function initializeTheme(): ThemeMode {
    const resolvedTheme = getStoredTheme() ?? getSystemTheme();
    applyTheme(resolvedTheme);
    return resolvedTheme;
}