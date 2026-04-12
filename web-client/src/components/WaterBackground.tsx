"use client";

export default function WaterBackground() {
    return (
        <div
            className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

            {/* Wave layers */}
            <svg
                className="absolute bottom-0 left-0 w-[200%] h-48 sm:h-64 md:h-80 animate-wave opacity-[0.08]"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
            >
                <path
                    fill="hsl(var(--primary))"
                    d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
            </svg>

            <svg
                className="absolute bottom-0 left-0 w-[200%] h-40 sm:h-52 md:h-64 animate-wave-reverse opacity-[0.06]"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
            >
                <path
                    fill="hsl(var(--accent))"
                    d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,144C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
            </svg>

            <svg
                className="absolute bottom-0 left-0 w-[200%] h-32 sm:h-40 md:h-48 animate-wave-slow opacity-[0.04]"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
            >
                <path
                    fill="hsl(var(--primary))"
                    d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
            </svg>

            {/* Top subtle gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-32 sm:h-48 bg-gradient-to-b from-primary/[0.03] to-transparent" />

            {/* Subtle floating bubbles effect using CSS */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/10 animate-pulse" />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-accent/10 animate-pulse delay-300" />
                <div className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-primary/10 animate-pulse delay-700" />
                <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-accent/10 animate-pulse delay-500" />
            </div>
        </div>
    );
}
