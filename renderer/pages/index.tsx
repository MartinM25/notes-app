import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import Button from '../components/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import 'quill/dist/quill.snow.css';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import NoteEditor from '../components/NoteEditor';

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    window.ipc.getNotes().then(setNotes);
  }, []);

  const saveNotesToFile = (updatedNotes: Note[]) => {
    window.ipc.saveNotes(updatedNotes);
    setNotes(updatedNotes);
  };

  const handleSaveNote = (title: string, content: string) => {
    if (editNote) {
      // If editing an existing note, update it
      const updatedNotes = notes.map((note) =>
        note.id === editNote.id ? { ...note, title, content, updatedAt: new Date().toISOString() } : note
      );
      saveNotesToFile(updatedNotes);
    } else {
      // If creating a new note, add it to the list
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: title || "Untitled Note",
        content,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      const updatedNotes = [...notes, newNote];
      saveNotesToFile(updatedNotes);
    }
    setEditNote(null); // Close editor after saving
  };


  const handleEditNote = (note: Note) => {
    setEditNote(note); // Automatically switches the editor to the new note
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveNotesToFile(updatedNotes);
    setEditNote(null);
  };

  const handleNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    // Add the new note to the list immediately
    setNotes([...notes, newNote]);

    // Set the note for editing
    setEditNote(newNote);
  };


  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    // Home Component

    <div className="p-8 min-h-screen text-white flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">TakeNote</h1>
        <div className="flex space-x-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Button size="md" onClick={handleNewNote} className="text-white px-2 py-2 border rounded-full">
            <PlusIcon className="size-5 pr-2" /> Note
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row">
        {/* Notes List */}
        <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0 overflow-y-auto max-h-[calc(100vh-160px)]">
          {filteredNotes.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">Create your first note.</div>
          ) : (
            <div className="space-y-4 mr-6">
              {filteredNotes.map((note) => (
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
          )}
        </div>

        {/* Note Editor */}
        <div className="w-full md:w-2/3 lg:w-3/4 pl-8 h-[500px]">
          {editNote !== null && (
            <NoteEditor
              note={editNote}
              onSave={handleSaveNote}
              onCancel={() => setEditNote(null)}
              onDelete={() => handleDeleteNote(editNote.id)}
            />
          )}
        </div>
      </div>
    </div>

  );
};

export default Home;
