'use client';

import React, { useEffect, useState } from 'react';
import { CategoryData, LinkItem, DEFAULT_DATA } from '@/lib/types';
import { loadLinksFromStorage, saveLinksToStorage, exportDataToJson } from '@/lib/storage-helper';
import { LinkCard } from './LinkCard';
import { AddLinkModal } from './AddLinkModal';

export function Dashboard() {
    const [data, setData] = useState<CategoryData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchMode, setSearchMode] = useState<'google' | 'bing' | 'filter' | 'translate'>('google');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [configLoaded, setConfigLoaded] = useState(false);

    // Translation states
    const [translateResult, setTranslateResult] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);

    // Load data on mount
    useEffect(() => {
        const loaded = loadLinksFromStorage();
        setData(loaded);
        setConfigLoaded(true);
    }, []);

    // Auto-save when data changes (but not on initial empty state if loading)
    useEffect(() => {
        if (configLoaded) {
            saveLinksToStorage(data);
        }
    }, [data, configLoaded]);

    const handleAddLink = (categoryId: string, newItem: LinkItem, newCategoryTitle?: string) => {
        setData(prev => {
            if (newCategoryTitle) {
                const newCat: CategoryData = {
                    id: categoryId,
                    title: newCategoryTitle,
                    items: [newItem]
                };
                return [...prev, newCat];
            }
            return prev.map(cat => {
                if (cat.id === categoryId) {
                    return { ...cat, items: [...cat.items, newItem] };
                }
                return cat;
            });
        });
    };

    const handleDeleteLink = (itemId: string) => {
        setData(prev => {
            const newData = prev.map(cat => ({
                ...cat,
                items: cat.items.filter(item => item.id !== itemId)
            }));
            return newData.filter(cat => cat.items.length > 0);
        });
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const json = JSON.parse(event.target?.result as string);
                    if (Array.isArray(json)) {
                        setData(json);
                        alert('Config imported successfully!');
                    }
                } catch (err) {
                    alert('Failed to parse JSON');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const onSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        if (searchMode === 'google') {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
        } else if (searchMode === 'bing') {
            window.open(`https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
        } else if (searchMode === 'translate') {
            setIsTranslating(true);
            setTranslateResult('');
            try {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: searchTerm })
                });
                const data = await res.json();
                if (data.result) {
                    setTranslateResult(data.result);
                } else {
                    setTranslateResult('Translation failed or returned empty.');
                }
            } catch (err) {
                console.error(err);
                setTranslateResult('Error occurred during translation.');
            } finally {
                setIsTranslating(false);
            }
        }
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto px-5 pb-20">
            {/* Top Bar with Actions */}
            <div className="absolute top-4 right-4 flex gap-3 z-50">
                <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`px-3 py-1 text-xs rounded border ${isEditMode ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                >
                    {isEditMode ? 'Done Editing' : 'Edit Mode'}
                </button>
                <button onClick={() => exportDataToJson(data)} className="px-3 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-gray-400 hover:text-white">Export Config</button>
                <button onClick={handleImport} className="px-3 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-gray-400 hover:text-white">Import Config</button>
            </div>

            {/* Search Section */}
            <div className="w-full max-w-[600px] mx-auto mb-16 mt-10 relative z-10">
                <div className="flex gap-2 mb-3 pl-1">
                    <button
                        onClick={() => setSearchMode('google')}
                        className={`px-4 py-1 text-sm uppercase tracking-wider clip-polygon transition-all ${searchMode === 'google' ? 'bg-[var(--accent-cyan)] text-black font-bold shadow-[var(--glow-cyan)]' : 'text-gray-500 hover:text-white'}`}
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}
                    >
                        Google
                    </button>
                    <button
                        onClick={() => setSearchMode('bing')}
                        className={`px-4 py-1 text-sm uppercase tracking-wider clip-polygon transition-all ${searchMode === 'bing' ? 'bg-[var(--accent-cyan)] text-black font-bold shadow-[var(--glow-cyan)]' : 'text-gray-500 hover:text-white'}`}
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}
                    >
                        Bing
                    </button>
                    <button
                        onClick={() => {
                            setSearchMode('filter');
                            setTranslateResult('');
                        }}
                        className={`px-4 py-1 text-sm uppercase tracking-wider clip-polygon transition-all ${searchMode === 'filter' ? 'bg-[var(--accent-cyan)] text-black font-bold shadow-[var(--glow-cyan)]' : 'text-gray-500 hover:text-white'}`}
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}
                    >
                        Filter
                    </button>
                    <button
                        onClick={() => {
                            setSearchMode('translate');
                            setSearchTerm('');
                        }}
                        className={`px-4 py-1 text-sm uppercase tracking-wider clip-polygon transition-all ${searchMode === 'translate' ? 'bg-[var(--accent-cyan)] text-black font-bold shadow-[var(--glow-cyan)]' : 'text-gray-500 hover:text-white'}`}
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}
                    >
                        Translate
                    </button>
                </div>

                <form onSubmit={onSearchSubmit} className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={searchMode === 'filter' ? 'Type to filter links...' : searchMode === 'translate' ? 'Type text & press Enter to translate...' : `Search ${searchMode}...`}
                        className="w-full p-4 text-lg bg-black/50 border border-[var(--accent-cyan)] text-white rounded outline-none focus:shadow-[0_0_25px_rgba(0,243,255,0.3)] transition-shadow"
                        autoFocus
                    />
                    {searchMode === 'translate' && isTranslating && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--accent-cyan)] animate-pulse">
                            Translating...
                        </div>
                    )}
                </form>

                {/* Translate Result Box */}
                {searchMode === 'translate' && translateResult && (
                    <div className="mt-4 p-4 rounded bg-[#1a1a20] border border-[var(--accent-purple)] shadow-[var(--glow-purple)] relative overflow-hidden group transition-all animate-in fade-in slide-in-from-top-4">
                        <div className="text-xs text-[var(--accent-purple)] uppercase tracking-widest mb-2 opacity-80">Result</div>
                        <p className="text-white text-lg leading-relaxed">{translateResult}</p>

                        {/* Copy button */}
                        <button
                            onClick={() => navigator.clipboard.writeText(translateResult)}
                            className="absolute top-2 right-2 p-2 bg-black/40 rounded border border-gray-700 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)]"
                            title="Copy to clipboard"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.map(cat => {
                    // Filter logic
                    const visibleItems = searchMode === 'filter' && searchTerm
                        ? cat.items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        : cat.items;

                    if (visibleItems.length === 0 && searchMode === 'filter' && searchTerm) return null;

                    return (
                        <div key={cat.id} className="flex flex-col gap-4">
                            <h3 className="text-sm text-[var(--accent-purple)] uppercase tracking-[2px] border-b border-[#bc13fe4d] pb-1 mb-1 text-shadow-glow">
                                {cat.title}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {visibleItems.map(item => (
                                    <LinkCard
                                        key={item.id}
                                        item={item}
                                        isEditing={isEditMode}
                                        onDelete={handleDeleteLink}
                                    />
                                ))}
                                {isEditMode && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex flex-col items-center justify-center p-4 rounded-lg bg-[rgba(255,255,255,0.05)] border border-dashed border-gray-600 hover:border-gray-400 hover:bg-[rgba(255,255,255,0.1)] transition-all min-h-[100px]"
                                    >
                                        <span className="text-2xl text-gray-400">+</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <AddLinkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddLink}
                categories={data}
            />
        </div>
    );
}
