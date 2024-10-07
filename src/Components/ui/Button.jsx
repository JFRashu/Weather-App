// src/components/ui/button.jsx
import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'default', ...props }) => {
  const baseStyles = 'px-4 py-2 font-semibold rounded focus:outline-none transition-all';
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    ghost: 'bg-transparent text-blue-500 hover:bg-blue-100',
  };

  const styles = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <button onClick={onClick} className={styles} {...props}>
      {children}
    </button>
  );
};

export default Button;
