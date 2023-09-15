import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NoteAttributes } from '../types/NotesAPI';
import Note from '../types/Note';

type NoteStore = {
  notes: NoteAttributes[];
  setNotes: (AllNotes: NoteAttributes[]) => void;
  addNewNote: (attributes: NoteAttributes) => void;
  removeNote: (id: number) => void;
  updateNote: (id: number, note: Note) => void;
};

const useNoteStore = create(
  persist<NoteStore>(
    (set) => ({
      notes: [],
      setNotes: (AllNotes: NoteAttributes[]) => {
        set(() => {
          return {
            notes: AllNotes,
          };
        });
      },
      addNewNote: (attributes: NoteAttributes) => {
        set((state) => {
          return {
            notes: [attributes, ...state.notes],
          };
        });
      },
      removeNote: (id: number) => {
        set((state) => {
          return {
            notes: state.notes.filter((note) => note.id !== id),
          };
        });
      },
      updateNote: (id: number, note: Note) => {
        set((state) => {
          const noteStoreId = state.notes.findIndex((note) => note.id === id);
          const copyStore = [...state.notes];
          copyStore[noteStoreId] = {
            ...copyStore[noteStoreId],
            ...note,
          };
          return {
            notes: copyStore,
          };
        });
      },
    }),
    {
      name: 'notes-storage',
    },
  ),
);

export default useNoteStore;
