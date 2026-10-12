import React from "react";

const Button = ({ 
  text = "Click Me", 
  variant = "primary", 
  onClick, 
  className = "" 
}) => {
  // Base styles applied to all buttons
  const baseStyles = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer";

  // Variant styles using your Tailwind brand colors
  const variants = {
    primary: "bg-brand text-sm text-nowrap text-white hover:bg-brand-hover",
    secondary: "bg-transparent text-nowrap text-sm border border-border text-brand hover:bg-surface-hover",
    dark: "bg-black text-white  text-nowrap text-sm border border-border text-brand hover:bg-surface-hover",
    secondaryDark: "bg-transparent text-black text-nowrap text-sm border border-border  hover:bg-surface-hover",
    
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;