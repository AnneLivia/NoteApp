import { useQuery } from '@tanstack/react-query';
import { NoteAttributes } from '../types/NotesAPI';
import useNoteStore from '../store/useNotes';
import NoteRepository from '../api/services/Notes';
import useUserStore from '../store/useUser';

const getNotes = async () => {
  const user = useUserStore.getState().user;

  let notes: NoteAttributes[] = [];
  try {
    if (user) {
      notes = await NoteRepository.getAll(user.jwt);
    }
  } catch (error) {
    console.error(error);
  }
  return notes;
};

const useFetchNotes = () => {
  const user = useUserStore((state) => state.user);

  const setNotes = useNoteStore((state) => state.setNotes);

  return useQuery([import.meta.env.VITE_QUERY_NOTES_KEY], getNotes, {
    refetchOnWindowFocus: false,
    onSuccess: setNotes,
    enabled: !!user,
  });
};

export default useFetchNotes;
