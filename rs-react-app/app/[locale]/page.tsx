import { Suspense } from 'react';
import Loader from '@/components/Loader';
import HomeInner from '@/components/HomeInner';

export default function Home() {
	return (
		<Suspense
			fallback={
				<div className='flex items-center justify-center w-full h-screen'>
					<Loader />
				</div>
			}
		>
			<HomeInner />
		</Suspense>
	);
}
