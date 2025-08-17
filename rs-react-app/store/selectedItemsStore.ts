import { create } from 'zustand';

interface Item {
	id: number;
	name: string;
	status: string;
	species: string;
	gender: string;
}

interface SelectedItemsState {
	selectedItems: Item[];
	toggleItem: (item: Item) => void;
	unselectAll: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
	selectedItems: [],

	toggleItem: (item) =>
		set((state) => {
			const exists = state.selectedItems.find((i) => i.id === item.id);
			return exists
				? { selectedItems: state.selectedItems.filter((i) => i.id !== item.id) }
				: { selectedItems: [...state.selectedItems, item] };
		}),

	unselectAll: () => set({ selectedItems: [] }),
}));
