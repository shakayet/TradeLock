export type ISendEmail = {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    path?: string;
    content?: string | Buffer;
    cid?: string;
  }[];
};
