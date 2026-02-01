import React from 'react';
import './ui-button.css';

interface UIButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const UIButton: React.FC<UIButtonProps> = ({ children, onClick, disabled = false  }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onClick?.();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`ui-button ${disabled ? 'ui-button--disabled' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};
