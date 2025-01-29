import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import Button from '../components/Button';
import { PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import 'quill/dist/quill.snow.css';
import NoteCard from '../components/NoteCard';

let Quill: any;

const Home: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstance = useRef<any>(null);
  const [isQuillReady, setIsQuillReady] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    window.ipc.getNotes().then((fetchedNotes) => {
      setNotes(fetchedNotes);
    });
  }, []);


  useEffect(() => {
    const loadQuill = async () => {
      if (!Quill) {
        const QuillModule = await import('quill');
        Quill = QuillModule.default;
      }
      setIsQuillReady(true);
    };

    if (modalOpen) {
      loadQuill();
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, [modalOpen]);

  useEffect(() => {
    if (isQuillReady && modalOpen && quillRef.current) {
      // Initialize Quill editor if not already initialized
      if (!quillInstance.current) {
        quillInstance.current = new Quill(quillRef.current, {
          theme: 'snow',
          placeholder: '',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['clean'],
            ],
          },
        });

        // If editing, set the initial content in the editor
        if (editNote && editNote.content) {
          quillInstance.current.root.innerHTML = editNote.content;
          setTitle(editNote.title);
        }
      }
    }
  }, [isQuillReady, modalOpen, editNote]);

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
    setTitle('');
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

  const handleSave = () => {
    const content = quillInstance.current?.root.innerHTML || '';
    const currentTitle = title.trim();
    if (currentTitle && content.trim()) {
      handleSaveNote(currentTitle, content);
    }
  };

  const isSaveDisabled = !title.trim() || !quillInstance.current || !quillInstance.current.root.innerHTML.trim();

  // Filter notes based on the search term
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen text-white flex flex-col">
      {/* Top Bar: Heading, Search Bar, and New Note Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">TakeNote</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="p-2 border rounded-md"
          />
          <Button
            size="md"
            onClick={handleAddNote}
            className="text-white px-2 py-2 border rounded-full"
          >
            <PlusIcon className="size-5 pr-2" /> Note
          </Button>
        </div>
      </div>

      {/* Main Content: Two-Column Layout */}
      <div className="flex flex-col md:flex-row">
        {/* Left Side: Notes List */}
        <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
          {/* No Notes Message or Notes List */}
          {filteredNotes.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              Create your first note. Click on + Note to get started.
            </div>
          ) : (
            <div className="space-y-4">
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

        {/* Right Side: Editor */}
        <div className="w-full md:w-2/3 lg:w-3/4 pl-8">
          {modalOpen && (
            <div className='h-full'>
              <h2 className="text-2xl mb-4">{editNote ? 'Edit Note' : 'Create Note'}</h2>
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
                <Button
                  size="md"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white"
                >
                  <XMarkIcon className="size-5" />
                </Button>
                <Button
                  size="md"
                  onClick={handleSave}
                  disabled={isSaveDisabled}
                  className={`${isSaveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                    } text-white`}
                >
                  <CheckIcon className="size-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
