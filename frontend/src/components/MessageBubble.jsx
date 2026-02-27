import React from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';

const MessageBubble = ({ message, isBot, timestamp }) => {
  return (
    <div className={`flex w-full mt-4 space-x-3 max-w-2xl ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-black flex items-center justify-center">
          <FaRobot className="text-white text-sm" />
        </div>
      )}
      
      <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div 
          className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm ${
            isBot 
              ? 'bg-white text-gray-800 rounded-tl-sm border border-gray-100' 
              : 'bg-black text-white rounded-tr-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">
          {timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
          <FaUser className="text-gray-600 text-sm" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
