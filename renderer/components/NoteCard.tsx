import React from 'react';

type NoteCardProps = {
  title: string;
  content: string;
};

const NoteCard: React.FC<NoteCardProps> = ({ title, content}) => {
  return (
    <div className='border border-gray-300 rounded-md p-4 mb-4 shadow-sm'>
      <h3 className='text-lg font-bold text-gray-800'>
        {title}
      </h3>
      <p className='text-gray-600 mt-2'>
        {content}
      </p>
    </div>
  )
}

export default NoteCard;