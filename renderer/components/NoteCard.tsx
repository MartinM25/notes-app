import React from 'react';
import { NoteCardProps } from '../types';
import Button from './Button';

const NoteCard: React.FC<NoteCardProps> = ({ title, content, createdAt, updatedAt, onDelete, onEdit }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className='border border-gray-300 rounded-md p-4 mb-4 shadow-sm text-white'>
      <h3 className='text-lg font-bold'>
        {title}
      </h3>
      <p className='text-gray-600 mt-2'>
        {content}
      </p>
      <p className="text-sm mt-4">
        {updatedAt ? `Edited: ${formatDate(updatedAt)}` : `${formatDate(createdAt)}`}
      </p>
      <Button
        size='sm'
        onClick={onDelete}
        className="mt-4 bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
      >
        Delete
      </Button>
      <Button
        size='sm'
        onClick={onEdit}
        className="mt-4 bg-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-600"
      >
        Edit
      </Button>

    </div>
  );
};

export default NoteCard;