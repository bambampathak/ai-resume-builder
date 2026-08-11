import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Trash2, Bot, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const SUGGESTIONS = [
    "How can I improve my resume summary?",
    "What skills should I add for a Full Stack Developer role?",
    "Give me tips for a technical interview",
    "How do I explain a career gap?",
    "Suggest projects for a CSE student portfolio",
    "How to negotiate salary for my first job?",
];

export default function AIChat() {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);
    const abortRef = useRef(null);

    // Load chat history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("aiChatHistory");
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch {
                // ignore parse errors
            }
        }
    }, []);

    // Persist chat history
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("aiChatHistory", JSON.stringify(messages.slice(-50)));
        }
    }, [messages]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text) => {
        const message = (text || input).trim();
        if (!message || isStreaming) return;

        const userMessage = { role: "user", content: message };
        const assistantMessage = { role: "assistant", content: "" };
        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        setInput("");
        setIsStreaming(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message,
                    history: messages.map((m) => ({ role: m.role, content: m.content })),
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "Chat request failed");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            abortRef.current = reader;
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith("data:")) continue;
                    const data = trimmed.slice(5).trim();
                    if (data === "[DONE]") continue;
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            setMessages((prev) => {
                                const updated = [...prev];
                                updated[updated.length - 1] = {
                                    ...updated[updated.length - 1],
                                    content: updated[updated.length - 1].content + parsed.content,
                                };
                                return updated;
                            });
                        }
                    } catch {
                        // ignore partial JSON
                    }
                }
            }
        } catch (error) {
            setMessages((prev) => {
                const updated = [...prev];
                if (updated.length > 0 && updated[updated.length - 1].role === "assistant") {
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        content:
                            updated[updated.length - 1].content ||
                            `⚠️ ${error.message || "Failed to get response. Please try again."}`,
                    };
                }
                return updated;
            });
            toast.error(error.message || "Chat failed");
        } finally {
            setIsStreaming(false);
            abortRef.current = null;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        localStorage.removeItem("aiChatHistory");
        toast.success("Chat cleared");
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex items-center justify-between px-1 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <Link
                        to="/dashboard"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">{t("ai.chat") || "AI Career Chat"}</h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isStreaming ? "Typing..." : "Online • Ready to help"}
                        </p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={clearChat}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                        title="Clear chat"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4"
                        >
                            <Bot className="w-10 h-10 text-white" />
                        </motion.div>
                        <h2 className="text-xl font-bold mb-2">AI Career Advisor</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                            Ask me anything about resumes, interviews, career advice, or skill
                            development. I'm here to help you land your dream job!
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                            {SUGGESTIONS.map((suggestion, i) => (
                                <motion.button
                                    key={suggestion}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => sendMessage(suggestion)}
                                    className="card text-left text-sm hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
                                >
                                    {suggestion}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user"
                                            ? "bg-primary-600 text-white rounded-tr-sm"
                                            : "bg-gray-100 dark:bg-gray-800 rounded-tl-sm"
                                        }`}
                                >
                                    {msg.role === "assistant" ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                            <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                </div>
                                {msg.role === "user" && (
                                    <div className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-end gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about resumes, interviews, career advice..."
                        rows={1}
                        className="input flex-1 resize-none max-h-32"
                        disabled={isStreaming}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isStreaming}
                        className="btn-primary !p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-2 text-center">
                    AI can make mistakes. Verify important information.
                </p>
            </div>
        </div>
    );
}
