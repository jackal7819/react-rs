import { useSelectedItemsStore } from '../store/selectedItemsStore';

interface CardProps {
  id: number;
  name: string;
  description: string;
  image?: string;
}

export const Card = ({ id, name, description, image }: CardProps) => {
  const { selectedItems, toggleItem } = useSelectedItemsStore();
  const isSelected = selectedItems.some((i) => i.id === id);

  const handleToggle = () => {
    toggleItem({
      id,
      name,
      description,
      url: '',
    });
  };

  return (
    <div className="flex items-center gap-4 p-4 duration-500 bg-transparent border rounded-lg shadow cursor-pointer hover:bg-slate-800">
      {image && (
        <img src={image} alt={name} className="w-16 h-16 rounded-full" />
      )}

      <div>
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-sm">{description}</p>
      </div>
      <div>
        <label htmlFor={`checkbox-${id}`} className="sr-only">
          {id}
        </label>
        <input
          className="border rounded-full appearance-none cursor-pointer border-slate-400 size-5 checked:bg-amber-600 checked:border-amber-600"
          id={`checkbox-${id}`}
          type="checkbox"
          checked={isSelected}
          onChange={handleToggle}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
};
