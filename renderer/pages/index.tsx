import React, { useState } from 'react';
import NoteCard from '../components/NoteCard';

const Home: React.FC = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Note 1', content: 'This is the first note.' },
    { id: 2, title: 'Note 2', content: 'This is the second note.' },
  ]);

  const [newNote, setNewNote] = useState({
    title: '',
    content: ''
  });

  // function for creating new note
  const addNote = () => {
    if (newNote.title && newNote.content) {
      setNotes([
        ...notes,
        {
          id: notes.length + 1,
          title: newNote.title,
          content: newNote.content,
        },
      ]);
      setNewNote({ title: '', content: '' }); // Clear form
    };
  };

  // function for deleting a note
  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  }

  return (
    <div className="p-8 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Notes App</h1>

      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="border border-gray-300 rounded-md p-2 w-1/3 text-gray-95"
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
          className="bg-white px-4 text-gray-950 py-2 rounded-md hover:bg-gray-100"
        >
          Add Note
        </button>
      </div>

      <div>
        {notes.map((note) => (
          <NoteCard 
            key={note.id} 
            title={note.title} 
            content={note.content} 
            onDelete={() => deleteNote(note.id)}  
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
