'use client';

import React from 'react';

export default function WaterBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-gradient-to-b from-blue-100 via-white to-blue-50 dark:from-slate-950 dark:via-blue-950/40 dark:to-slate-950">
            {/* Layer 1 */}
            <div className="absolute w-full h-[56vh] bottom-0 opacity-55">
                <svg
                    className="absolute w-full h-full bottom-0 left-0"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        className="animate-wave-slow fill-sky-400/25 dark:fill-sky-700/25"
                        d="M0,160L40,170.7C80,181,160,203,240,192C320,181,400,139,480,138.7C560,139,640,181,720,192C800,203,880,181,960,165.3C1040,149,1120,139,1200,149.3C1280,160,1360,192,1400,208L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
                    ></path>
                    <path
                        className="animate-wave-fast fill-blue-500/15 dark:fill-blue-800/15"
                        d="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </svg>
            </div>

            {/* Layer 2 */}
            <div className="absolute w-full h-[42vh] bottom-0 opacity-45">
                <svg
                    className="absolute w-full h-full bottom-0 left-0"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <path
                        className="animate-wave-drift fill-cyan-300/20 dark:fill-cyan-800/20"
                        d="M0,224L60,202.7C120,181,240,139,360,122.7C480,107,600,117,720,138.7C840,160,960,192,1080,202.7C1200,213,1320,203,1380,197.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    ></path>
                </svg>
            </div>

            {/* Subtle radial glow in the center */}
            <div 
                className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[80vh] h-[80vh] rounded-full opacity-60"
                style={{ background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(59, 130, 246, 0) 72%)" }}
            ></div>
            
            <style jsx>{`
                .animate-wave-slow {
                    animation: wave 11s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite alternate;
                    transform-origin: bottom;
                    will-change: transform;
                }
                .animate-wave-fast {
                    animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite alternate-reverse;
                    transform-origin: bottom;
                    will-change: transform;
                }
                .animate-wave-drift {
                    animation: waveDrift 15s ease-in-out infinite alternate;
                    transform-origin: bottom;
                    will-change: transform;
                }
                @keyframes wave {
                    0% { transform: scaleY(1) translate3d(0, 0, 0); }
                    100% { transform: scaleY(1.18) translate3d(-36px, 0, 0); }
                }
                @keyframes waveDrift {
                    0% { transform: translate3d(0, 0, 0) scaleY(1); }
                    50% { transform: translate3d(22px, -6px, 0) scaleY(1.06); }
                    100% { transform: translate3d(-24px, 4px, 0) scaleY(1.12); }
                }
            `}</style>
        </div>
    );
}
