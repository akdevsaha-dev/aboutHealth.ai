"use client";

import { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { PanelRightOpen } from "lucide-react";
import { ChatNav } from "./chat-navbar";


export function Chat() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const placeholders = [
        "What are the symptoms of diabetes?",
        "How does AI help in early cancer detection?",
        "What is personalized medicine in healthcare?",
        "Calculate my BMI",
        "How can AI predict heart diseases?"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submitted");
    };
    return (
        <div className="flex h-screen bg-black">
            {/* Sidebar */}
            <div
                className={`bg-[#121111] z-20 text-white transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-16"
                    }`}
            >
                <button
                    className="p-4 focus:outline-none"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <PanelRightOpen />
                </button>

                {/* Sidebar Content */}
                {isSidebarOpen && (
                    <div className="p-4">
                        <p>Menu Item 1</p>
                        <p>Menu Item 2</p>
                        <p>Menu Item 3</p>
                        <p className="">now check</p>
                    </div>
                )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-black">
                <div className="w-full">
                    <ChatNav/>
                </div>
                {/* Example Chat Bubble */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Chat bubbles or messages will go here */}
                </div>

                {/* Input */}
                <div className="border-gray-800 p-4 bg-black">
                    <PlaceholdersAndVanishInput
                        placeholders={placeholders}
                        onChange={handleChange}
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        </div >
    );
}
