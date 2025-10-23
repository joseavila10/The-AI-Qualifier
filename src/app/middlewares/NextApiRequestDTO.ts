import { NextApiRequest } from 'next';

declare module 'next' {
  interface NextApiRequest {
    currentUser?: {
      id: string;
      full_name: string;
      email: string;
      created_at: Date;
    };
    platform?: string;
  }
}
