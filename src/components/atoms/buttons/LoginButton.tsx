import Button, { ButtonProps } from ".";
import clsx from "clsx";

interface LoginButtonProps extends ButtonProps {
    children?: React.ReactNode;
}

const LoginButton = ({ children, ...props }: LoginButtonProps) => {

    const baseStyle = "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold";
    const colorStyle = "bg-gradient-to-r from-red-500 to-indigo-600 text-white";
    const hoverStyle = "hover:from-red-600 hover:to-indigo-700 hover:shadow-lg";
    const transitionStyle = "transition duration-200 ease-in-out";

    return (
        <Button
            className={clsx(
                baseStyle, colorStyle, hoverStyle, transitionStyle
            )}
            {...props}
        >
            {children}
        </Button>
    );
};


export default LoginButton;