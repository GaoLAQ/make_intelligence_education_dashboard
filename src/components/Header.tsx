import React from "react";

interface HeaderProps {
  onAddStudent: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddStudent }) => {
  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Make Intelligence Education
              </h1>
              <p className="text-sm text-gray-600">
                Student Progress Tracking & Chapter Mastery
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                Foundation & Higher
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                AQA | Edexcel | OCR
              </span>
            </div>

            <button
              onClick={onAddStudent}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Student
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
