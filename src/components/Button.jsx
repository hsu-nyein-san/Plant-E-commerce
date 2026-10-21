import React from "react";

const Button = ({ 
  text = "Click Me", 
  variant = "primary", 
  onClick, 
  icon: Icon,
  className = "" 
}) => {
  const baseStyles = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer";

  const variants = {
    primary: "bg-brand text-sm text-nowrap text-white hover:bg-brand-hover",
    secondary: "bg-transparent text-nowrap text-sm border border-border text-brand hover:bg-surface-hover",
    dark: "bg-black text-white  text-nowrap text-sm border border-border text-brand hover:bg-gray-600",
    secondaryDark: "bg-transparent text-black text-nowrap text-sm border border-border  hover:bg-surface-hover",
    
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <div className=" flex gap-2">
        <div className="">{Icon && <Icon size={16} />}</div>
      <div className="">{text}</div>
      </div>
    </button>
  );
};

export default Button;