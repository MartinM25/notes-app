import React from 'react';
import { NoteCardProps } from '../types';
import Button from './Button';

const NoteCard: React.FC<NoteCardProps> = ({ title, content, createdAt, updatedAt, onDelete, onEdit }) => {
  return (
    <div className='border border-gray-300 rounded-md p-4 mb-4 shadow-sm'>
      <h3 className='text-lg font-bold text-gray-800'>
        {title}
      </h3>
      <p className='text-gray-600 mt-2'>
        {content}
      </p>
      <p className="text-gray-500 text-sm mt-4">Created: {new Date(createdAt).toLocaleString()}</p>
      <p className="text-gray-500 text-sm">Updated: {new Date(updatedAt).toLocaleString()}</p>
      <Button
        onClick={onDelete}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Delete
      </Button>
      <Button
        onClick={onEdit}
        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md"
      >
        Edit
      </Button>

    </div>
  );
};

export default NoteCard;