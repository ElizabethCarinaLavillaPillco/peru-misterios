import React from 'react';
import React, { useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';

export default function Acordeon({ titulo, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
      >
        <h3 className="font-bold text-lg text-left">{titulo}</h3>
        <IoChevronDown 
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="prose max-w-none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}