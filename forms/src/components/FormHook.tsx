import type { FormValues } from '../types';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useFormStore } from '../store/useFormStore';
import { useCountryStore } from '../store/useCountryStore';
import { checkPasswordStrength, fileToBase64 } from '../utils/formHelpers';
import { formSchema } from '../utils/validation';

const FormHook: React.FC<{ onClose: () => void }> = ({ onClose }) => {
	const { addData } = useFormStore();
	const { countries } = useCountryStore();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		watch,
		setValue,
		trigger,
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		mode: 'onChange',
	});

	const passwordValue = watch('password', '');
	const confirmPasswordValue = watch('confirmPassword', '');
	const [passwordStrength, setPasswordStrength] = useState(() => checkPasswordStrength(''));

	useEffect(() => {
		if (confirmPasswordValue) {
			trigger('confirmPassword');
		}
	}, [passwordValue, confirmPasswordValue, trigger]);


  const onSubmit = async (data: FormValues) => {
    let avatarBase64 = '';

    if (data.avatar) {
      avatarBase64 = await fileToBase64(data.avatar);
    }

    addData({ ...data, avatar: avatarBase64 });

    onClose();
  };

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col max-w-md gap-4 mx-auto text-lg'
		>
			{/* Name */}
			<div className='flex flex-col gap-1'>
				<label htmlFor='name' className='font-medium'>
					Name *
				</label>
				{errors.name && (
					<span className='text-sm font-bold text-rose-500'>{errors.name.message}</span>
				)}
				<input
					id='name'
					{...register('name')}
					placeholder='Name'
					className='p-4 border rounded-lg'
				/>
			</div>

			<div className='flex flex-col gap-1'>
				<label htmlFor='age' className='font-medium'>
					Age *
				</label>
				{errors.age && (
					<span className='text-sm font-bold text-rose-500'>{errors.age.message}</span>
				)}
				<input
					id='age'
					{...register('age', { valueAsNumber: true })}
					type='number'
					placeholder='Age'
					className='p-4 border rounded-lg'
				/>
			</div>

			<div className='flex flex-col gap-1'>
				<label htmlFor='email' className='font-medium'>
					Email *
				</label>
				{errors.email && (
					<span className='text-sm font-bold text-rose-500'>{errors.email.message}</span>
				)}
				<input
					id='email'
					{...register('email')}
					type='email'
					placeholder='Email'
					className='p-4 border rounded-lg'
				/>
			</div>

			<div className='flex flex-col gap-1'>
				<label htmlFor='password' className='font-medium'>
					Password *
				</label>
				{errors.password && (
					<span className='text-sm font-bold text-rose-500'>
						{errors.password.message}
					</span>
				)}
				<input
					id='password'
					{...register('password', {
						onChange: (e) => setPasswordStrength(checkPasswordStrength(e.target.value)),
					})}
					type='password'
					placeholder='Password'
					className='p-4 border rounded-lg'
				/>

				{passwordValue && (
					<div className='text-sm font-bold'>
						<div className='flex gap-1 mb-1'>
							{[1, 2, 3, 4].map((level) => (
								<div
									key={level}
									className={`h-2 w-full rounded ${
										level <= passwordStrength.strength
											? passwordStrength.strength <= 2
												? 'bg-rose-500'
												: passwordStrength.strength === 3
												? 'bg-yellow-500'
												: 'bg-green-500'
											: 'bg-gray-200'
									}`}
								/>
							))}
						</div>
						<div className='text-xs'>
							{passwordStrength.met.length > 0 && (
								<div className='text-green-600'>
									✓ {passwordStrength.met.map((req) => req.label).join(', ')}
								</div>
							)}
							{passwordStrength.unmet.length > 0 && (
								<div className='text-gray-500'>
									Missing:{' '}
									{passwordStrength.unmet.map((req) => req.label).join(', ')}
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			<div className='flex flex-col gap-1'>
				<label htmlFor='confirmPassword' className='font-medium'>
					Confirm Password *
				</label>
				{errors.confirmPassword && (
					<span className='text-sm font-bold text-rose-500'>
						{errors.confirmPassword.message}
					</span>
				)}
				<input
					id='confirmPassword'
					{...register('confirmPassword')}
					type='password'
					placeholder='Confirm Password'
					className='p-4 border rounded-lg'
				/>
				{confirmPasswordValue && confirmPasswordValue !== passwordValue && (
					<span className='text-sm font-bold text-rose-500'>Passwords do not match</span>
				)}
			</div>

			<div className='flex flex-col gap-1'>
				<label htmlFor='gender' className='font-medium'>
					Gender *
				</label>
				{errors.gender && (
					<span className='text-sm font-bold text-rose-500'>{errors.gender.message}</span>
				)}
				<select id='gender' {...register('gender')} className='p-4 border rounded-lg'>
					<option value=''>Select Gender</option>
					<option value='male'>Male</option>
					<option value='female'>Female</option>
				</select>
			</div>

			<div className='flex flex-col gap-1'>
				<label htmlFor='country' className='font-medium'>
					Country *
				</label>
				{errors.country && (
					<span className='text-sm font-bold text-rose-500'>
						{errors.country.message}
					</span>
				)}
				<select id='country' {...register('country')} className='p-4 border rounded-lg'>
					<option value=''>Select Country</option>
					{countries.map((country) => (
						<option key={country.code} value={country.name}>
							{country.name}
						</option>
					))}
				</select>
			</div>

			<div className='flex flex-col gap-1'>
				<label htmlFor='avatar' className='font-medium'>
					Avatar (PNG/JPEG, max 5MB) *
				</label>
				{errors.avatar && (
					<span className='text-sm font-bold text-rose-500'>{errors.avatar.message}</span>
				)}
				<input
					id='avatar'
					type='file'
					accept='image/png, image/jpeg'
					className='p-4 border rounded-lg'
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) setValue('avatar', file, { shouldValidate: true });
					}}
				/>
			</div>

			<div className='flex items-start gap-2'>
				<input id='acceptTnC' type='checkbox' className='mt-1' {...register('acceptTnC')} />
				<label htmlFor='acceptTnC' className='text-sm'>
					I accept the Terms and Conditions *
				</label>
			</div>
			{errors.acceptTnC && (
				<span className='text-sm font-bold text-rose-500'>{errors.acceptTnC.message}</span>
			)}

			<button
				type='submit'
				disabled={!isValid}
				className={`font-medium rounded-lg px-5 py-3 text-center inline-flex items-center justify-center duration-500 ${
					!isValid
						? 'bg-gray-400 cursor-not-allowed text-gray-600'
						: 'bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-white'
				}`}
			>
				Submit
			</button>
		</form>
	);
};

export default FormHook;
