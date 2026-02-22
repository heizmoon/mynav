'use client';

import React, { useState } from 'react';
import { CategoryData, LinkItem } from '@/lib/types';

interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (category: string, item: LinkItem, newCategoryTitle?: string) => void;
    categories: CategoryData[];
}

export function AddLinkModal({ isOpen, onClose, onAdd, categories }: AddLinkModalProps) {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [selectedCat, setSelectedCat] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (isOpen && !selectedCat && categories.length > 0) {
            setSelectedCat(categories[0].id);
        }
    }, [isOpen, categories, selectedCat]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Fetch icon from our API
            const res = await fetch(`/api/icon?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            const icon = data.icon || undefined;

            let hostName = url;
            try {
                hostName = new URL(url).hostname;
            } catch (e) {
                // fallback to the url itself if parsing fails
            }

            // 2. Create item
            const newItem: LinkItem = {
                id: crypto.randomUUID(),
                name: name || hostName,
                url,
                icon
            };

            const isNewCat = selectedCat === 'NEW_CATEGORY';
            const catId = isNewCat ? `cat_${crypto.randomUUID()}` : selectedCat;
            const catTitle = isNewCat ? newCategoryName : undefined;

            onAdd(catId, newItem, catTitle);
            // Reset
            setUrl('');
            setName('');
            setNewCategoryName('');
            onClose();
        } catch (err) {
            console.error('Failed to add link', err);
            // Still add even if icon fails
            const newItem: LinkItem = {
                id: crypto.randomUUID(),
                name: name || url,
                url,
            };
            const isNewCat = selectedCat === 'NEW_CATEGORY';
            const catId = isNewCat ? `cat_${crypto.randomUUID()}` : selectedCat;
            const catTitle = isNewCat ? newCategoryName : undefined;

            onAdd(catId, newItem, catTitle);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1a20] border border-[var(--accent-cyan)] rounded-lg shadow-[var(--glow-cyan)] w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4 text-[var(--accent-cyan)] uppercase tracking-wider">Add New Link</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">URL</label>
                        <input
                            type="url"
                            required
                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-[var(--accent-cyan)] outline-none"
                            placeholder="https://example.com"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-[var(--accent-cyan)] outline-none"
                            placeholder="Example Site"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                        <select
                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-[var(--accent-cyan)] outline-none"
                            value={selectedCat}
                            onChange={e => setSelectedCat(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                            ))}
                            <option value="NEW_CATEGORY" className="text-[var(--accent-cyan)] font-bold">+ Create New Category...</option>
                        </select>
                    </div>

                    {selectedCat === 'NEW_CATEGORY' && (
                        <div>
                            <label className="block text-sm text-[var(--accent-cyan)] mb-1">New Category Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/50 border border-dashed border-[var(--accent-cyan)] rounded p-2 text-white focus:border-solid outline-none"
                                placeholder="e.g. Design Inspiration"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-[var(--accent-cyan)] text-black font-bold hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Add Link'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
