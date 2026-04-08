export interface MessageFromChat {
  chat: {
    id: number;
  };
  text?: string;
  from?: {
    first_name: string;
  };
}