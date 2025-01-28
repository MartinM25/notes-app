import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import NoteCard from '../components/NoteCard';
import { PlusIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editNote, setEditNote] = useState<Note | null>(null);  // Track which note is being edited
  const [title, setTitle] = useState<string>('');  // Title of the note
  const [content, setContent] = useState<string>('');  // Content of the note
  const [isEditorVisible, setIsEditorVisible] = useState<boolean>(false);  // Control visibility of the editor

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

  const handleSaveNote = () => {
    if (editNote) {
      // Editing existing note
      const updatedNotes = notes.map((note) =>
        note.id === editNote.id
          ? { ...note, title, content, updatedAt: new Date().toISOString() }
          : note
      );
      saveNotesToFile(updatedNotes);
    } else {
      // Creating new note
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
    
    // After saving, hide the editor and reset form
    setIsEditorVisible(false);
    setTitle('');
    setContent('');
    setEditNote(null); // Reset the edit mode
  };

  const handleAddNote = () => {
    setEditNote(null);  // Ensure no note is being edited
    setTitle('');  // Clear title for new note
    setContent('');  // Clear content for new note
    setIsEditorVisible(true);  // Make editor visible
  };

  const handleEditNote = (note: Note) => {
    setEditNote(note);  // Set the note to edit
    setTitle(note.title);  // Prefill title
    setContent(note.content);  // Prefill content
    setIsEditorVisible(true);  // Make editor visible
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    saveNotesToFile(updatedNotes);
  };

  return (
    <div className="p-8 min-h-screen text-white flex flex-col md:flex-row">
      {/* Left Side: Notes List */}
      <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">TakeNote</h1>
        </div>
        <Button
          size="md"
          onClick={handleAddNote}
          className="text-white px-2 py-2 border rounded-full mb-4 w-full"
        >
          <PlusIcon className="size-5 pr-2" /> Note
        </Button>

        {/* No Notes Message or Notes List */}
        {notes.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            Create your first note. Click on + Note to get started.
          </div>
        ) : (
          <div className="space-y-4">
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
        )}
      </div>

      {/* Right Side: Editor */}
      <div className="w-full md:w-2/3 lg:w-3/4 pl-8">
        {isEditorVisible && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{editNote ? 'Edit Note' : 'Create a New Note'}</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white rounded-md"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white rounded-md h-64"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <Button onClick={handleSaveNote} className="text-white px-4 py-2 border rounded-full">
                Save
              </Button>
              <Button onClick={() => setIsEditorVisible(false)} className="text-white px-4 py-2 border rounded-full">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
