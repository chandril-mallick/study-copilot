import React from 'react';

const ToolCard = ({ tool, onClick, comingSoon = false }) => {
  const { name, icon, description, buttonText, buttonColor } = tool;

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{icon}</span>
        <h4 className="font-medium text-gray-800 dark:text-white">{name}</h4>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {description}
      </p>
      {comingSoon ? (
        <div className="bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg text-sm text-center">
          Coming Soon
        </div>
      ) : (
        <button
          onClick={onClick}
          className={`${buttonColor} text-white px-4 py-2 rounded-lg text-sm`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default ToolCard;
