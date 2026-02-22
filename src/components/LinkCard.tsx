'use client';

import React from 'react';
import { LinkItem } from '@/lib/types';

interface LinkCardProps {
    item: LinkItem;
    isEditing: boolean;
    onDelete: (id: string) => void;
}

export function LinkCard({ item, isEditing, onDelete }: LinkCardProps) {
    const [showConfirm, setShowConfirm] = React.useState(false);

    // 1. Try Base64 Icon (if saved locally)
    // 2. Try Google Favicon Service (instant fallback for default items)
    // 3. Last Resort SVG

    const googleFaviconUrl = `https://s2.googleusercontent.com/s2/favicons?domain_url=${encodeURIComponent(item.url)}&sz=64`;
    const fallbackSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzg4OCI+PHBhdGggZD0iTTEyIDJDMiA4IDIgOCAyIDEyczAgMTAgMTAgMTBzMTAgMCAxMC0xMFMxMiAyIDEyIDJ6Ii8+PC9zdmc+`;

    // We prioritize the local icon if it exists, otherwise use Google's service
    const displayIcon = item.icon || googleFaviconUrl;

    return (
        <div className="relative group">
            <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-cyan)] hover:shadow-[var(--glow-cyan)] hover:bg-[rgba(0,243,255,0.05)]"
            >
                <div className="w-8 h-8 mb-2 relative">
                    <img
                        src={displayIcon}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                            // Any error -> Fallback SVG
                            const el = e.target as HTMLImageElement;
                            if (el.src !== fallbackSvg) {
                                el.src = fallbackSvg;
                            }
                        }}
                    />
                </div>
                <span className="text-sm font-medium text-gray-200 text-center tracking-wide">{item.name}</span>
            </a>

            {isEditing && !showConfirm && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowConfirm(true);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white flex items-center justify-center shadow-md hover:bg-red-700 transition-colors z-20 cursor-pointer"
                    title="Delete link"
                >
                    &times;
                </button>
            )}

            {showConfirm && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg z-30 backdrop-blur-sm">
                    <span className="text-xs text-white mb-2 font-bold">Delete?</span>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(item.id);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition-colors"
                        >
                            Yes
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowConfirm(false);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1 rounded transition-colors"
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
