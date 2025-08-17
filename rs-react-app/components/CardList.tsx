import { useTranslations } from 'next-intl'
import Card from './Card';
import { Character } from '@/types';

interface CardListProps {
	data: Character[];
	onCardClick?: (id: number) => void;
}

export default function CardList({ data, onCardClick }: CardListProps) {
	const t = useTranslations('CardList');
	
	if (data && data.length === 0) {
		return <p className='p-4 text-xl text-gray-500'>{t('no')}</p>;
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
