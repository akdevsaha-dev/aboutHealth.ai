"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export function FloatingPaper({ count = 5 }) {
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
    const [randomPositions, setRandomPositions] = useState<{ initialX: number; initialY: number }[]>([]);

    useEffect(() => {
        // Update dimensions on client side
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        // Generate random positions ONCE after mount
        setRandomPositions(
            Array.from({ length: count }).map(() => ({
                initialX: Math.random() * window.innerWidth,
                initialY: Math.random() * window.innerHeight,
            }))
        );

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [count]);

    return (
        <div className="relative w-full h-full">
            {randomPositions.map((pos, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    initial={{
                        x: pos.initialX,
                        y: pos.initialY,
                    }}
                    animate={{
                        x: [
                            pos.initialX,
                            Math.random() * dimensions.width,
                            Math.random() * dimensions.width,
                        ],
                        y: [
                            pos.initialY,
                            Math.random() * dimensions.height,
                            Math.random() * dimensions.height,
                        ],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20 + Math.random() * 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                >
                    <div className="relative w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform">
                        <FileText className="w-8 h-8 text-purple-400/50" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}