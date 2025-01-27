// Represents a Note object
export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

// Props for the NoteCard component
export type NoteCardProps = {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  onEdit: () => void;
  onDelete: () => void;
};
