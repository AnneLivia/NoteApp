export interface ErrorAPI {
  data: unknown;
  error: Error;
}

export interface Error {
  status: number;
  name: string;
  message: string;
  details: Details;
}

export interface Details {}
