import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import Button from './Button';
import { CheckIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import 'quill/dist/quill.snow.css';
import ConfirmDeleteModal from './ConfirmDeleteModal'; // Import the ConfirmDeleteModal

let Quill: any;

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(note?.title || '');
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<any>(null);
  const [isQuillReady, setIsQuillReady] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for managing modal visibility

  useEffect(() => {
    setTitle(note?.title || ''); // Update title when switching notes
  }, [note]);

  useEffect(() => {
    const loadQuill = async () => {
      if (!Quill) {
        const QuillModule = await import('quill');
        Quill = QuillModule.default;
      }
      setIsQuillReady(true);
    };
    loadQuill();
  }, []);

  useEffect(() => {
    if (isQuillReady && quillRef.current) {
      if (!quillInstance.current) {
        quillInstance.current = new Quill(quillRef.current, {
          theme: 'snow',
          placeholder: 'Write something...',
          modules: {
            toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
          },
        });
      }
      // Set content when switching notes
      if (note?.content) {
        quillInstance.current.root.innerHTML = note.content;
      } else {
        quillInstance.current.root.innerHTML = '';
      }
    }
  }, [isQuillReady, note]);

  const handleSave = () => {
    const content = quillInstance.current?.root.innerHTML || '';
    if (title.trim() && content.trim()) {
      onSave(title.trim(), content.trim());
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setIsDeleteModalOpen(false); // Close modal after deletion
  };

  return (
    <div className="h-[200px]">
      <h2 className="text-2xl mb-4">{note ? 'Edit Note' : 'Create Note'}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-950"
      />
      {isQuillReady ? (
        <div ref={quillRef} className="h-screen"></div>
      ) : (
        <div className="flex items-center justify-center h-96 border border-gray-300 rounded-md p-2 bg-gray-100">
          <span className="text-gray-500">Loading editor...</span>
        </div>
      )}
      <div className="mt-4 flex justify-end space-x-4">
        {note && onDelete && (
          <Button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <TrashIcon className="w-5 h-5" />
            Delete
          </Button>
        )}
        <Button onClick={onCancel} className="bg-red text-white px-4 py-2 rounded-md">
          <XMarkIcon className="w-5 h-5" />
        </Button>
        <Button onClick={handleSave} disabled={!title.trim() || !quillInstance.current?.root.innerHTML.trim()} className="bg-green text-white px-4 py-2 rounded-md">
          <CheckIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Render the confirmation modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default NoteEditor;
