import React from 'react';
import './button.css';
interface ButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    onClick,
    disabled = false,
    variant = 'primary',
    children,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className='button1'
        >
            {children}
        </button>
    );
};