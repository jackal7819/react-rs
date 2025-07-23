interface CardProps {
  name?: string;
  description?: string;
  image?: string;
}

export const Card = ({ name, description, image }: CardProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-transparent border rounded-lg shadow">
      {image && name && (
        <img src={image} alt={name} className="w-16 h-16 rounded-full" />
      )}

      <div>
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};
