import React from "react";
import { Link } from "react-router-dom";

const BreadCrumb = ({ currentPageTitle, links }) => {
  return (
    <div className="w-full mb-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1.5 text-[13px]">
          
          {/* Home Link */}
          <li>
            <Link
              to="/"
              className="text-gray-400 hover:text-black transition-colors"
            >
              Home
            </Link>
          </li>

          {/* Dynamic Links Array (e.g., Shop) */}
          {links &&
            links.map((link, index) => (
              <li key={index} className="flex items-center space-x-1.5">
                <span className="text-gray-300">/</span>
                <Link
                  to={link.path}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  {link.title}
                </Link>
              </li>
            ))}

          {/* Current Page Title (e.g., Indoor Plants) */}
          {currentPageTitle && (
            <li className="flex items-center space-x-1.5">
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">
                {currentPageTitle}
              </span>
            </li>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default BreadCrumb;