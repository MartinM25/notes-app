import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const loadedNotes: Note[] = await window.ipc.getNotes();
      setNotes(loadedNotes);
    };
    fetchNotes();
  }, []);

  const saveNotesToFile = (updatedNotes: Note[]) => {
    window.ipc.saveNotes(updatedNotes);
    setNotes(updatedNotes);
  };

  const handleSaveNote = (title: string, content: string) => {
    if (editNote) {
      const updatedNotes = notes.map((note) =>
        note.id === editNote.id
          ? { ...note, title, content, updatedAt: new Date().toISOString() }
          : note
      );
      saveNotesToFile(updatedNotes);
      setEditNote(null);
    } else {
      const now = new Date().toISOString();
      const newNote: Note = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: now,
        updatedAt: null,
      };
      saveNotesToFile([...notes, newNote]);
    }
    setModalOpen(false);
  };

  const handleAddNote = () => {
    setEditNote(null);
    setModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditNote(note);
    setModalOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveNotesToFile(updatedNotes);
  };

  return (
    <div className="p-8 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Notes App</h1>
      <button
        onClick={handleAddNote}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600"
      >
        Add Note
      </button>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 space-x-4'>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            title={note.title}
            content={note.content}
            createdAt={note.createdAt}
            updatedAt={note.updatedAt}
            onEdit={() => handleEditNote(note)}
            onDelete={() => handleDeleteNote(note.id)}
          />
        ))}
      </div>
      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNote}
        initialTitle={editNote?.title}
        initialContent={editNote?.content}
      />
    </div>
  );
};

export default Home;
