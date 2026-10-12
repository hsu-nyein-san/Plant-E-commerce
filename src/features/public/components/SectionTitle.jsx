import React from "react";

const SectionTitle = ({ 
  title, 
  subtitle, 
  align = "left", 
  className = "" 
}) => {
  // Alignment options
  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`${alignments[align]} ${className}`}>
      <h2 className="text-2xl font-heading font-semibold text-ink">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-ink-secondary mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;