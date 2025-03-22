"use client";
import axios from "axios";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { PanelRightOpen } from "lucide-react";
import { ChatNav } from "./chat-navbar";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';

export function Chat() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const placeholders = [
        "What are the symptoms of diabetes?",
        "How does AI help in early cancer detection?",
        "What is personalized medicine in healthcare?",
        "Calculate my BMI",
        "How can AI predict heart diseases?",
    ];

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        setLoading(true);
        try {
            const response = await axios.post("/api/v1/response/genai", {
                prompt: input,
            });

            const { responseText } = response.data as { responseText: string };
            setMessages((prev) => [...prev, { sender: "ai", text: responseText }]);
            setInput("");
        } catch (err) {
            console.error("Error fetching response:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-black">
            {/* Sidebar */}
            <div className={`bg-[#121111] z-20 text-white transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-16"}`}>
                <button className="p-4 focus:outline-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <PanelRightOpen />
                </button>
                {isSidebarOpen && (
                    <div className="p-4">
                        <p>Menu Item 1</p>
                        <p>Menu Item 2</p>
                        <p>Menu Item 3</p>
                    </div>
                )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-black scroll-smooth">
                <ChatNav />
                <div className="flex-1 p-6 overflow-y-auto flex justify-center">
                    <div className="w-[50%] space-y-6">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat ${msg.sender === "user" ? "chat-end" : "chat-start"}`}>
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full">
                                        <Image
                                            width={40}
                                            height={40}
                                            alt="avatar"
                                            src={
                                                msg.sender === "user"
                                                    ? "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                                    : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="chat-header">
                                    {msg.sender === "user" ? "You" : "Gemini AI"}
                                </div>
                                <div className="chat-bubble">
                                    {msg.sender === 'user' ? (
                                        msg.text
                                    ) : (
                                        <div className="prose prose-invert max-w-none">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="chat chat-start">
                                <div className="chat-header">Gemini AI</div>
                                <div className="chat-bubble">Thinking...</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Input */}
                <div className="border-gray-800 p-4 bg-black">
                    <PlaceholdersAndVanishInput
                        placeholders={placeholders}
                        onChange={(e) => setInput(e.target.value)}
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        </div>
    );
}