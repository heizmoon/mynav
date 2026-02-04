'use client';

import React, { useState } from 'react';
import { CategoryData, LinkItem } from '@/lib/types';

interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (category: string, item: LinkItem) => void;
    categories: CategoryData[];
}

export function AddLinkModal({ isOpen, onClose, onAdd, categories }: AddLinkModalProps) {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [selectedCat, setSelectedCat] = useState(categories[0]?.id || '');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Fetch icon from our API
            const res = await fetch(`/api/icon?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            const icon = data.icon || undefined;

            // 2. Create item
            const newItem: LinkItem = {
                id: crypto.randomUUID(),
                name: name || new URL(url).hostname,
                url,
                icon
            };

            onAdd(selectedCat, newItem);
            // Reset
            setUrl('');
            setName('');
            onClose();
        } catch (err) {
            console.error('Failed to add link', err);
            // Still add even if icon fails
            const newItem: LinkItem = {
                id: crypto.randomUUID(),
                name: name || url,
                url,
            };
            onAdd(selectedCat, newItem);
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
                        </select>
                    </div>

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
