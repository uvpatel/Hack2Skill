'use client';

import { useState } from 'react';
import { Loader2, Zap, Send } from 'lucide-react';

export default function GroqPage() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setResponse('');

        try {
            const res = await fetch('/api/groq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            if (data.result) {
                setResponse(data.result);
            } else if (data.error) {
                setResponse(`Error: ${data.error}`);
            } else {
                setResponse('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setResponse('Failed to generate response.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-3xl space-y-8">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
                        <Zap className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-gray-300 font-medium">Powered by Groq</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                        Lightning Fast AI
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Experience the incredible speed of Groq LPU™.
                        Instant responses for your ideas and code.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <div className="space-y-4">
                        {response && (
                            <div className="bg-black/40 rounded-xl p-6 border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="prose prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap leading-relaxed text-gray-200">
                                        {response}
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ask me anything..."
                                className="w-full bg-black/20 border-white/10 border rounded-xl p-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent resize-none h-32 transition-all duration-300 backdrop-blur-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !prompt.trim()}
                                className="absolute bottom-4 right-4 p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
