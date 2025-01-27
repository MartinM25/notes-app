import React from 'react';
import { NoteCardProps } from '../types';
import Button from './Button';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const NoteCard: React.FC<NoteCardProps> = ({ title, content, createdAt, updatedAt, onDelete, onEdit }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      className="border border-gray-700 rounded-md p-4 mb-4 shadow-sm hover:border-gray-500 text-white relative group cursor-pointer transition duration-75"
      onClick={onEdit}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-600 mt-2">{content}</p>
      <p className="text-sm mt-4">
        {updatedAt ? `Edited: ${formatDate(updatedAt)}` : `${formatDate(createdAt)}`}
      </p>

      {/* Edit and Delete buttons will appear when the card is hovered */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          onClick={onDelete}
          className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
        >
          <TrashIcon className="size-6" />
        </Button>
        <Button
          size="sm"
          onClick={onEdit}
          className="bg-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-600 mt-2"
        >
          <PencilSquareIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
};

export default NoteCard;
