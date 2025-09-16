import clsx from "clsx";

interface PrimaryButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    className?: string;
    disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    children,
    onClick,
    variant = "primary",
    size = "md",
    className,
    disabled = false,
}) => {
    const variants = {
        primary: "bg-accent hover:bg-accent-hover text-black",
        secondary: "bg-surface-3 hover:bg-surface-4 text-secondary",
        outline: "border border-accent text-accent bg-transparent hover:bg-accent/10",
    };

    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;