"use client";

import { MessageSquare, Plus, Trash2, History, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Assuming shadcn or similar exists, else use standard HTML button
import { useState } from 'react';

// Fallback button if ui component missing
const SidebarButton = ({ className, ...props }: any) => (
    <button
        className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
            className
        )}
        {...props}
    />
);

interface ChatHistory {
    id: string;
    title: string;
    date: Date;
}

interface ChatSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    onNewChat: () => void;
    // In a real app, you'd pass the list of histories here
}

export function ChatSidebar({ isOpen, onToggle, onNewChat }: ChatSidebarProps) {
    // Mock history for visualization
    const [history, setHistory] = useState<ChatHistory[]>([
        { id: '1', title: 'Quantum Physics Explanation', date: new Date() },
        { id: '2', title: 'React Component Debugging', date: new Date(Date.now() - 86400000) },
        { id: '3', title: 'Email Draft for Marketing', date: new Date(Date.now() - 172800000) },
    ]);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/10 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-white">
                        <History className="w-5 h-5 text-purple-400" />
                        <span>History</span>
                    </div>
                    <button
                        onClick={onToggle}
                        className="md:hidden p-1 hover:bg-white/10 rounded-lg text-gray-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">
                    <button
                        onClick={onNewChat}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Recent
                    </div>
                    {history.map((chat) => (
                        <button
                            key={chat.id}
                            className="w-full flex items-center gap-3 px-3 py-3 text-left text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                        >
                            <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:text-purple-400 transition-colors" />
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm">{chat.title}</p>
                                <p className="text-xs text-gray-600">{chat.date.toLocaleDateString()}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                            JS
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">User</p>
                            <p className="text-xs text-gray-500">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
