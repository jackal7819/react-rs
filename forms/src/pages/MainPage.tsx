import { useState } from 'react';
import { useFormStore } from '../store/useFormStore';
import FormUncontrolled from '../components/FormUncontrolled';
import FormHook from '../components/FormHook';
import Modal from '../components/Modal';

const MainPage = () => {
	const [isUncontrolledOpen, setUncontrolledOpen] = useState(false);
	const [isHookOpen, setHookOpen] = useState(false);
	const { submittedData } = useFormStore();

	return (
		<main className='flex flex-col items-center justify-center min-h-screen p-10 text-xl bg-slate-900 text-slate-400'>
			<div className='flex justify-center gap-10 mb-8'>
				<button
					type='button'
					onClick={() => setUncontrolledOpen(true)}
					className='bg-emerald-600 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-emerald-500 duration-500 cursor-pointer w-80 justify-center'
				>
					Open Uncontrolled Form
				</button>
				<button
					type='button'
					onClick={() => setHookOpen(true)}
					className='bg-amber-600 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer w-80 justify-center'
				>
					Open Hook Form
				</button>
			</div>

			<div className='grid grid-cols-2 gap-10'>
				{submittedData.map((entry, index) => (
					<div key={index} className='flex flex-col gap-5 p-10 rounded-lg shadow-lg border-5 shadow-slate-400 border-slate-400'>
						<div>Name: {entry.name}</div>
						<div>Age: {entry.age}</div>
						<div>Email: {entry.email}</div>
					</div>
				))}
			</div>

			<Modal isOpen={isUncontrolledOpen} onClose={() => setUncontrolledOpen(false)}>
				<h2 className='mb-4 text-3xl font-bold'>Fill the form</h2>
				<FormUncontrolled onClose={() => setUncontrolledOpen(false)} />
			</Modal>

			<Modal isOpen={isHookOpen} onClose={() => setHookOpen(false)}>
				<h2 className='mb-4 text-3xl font-bold'>Fill the form</h2>
				<FormHook onClose={() => setHookOpen(false)} />
			</Modal>
		</main>
	);
};

export default MainPage;
