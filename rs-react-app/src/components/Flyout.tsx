import { useSelectedItemsStore } from '../store/selectedItemsStore';
import { useState } from 'react';

export const Flyout = () => {
  const { selectedItems, unselectAll } = useSelectedItemsStore();
  const [csvUrl, setCsvUrl] = useState<string | null>(null);

  if (selectedItems.length === 0) return null;

  const generateCSV = () => {
    const headers = ['Name', 'Description', 'URL'];
    const rows = selectedItems.map((item) => [
      item.name,
      item.description,
      item.url,
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    setCsvUrl(url);
  };

  return (
    <div className="flex items-center gap-4">
      <p>{selectedItems.length} items are selected</p>
      <button type="button" onClick={unselectAll}>
        Unselect all
      </button>
      <button type="button" onClick={generateCSV}>
        Generate CSV
      </button>
      {csvUrl && (
        <a href={csvUrl} download={`${selectedItems.length}_items.csv`}>
          Download CSV
        </a>
      )}
    </div>
  );
};
