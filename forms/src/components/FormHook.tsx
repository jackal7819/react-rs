import { useForm } from 'react-hook-form';
import { useFormStore } from '../store/useFormStore';

interface FormValues {
	name: string;
	age: number;
	email: string;
}

const FormHook: React.FC<{ onClose: () => void }> = ({ onClose }) => {
	const { addData } = useFormStore();
	const { register, handleSubmit } = useForm<FormValues>();

	const onSubmit = (data: FormValues) => {
		addData(data);
		onClose();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
			<input {...register('name')} placeholder='Name' className='p-2 border rounded' />
			<input
				{...register('age')}
				type='number'
				placeholder='Age'
				className='p-2 border rounded'
			/>
			<input
				{...register('email')}
				type='email'
				placeholder='Email'
				className='p-2 border rounded'
			/>
			<button type='submit' className='py-2 text-white bg-green-500 rounded'>
				Submit
			</button>
		</form>
	);
};

export default FormHook;
