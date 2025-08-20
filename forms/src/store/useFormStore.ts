import { create } from 'zustand';

export interface FormData {
	name: string;
	age: number;
	email: string;
	gender: 'male' | 'female';
	avatar: string;
	country: string;
	acceptTnC: boolean;
}

interface FormStore {
	submittedData: FormData[];
	addData: (data: FormData) => void;
}

export const useFormStore = create<FormStore>((set) => ({
	submittedData: [],
	addData: (data) => set((state) => ({ submittedData: [...state.submittedData, data] })),
}));
