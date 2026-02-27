import React from 'react';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { id: 'pan', label: 'Apply PAN Card', icon: '💳' },
    { id: 'status', label: 'Check Application Status', icon: '🔍' },
    { id: 'aadhaar', label: 'Aadhaar Update', icon: '🆔' },
    { id: 'tax', label: 'Tax Help', icon: '📊' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4 w-full max-w-2xl">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action)}
          className="flex items-center space-x-2 bg-white border border-gray-200 hover:border-black text-gray-700 hover:text-black hover:shadow-md transition-all duration-200 text-sm px-4 py-2 rounded-full font-medium"
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
