import React, { useState, useEffect } from 'react';
import NoteCard from '../components/NoteCard';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editNote, setEditNote] = useState<Note | null>(null);

  // Function to generate a unique ID
  const generateId = () => crypto.randomUUID();

  // Load notes from localStorage when the app starts
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Add a new note
  const addNote = () => {
    if (newNote.title && newNote.content) {
      const now = new Date().toISOString();
      setNotes([
        ...notes,
        {
          id: generateId(),
          title: newNote.title,
          content: newNote.content,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      setNewNote({ title: '', content: '' }); // Clear form
    }
  };

  // Delete a note
  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Save an edited note
  const saveNote = () => {
    if (editNote) {
      setNotes(
        notes.map((note) =>
          note.id === editNote.id
            ? {
                ...note,
                title: editNote.title,
                content: editNote.content,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );
      setEditNote(null);
    }
  };

  return (
    <div className="p-8 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Notes App</h1>

      {/* Form for creating or editing a note */}
      {editNote ? (
        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            value={editNote.title}
            onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-1/3 text-gray-950"
          />
          <input
            type="text"
            value={editNote.content}
            onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-1/3 text-gray-950"
          />
          <button
            onClick={saveNote}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={() => setEditNote(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-1/3 text-gray-950"
          />
          <input
            type="text"
            placeholder="Content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="border border-gray-300 rounded-md p-2 w-1/3 text-gray-950"
          />
          <button
            onClick={addNote}
            className="bg-white text-gray-950 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Add Note
          </button>
        </div>
      )}

      {/* Notes List */}
      <div>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            title={note.title}
            content={note.content}
            createdAt={note.createdAt}
            updatedAt={note.updatedAt}
            onDelete={() => deleteNote(note.id)}
            onEdit={() => setEditNote(note)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
