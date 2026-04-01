export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-10 h-10 border-[3px]',
        lg: 'w-12 h-12 border-[3px]',
    };

    return (
        <div className="surface-card flex flex-col items-center justify-center py-16">
            <div
                className={`${sizeClasses[size]} rounded-full border-indigo-100 border-t-indigo-600 animate-spin`}
                role="status"
                aria-label={text}
            />
            {text && <p className="mt-4 text-sm font-medium text-slate-600">{text}</p>}
        </div>
    );
}

// Made with Bob
