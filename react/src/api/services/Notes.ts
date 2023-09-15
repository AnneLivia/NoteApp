import Note from '../../types/Note';
import {
  GetNotesResponse,
  NoteAttributes,
  PostNoteResponse,
} from '../../types/NotesAPI';
import client from '../client';

type RepositoryMethods = {
  getAll: (token: string) => Promise<NoteAttributes[]>;
  create: (data: Note, token: string) => Promise<NoteAttributes>;
  delete: (id: number, token: string) => void;
  update: (id: number, data: Note, token: string) => Promise<NoteAttributes>;
};

const NoteRepository = <RepositoryMethods>{
  getAll: async (token: string) => {
    const resp: GetNotesResponse = await client.get('/notes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // retornado no tipo de dados NoteAttributes[]
    return resp.data.data.map((note) => {
      return {
        id: note.id,
        ...note.attributes,
      };
    });
  },
  create: async (data: Note, token: string) => {
    const resp: PostNoteResponse = await client.post(
      '/notes',
      {
        data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return {
      id: resp.data.data.id,
      ...resp.data.data.attributes,
    };
  },
  delete: async (id: number, token: string) => {
    const resp = await client.delete(`/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return resp.data.notes;
  },
  update: async (id: number, data: Note, token: string) => {
    const resp = await client.put(
      `/notes/${id}`,
      {
        data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return {
      id: resp.data.data.id,
      ...resp.data.data.attributes,
    };
  },
};

export default NoteRepository;
