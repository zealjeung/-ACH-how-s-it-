
import React from 'react';
import { GroundingChunk } from '../types';

interface SourceCardProps {
  source: GroundingChunk;
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  const { title, uri } = source.web;

  return (
    <a
      href={uri}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 hover:bg-gray-700 p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
    >
      <h3 className="text-md font-semibold text-cyan-400 truncate">{title}</h3>
      <p className="text-sm text-gray-400 mt-1 truncate">{uri}</p>
    </a>
  );
};

export default SourceCard;
