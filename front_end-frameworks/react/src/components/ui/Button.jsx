function Button({
    children,
    variant = "primary",
    href,
    className = "",
    type = "button",
    disabled = false,
    target,
    rel, }) {
        
    const baseClasses =
        "px-4 py-2 font-semibold rounded-md";

    const variantClasses = {
        primary:
            "bg-violet-500 hover:bg-violet-600 shadow-lg shadow-violet-500/40 text-slate-50",
        secondary:
            "border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-50",
    };

    const classes =
        `${baseClasses} ${variantClasses[variant]} ${className}`;

    if (href) {
        return (
            <a href={href} target={target} rel={rel} className={classes}>
                {children}
            </a>
        );
    }

    return (
        <button type={type} disabled={disabled} className={classes}>
            {children}
        </button>
    );
}

export default Button;