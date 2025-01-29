import React from 'react';
import { NoteCardProps } from '../types';

const NoteCard: React.FC<NoteCardProps> = ({ title, content, createdAt, updatedAt, onEdit }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      className="border border-gray-700 rounded-md p-4 shadow-sm hover:border-gray-500 text-white cursor-pointer transition duration-75
                 w-full h-40 overflow-hidden" // Ensures uniform height and truncation
      onClick={onEdit} // Clicking the card enters edit mode
    >
      <h3 className="text-lg font-bold truncate">{title}</h3> 

      {/* Truncate content with ellipsis */}
      <div
        className="text-gray-400 mt-2 text-sm line-clamp-3 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <p className="text-xs mt-3 text-gray-500">
        {updatedAt ? `Edited: ${formatDate(updatedAt)}` : `${formatDate(createdAt)}`}
      </p>
    </div>
  );
};

export default NoteCard;
