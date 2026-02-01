import React from 'react';
import './ui-message.css';

interface UIMessageProps {
  message?: string;
}

export const UIMessage: React.FC<UIMessageProps> = ({ message }) => {
  return !message ? null : <div className="ui-message">{message}</div>;
};
