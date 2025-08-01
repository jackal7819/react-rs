import { describe, it, expect, beforeEach } from 'vitest';
import { useSelectedItemsStore } from '../store/selectedItemsStore';

const mockItem1 = {
  id: 1,
  name: 'Rick',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
};
const mockItem2 = {
  id: 2,
  name: 'Morty',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
};

describe('useSelectedItemsStore', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ selectedItems: [] });
  });

  it('should initialize with an empty array', () => {
    const state = useSelectedItemsStore.getState();
    expect(state.selectedItems).toEqual([]);
  });

  it('should add an item if it does not exist', () => {
    const { toggleItem } = useSelectedItemsStore.getState();
    toggleItem(mockItem1);
    expect(useSelectedItemsStore.getState().selectedItems).toEqual([mockItem1]);
  });

  it('should remove an item if it already exists', () => {
    const { toggleItem } = useSelectedItemsStore.getState();
    toggleItem(mockItem1);
    toggleItem(mockItem1);
    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });

  it('should handle multiple items correctly', () => {
    const { toggleItem } = useSelectedItemsStore.getState();
    toggleItem(mockItem1);
    toggleItem(mockItem2);
    expect(useSelectedItemsStore.getState().selectedItems).toEqual([
      mockItem1,
      mockItem2,
    ]);
  });

  it('should unselect all items', () => {
    const { toggleItem, unselectAll } = useSelectedItemsStore.getState();
    toggleItem(mockItem1);
    toggleItem(mockItem2);
    expect(useSelectedItemsStore.getState().selectedItems.length).toBe(2);

    unselectAll();
    expect(useSelectedItemsStore.getState().selectedItems).toEqual([]);
  });
});
