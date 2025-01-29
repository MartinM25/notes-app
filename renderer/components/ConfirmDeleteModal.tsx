import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import Button from './Button'; // Assuming you have a Button component
import { TrashIcon } from '@heroicons/react/24/outline';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto backdrop-blur-xl">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Confirm Deletion
            </DialogTitle>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-between">
              <Button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                Cancel
              </Button>
              <Button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
                <TrashIcon className="w-5 h-5" />
                Delete
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
