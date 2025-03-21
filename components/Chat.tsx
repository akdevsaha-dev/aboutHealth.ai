"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";


export function Chat() {
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
        <div className="h-screen flex flex-col justify-center px-4">
            <h2 className="mb-10 sm:mb-20 text-xl border-2 border-amber-500 h-[90%] text-center flex justify-center items-center sm:text-5xl dark:text-white text-black">
                Ask aboutHealth AI Anything.
            </h2>
            <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
            />
        </div>
    );
}
