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
		<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
			<input ref={nameRef} placeholder='Name' className='p-2 border rounded' />
			<input ref={ageRef} type='number' placeholder='Age' className='p-2 border rounded' />
			<input ref={emailRef} type='email' placeholder='Email' className='p-2 border rounded' />
			<button type='submit' className='py-2 text-white bg-blue-500 rounded'>
				Submit
			</button>
		</form>
	);
};

export default FormUncontrolled;
