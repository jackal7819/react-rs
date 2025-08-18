import { useRef } from 'react';
import { useFormStore } from '../store/useFormStore';

const FormUncontrolled: React.FC<{ onClose: () => void }> = ({ onClose }) => {
	const { addData } = useFormStore();
	const nameRef = useRef<HTMLInputElement>(null);
	const ageRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addData({
			name: nameRef.current?.value || '',
			age: Number(ageRef.current?.value) || 0,
			email: emailRef.current?.value || '',
		});
		onClose();
	};

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-5 text-xl'>
			<input ref={nameRef} placeholder='Name' className='p-4 border rounded-lg' />
			<input ref={ageRef} type='number' placeholder='Age' className='p-4 border rounded-lg' />
			<input
				ref={emailRef}
				type='email'
				placeholder='Email'
				className='p-4 border rounded-lg'
			/>
			<button
				type='submit'
				className='bg-emerald-600 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-emerald-500 duration-500 cursor-pointer justify-center'
			>
				Submit
			</button>
		</form>
	);
};

export default FormUncontrolled;
