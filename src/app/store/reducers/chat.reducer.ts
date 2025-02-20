import { createReducer, on } from '@ngrx/store';
import { setMessages, addMessage } from '../actions/chat.actions';

export interface Message {
  id: number;
  room: any;
  sender: any;
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: []
};

export const chatReducer = createReducer(
  initialState,
  on(setMessages, (state, { messages }) => ({
    ...state, 
    messages: messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp).getTime(),
    }))
  })),
  on(addMessage, (state, { message }) => ({
    ...state, 
    messages: [
      ...state.messages, 
      { ...message, timestamp: new Date(message.timestamp).getTime() }
    ]
  }))
);
