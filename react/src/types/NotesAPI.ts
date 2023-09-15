export interface GetNotesResponse {
  data: {
    data: Data[];
  };
}

export interface NoteAttributes {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface PostNoteResponse {
  data: {
    data: Data;
  };
  meta: Meta;
}

export interface Data {
  id: number;
  attributes: {
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Meta {}
