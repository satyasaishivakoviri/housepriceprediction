export function BlurFrame({ children, className = "" }) {
    return (
        <div className={`relative bg-black/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl ${className}`}>
            <div className="absolute inset-0 bg-white/5 rounded-2xl pointer-events-none" />
            {children}
        </div>
    );
}
