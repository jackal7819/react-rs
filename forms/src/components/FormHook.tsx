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
		<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 text-xl'>
			<input {...register('name')} placeholder='Name' className='p-4 border rounded-lg' />
			<input
				{...register('age')}
				type='number'
				placeholder='Age'
				className='p-4 border rounded-lg'
			/>
			<input
				{...register('email')}
				type='email'
				placeholder='Email'
				className='p-4 border rounded-lg'
			/>
			<button
				type='submit'
				className='bg-amber-600 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer justify-center'
			>
				Submit
			</button>
		</form>
	);
};

export default FormHook;
