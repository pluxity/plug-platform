import React from "react";

interface ButtonProps {
    variant?: "text" | "icon" | "outlined";
    size?: "small" | "medium" | "large";
    color?: "primary" | "secondary";
    onClick?: () => void;
    children: React.ReactNode;
}

const Button = ({
    variant = "text",
    size = "medium",
    color = "primary",
    onClick,
    children,
}: ButtonProps) => {
    const baseStyle = "flex justify-center gap-2 items-center px-4 py-2 rounded font-semibold";
    const variantStyle = {
        text: "",
        icon: "bg-transparent",
        outlined: "border border-gray-300",
    }[variant];
    const sizeStyle = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
    }[size];
    const colorStyle = {
        primary: "text-white bg-blue-500",
        secondary: "text-gray-700 bg-gray-300",
    }[color];

    return (
        <button
            onClick={onClick}
            className={`${baseStyle} ${variantStyle} ${sizeStyle} ${colorStyle}`}
        >
            {children}
        </button>
    );
};

export default Button;