import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import 'quill/dist/quill.snow.css';

let Quill: any; // Declare Quill without importing it directly

type NoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  initialTitle?: string;
  initialContent?: string;
};

const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTitle = '',
  initialContent = '',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [isQuillReady, setIsQuillReady] = useState(false); // Track Quill initialization
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadQuill = async () => {
      if (!Quill) {
        const QuillModule = await import('quill');
        Quill = QuillModule.default;
      }
      setIsQuillReady(true); // Mark Quill as ready once loaded
    };

    if (isOpen) {
      loadQuill();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isQuillReady && isOpen && quillRef.current) {
      // Initialize Quill editor
      quillInstanceRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: 'Content',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // Formatting buttons
            [{ header: 1 }, { header: 2 }], // Header styles
            [{ list: 'ordered' }, { list: 'bullet' }], // Lists
            ['link', 'image'], // Link and image insertion
            ['clean'], // Remove formatting
          ],
        },
      });

      // Set the initial content in the editor
      if (initialContent) {
        quillInstanceRef.current.root.innerHTML = initialContent;
      }
    }

    return () => {
      // Clean up Quill instance when the modal closes
      if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
      }
    };
  }, [isQuillReady, isOpen, initialContent]);

  const handleSave = () => {
    const content = quillInstanceRef.current?.root.innerHTML || '';
    if (title.trim() && content.trim()) {
      onSave(title, content);
      onClose();
    }
  };

  const isSaveDisabled = title.trim() === ''; // Disable Save if title is empty

  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-10 focus:outline-none border-gray-500" onClose={onClose}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all bg-white">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {initialTitle ? 'Edit Note' : 'Add Note'}
                </DialogTitle>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full mb-4 text-gray-950"
                  />
                  {isQuillReady ? (
                    <div
                      ref={quillRef}
                      className="border border-gray-300 rounded-md p-2 w-full h-48 bg-white text-gray-950"
                    ></div>
                  ) : (
                    <div className="flex items-center justify-center h-48 border border-gray-300 rounded-md p-2 bg-gray-100">
                      <span className="text-gray-500">Loading editor...</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    size="md"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                    onClick={onClose}
                  >
                    <XMarkIcon className="size-6" />
                  </Button>
                  <Button
                    size="md"
                    className={`inline-flex justify-center rounded-md border border-transparent ${
                      isSaveDisabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } px-4 py-2 text-sm font-medium text-white`}
                    onClick={handleSave}
                    disabled={isSaveDisabled} // Disable the button if title is empty
                  >
                    <CheckIcon className="size-6" />
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NoteModal;
