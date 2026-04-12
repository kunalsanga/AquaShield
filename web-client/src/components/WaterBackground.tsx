'use client';

import React from 'react';

export default function WaterBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-gradient-to-b from-blue-50/50 to-background">
            {/* Animated SVG waves for that water aesthetic */}
            <div className="absolute w-full h-[50vh] bottom-0 opacity-40">
                <svg
                    className="absolute w-full h-full bottom-0 left-0"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        className="animate-wave-slow fill-sky-400/20 dark:fill-sky-800/20"
                        d="M0,160L40,170.7C80,181,160,203,240,192C320,181,400,139,480,138.7C560,139,640,181,720,192C800,203,880,181,960,165.3C1040,149,1120,139,1200,149.3C1280,160,1360,192,1400,208L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
                    ></path>
                    <path
                        className="animate-wave-fast fill-blue-500/10 dark:fill-blue-900/10"
                        d="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </svg>
            </div>
            {/* Subtle radial glow in the center */}
            <div 
                className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[80vh] h-[80vh] rounded-full opacity-50"
                style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)" }}
            ></div>
            
            <style jsx>{`
                .animate-wave-slow {
                    animation: wave 12s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite alternate;
                    transform-origin: bottom;
                    will-change: transform;
                }
                .animate-wave-fast {
                    animation: wave 8s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite alternate-reverse;
                    transform-origin: bottom;
                    will-change: transform;
                }
                @keyframes wave {
                    0% { transform: scaleY(1) translate3d(0, 0, 0); }
                    100% { transform: scaleY(1.15) translate3d(-30px, 0, 0); }
                }
            `}</style>
        </div>
    );
}
