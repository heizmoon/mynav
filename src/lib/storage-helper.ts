import { CategoryData, DEFAULT_DATA } from './types';

const STORAGE_KEY = 'mynav_data_v2';

export const loadLinksFromStorage = (): CategoryData[] => {
    if (typeof window === 'undefined') return DEFAULT_DATA;

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_DATA;
        return JSON.parse(raw);
    } catch (err) {
        console.error('Failed to load links', err);
        return DEFAULT_DATA;
    }
};

export const saveLinksToStorage = (data: CategoryData[]) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
        console.error('Failed to save links', err);
    }
};

export const exportDataToJson = (data: CategoryData[]) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `mynav-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};
