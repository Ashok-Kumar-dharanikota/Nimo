import { create } from 'zustand';

interface DialogOptions {
  title: string;
  message?: string;
  buttons?: {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }[];
}

interface DialogState {
  isVisible: boolean;
  options: DialogOptions | null;
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  isVisible: false,
  options: null,
  showDialog: (options) => set({ isVisible: true, options }),
  hideDialog: () => set({ isVisible: false, options: null }),
}));
