import Card from './Card';
import { Character } from '@/types';

interface CardListProps {
	data: Character[];
	onCardClick?: (id: number) => void;
}

export default function CardList({ data, onCardClick }: CardListProps) {
	if (!data.length) {
		return <p className='p-4 text-gray-500'>No results</p>;
	}

	return (
		<div className='grid gap-4 py-4'>
			{data.map((item) => (
				<div
					key={item.id}
					onClick={(e) => {
						onCardClick?.(item.id);
						e.stopPropagation();
					}}
				>
					<Card
						id={item.id}
						name={item.name}
						status={item.status}
						species={item.species}
						gender={item.gender}
						image={item.image}
					/>
				</div>
			))}
		</div>
	);
}
