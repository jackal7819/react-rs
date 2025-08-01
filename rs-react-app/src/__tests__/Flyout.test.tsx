import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { Flyout } from '../components/Flyout';

vi.mock('../store/selectedItemsStore', () => ({
  useSelectedItemsStore: vi.fn(),
}));

import { useSelectedItemsStore } from '../store/selectedItemsStore';

describe('Flyout component', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should render null if no items are selected', () => {
    (
      useSelectedItemsStore as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(() => ({
      selectedItems: [],
      unselectAll: vi.fn(),
    }));

    const { container } = render(<Flyout />);
    expect(container.firstChild).toBeNull();
  });

  it('should display number of selected items', () => {
    (
      useSelectedItemsStore as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(() => ({
      selectedItems: [{ id: 1 }, { id: 2 }],
      unselectAll: vi.fn(),
    }));

    render(<Flyout />);
    expect(screen.getByText(/2 items are selected/i)).toBeInTheDocument();
  });

  it('should call unselectAll on "Unselect all" button click', () => {
    const unselectAllMock = vi.fn();
    (
      useSelectedItemsStore as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(() => ({
      selectedItems: [{ id: 1 }],
      unselectAll: unselectAllMock,
    }));

    render(<Flyout />);
    const button = screen.getByText(/unselect all/i);
    fireEvent.click(button);
    expect(unselectAllMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger CSV download on "Download" button click', () => {
    const selectedItems = [
      {
        id: 1,
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
      },
      {
        id: 2,
        name: 'Morty',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
      },
    ];

    (
      useSelectedItemsStore as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(() => ({
      selectedItems,
      unselectAll: vi.fn(),
    }));

    // ✅ Добавляем мок методов URL, если их нет
    if (!('createObjectURL' in URL)) {
      Object.defineProperty(URL, 'createObjectURL', {
        writable: true,
        value: vi.fn(),
      });
    }
    if (!('revokeObjectURL' in URL)) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        writable: true,
        value: vi.fn(),
      });
    }

    render(<Flyout />);

    const createObjectURLMock = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:url');
    const revokeObjectURLMock = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {});

    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        element.click = clickMock;
      }
      return element;
    });

    const downloadButton = screen.getByText(/download/i);
    fireEvent.click(downloadButton);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();

    createObjectURLMock.mockRestore();
    revokeObjectURLMock.mockRestore();
    vi.restoreAllMocks();
  });
});
