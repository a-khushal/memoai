export interface Message {
  id: string;
  user: string;
  text: string;
  embedding?: number[];
  response?: boolean;
  createdAt: Date;
}
