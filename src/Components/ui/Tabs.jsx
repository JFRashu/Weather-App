import React, { useState } from 'react';

// Tabs Component
export const Tabs = ({ children, defaultValue, className, onValueChange }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (onValueChange) onValueChange(value);
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          active: child.props.value === activeTab,
          onTabChange: handleTabChange,
        })
      )}
    </div>
  );
};

// TabsList Component
export const TabsList = ({ children, className }) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {children}
    </div>
  );
};

// TabsTrigger Component
export const TabsTrigger = ({ value, children, active, onTabChange, className }) => {
  return (
    <button
      onClick={() => onTabChange(value)}
      className={`p-2 rounded-lg transition-colors duration-300 ${
        active ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'
      } ${className}`}
    >
      {children}
    </button>
  );
};

// TabsContent Component
export const TabsContent = ({ value, children, active }) => {
  if (!active) return null;
  return <div className="mt-4">{children}</div>;
};
