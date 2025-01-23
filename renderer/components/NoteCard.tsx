import React from 'react';

type NoteCardProps = {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  onEdit: () => void;
  onDelete: () => void;
};

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
      <button
        onClick={onDelete}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Delete
      </button>
      <button
        onClick={onEdit}
        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
      >
        Edit
      </button>

    </div>
  );
};

export default NoteCard;