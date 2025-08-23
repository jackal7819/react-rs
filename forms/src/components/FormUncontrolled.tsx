import type { PasswordStrength, ValidationErrors } from '../types';
import { useRef, useState } from 'react';
import { ZodError } from 'zod';

import { formSchema } from '../utils/validation';
import { useCountryStore } from '../store/useCountryStore';
import { useFormStore, type FormData } from '../store/useFormStore';
import { checkPasswordStrength, fileToBase64 } from '../utils/formHelpers';

const FormUncontrolled: React.FC<{ onClose: () => void }> = ({ onClose }) => {
	const { addData } = useFormStore();
	const { countries } = useCountryStore();

	const nameRef = useRef<HTMLInputElement>(null);
	const ageRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const confirmPasswordRef = useRef<HTMLInputElement>(null);
	const genderRef = useRef<HTMLSelectElement>(null);
	const acceptTnCRef = useRef<HTMLInputElement>(null);
	const avatarRef = useRef<HTMLInputElement>(null);
	const countryRef = useRef<HTMLInputElement>(null);

	const [errors, setErrors] = useState<ValidationErrors>({});
	const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
		met: [],
		unmet: [],
		strength: 0,
	});
	const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
	const [inputValue, setInputValue] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);

	const filteredCountries = countries.filter((c) =>
		c.name.toLowerCase().includes(inputValue.toLowerCase())
	);

	const handlePasswordChange = () => {
		const password = passwordRef.current?.value || '';
		setPasswordStrength(checkPasswordStrength(password));
	};

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			setErrors((prev) => ({ ...prev, avatar: '' }));
			return;
		}

		try {
			setErrors((prev) => ({ ...prev, avatar: '' }));
		} catch (error) {
			if (error instanceof ZodError) {
				setErrors((prev) => ({
					...prev,
					avatar: error.issues[0]?.message || 'Invalid file',
				}));
			} else {
				setErrors((prev) => ({
					...prev,
					avatar: 'Unexpected error',
				}));
			}
		}
	};

	const validateForm = () => {
		const formData = {
			name: nameRef.current?.value || '',
			age: Number(ageRef.current?.value) || 0,
			email: emailRef.current?.value || '',
			password: passwordRef.current?.value || '',
			confirmPassword: confirmPasswordRef.current?.value || '',
			gender: genderRef.current?.value || '',
			acceptTnC: acceptTnCRef.current?.checked || false,
			avatar: avatarRef.current?.files?.[0] || undefined,
			country: countryRef.current?.value || '',
		};

		try {
			formSchema.parse(formData);
			setErrors({});
			setIsSubmitDisabled(false);
			return true;
		} catch (error) {
			if (error instanceof ZodError) {
				const newErrors: ValidationErrors = {};
				error.issues.forEach((issue) => {
					const field = issue.path[0];
					if (typeof field === 'string') {
						newErrors[field as keyof ValidationErrors] = issue.message;
					}
				});
				setErrors(newErrors);
				setIsSubmitDisabled(true);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		let avatarBase64 = '';
		const avatarFile = avatarRef.current?.files?.[0];

		if (avatarFile) {
			try {
				avatarBase64 = await fileToBase64(avatarFile);
			} catch (error) {
				console.error('Error converting file to base64:', error);
			}
		}

		const formData: FormData = {
			name: nameRef.current?.value || '',
			age: Number(ageRef.current?.value) || 0,
			email: emailRef.current?.value || '',
			password: passwordRef.current?.value || '',
			gender: (genderRef.current?.value as 'male' | 'female') || undefined,
			country: countryRef.current?.value || '',
			avatar: avatarBase64 || '',
			acceptTnC: acceptTnCRef.current?.checked || false,
		};

		addData(formData);
		onClose();
	};

	return (
		<form onSubmit={handleSubmit} className='flex flex-col max-w-md gap-4 mx-auto text-lg'>
			<div className='flex flex-col gap-1'>
				<label htmlFor='name' className='font-medium'>
					Name *
				</label>
				{errors.name && (
					<span className='text-sm font-bold text-rose-500'>{errors.name}</span>
				)}
				<input
					id='name'
					ref={nameRef}
					placeholder='Name'
					className='p-4 border rounded-lg'
					onChange={validateForm}
				/>
			</div>
			<div className='flex flex-col gap-1'>
				<label htmlFor='age' className='font-medium'>
					Age *
				</label>
				{errors.age && (
					<span className='text-sm font-bold text-rose-500'>{errors.age}</span>
				)}
				<input
					id='age'
					ref={ageRef}
					type='number'
					min='0'
					placeholder='Age'
					className='p-4 border rounded-lg'
					onChange={validateForm}
				/>
			</div>
			<div className='flex flex-col gap-1'>
				<label htmlFor='email' className='font-medium'>
					Email *
				</label>
				{errors.email && (
					<span className='text-sm font-bold text-rose-500'>{errors.email}</span>
				)}
				<input
					id='email'
					ref={emailRef}
					type='email'
					placeholder='Email'
					className='p-4 border rounded-lg'
					onChange={validateForm}
				/>
			</div>
			<div className='flex flex-col gap-1'>
				<label htmlFor='password' className='font-medium'>
					Password *
				</label>
				{errors.password && (
					<span className='text-sm font-bold text-rose-500'>{errors.password}</span>
				)}
				<input
					id='password'
					ref={passwordRef}
					type='password'
					placeholder='Password'
					className='p-4 border rounded-lg'
					onChange={() => {
						handlePasswordChange();
						validateForm();
					}}
				/>
				{passwordRef.current?.value && (
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
						{errors.confirmPassword}
					</span>
				)}
				<input
					id='confirmPassword'
					ref={confirmPasswordRef}
					type='password'
					placeholder='Confirm Password'
					className='p-4 border rounded-lg'
					onChange={validateForm}
				/>
			</div>
			<div className='flex flex-col gap-1'>
				<label htmlFor='gender' className='font-medium'>
					Gender *
				</label>
				{errors.gender && (
					<span className='text-sm font-bold text-rose-500'>{errors.gender}</span>
				)}
				<select
					id='gender'
					ref={genderRef}
					className='p-4 border rounded-lg'
					onChange={validateForm}
				>
					<option value=''>Select Gender</option>
					<option value='male'>Male</option>
					<option value='female'>Female</option>
				</select>
			</div>
			<div className='relative flex flex-col gap-1'>
				<label htmlFor='country' className='font-medium'>
					Country *
				</label>
				{errors.country && (
					<span className='text-sm font-bold text-rose-500'>{errors.country}</span>
				)}
				<input
					id='country'
					type='text'
					ref={countryRef}
					placeholder='Start typing country...'
					className='p-4 border rounded-lg'
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
						setShowSuggestions(true);
						validateForm();
					}}
					onFocus={() => setShowSuggestions(true)}
					onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
					autoComplete='off'
				/>
				{showSuggestions && inputValue && filteredCountries.length > 0 && (
					<ul className='absolute z-10 w-full overflow-auto bg-white border rounded-lg shadow-lg max-h-40 top-24'>
						{filteredCountries.map((c) => (
							<li
								key={c.code}
								className='p-2 cursor-pointer hover:bg-slate-200 text-slate-800'
								onMouseDown={(e) => {
									e.preventDefault();
									setInputValue(c.name);
									setShowSuggestions(false);
								}}
							>
								{c.name}
							</li>
						))}
					</ul>
				)}
			</div>
			<div className='flex flex-col gap-1'>
				<label htmlFor='avatar' className='font-medium'>
					Avatar (PNG/JPEG, max 5MB) *
				</label>
				{errors.avatar && (
					<span className='text-sm font-bold text-rose-500'>{errors.avatar}</span>
				)}
				<input
					id='avatar'
					ref={avatarRef}
					type='file'
					accept='.png,.jpg,.jpeg,image/png,image/jpeg'
					className='p-4 border rounded-lg'
					onChange={handleFileChange}
				/>
			</div>
			<div className='flex items-start gap-2'>
				<input
					id='acceptTnC'
					ref={acceptTnCRef}
					type='checkbox'
					className='mt-1'
					onChange={validateForm}
				/>
				<label htmlFor='acceptTnC' className='text-sm'>
					I accept the Terms and Conditions *
				</label>
			</div>
			{errors.acceptTnC && (
				<span className='text-sm font-bold text-rose-500'>{errors.acceptTnC}</span>
			)}
			<button
				type='submit'
				disabled={isSubmitDisabled}
				className={`font-medium rounded-lg px-5 py-3 text-center inline-flex items-center justify-center duration-500 ${
					isSubmitDisabled
						? 'bg-gray-400 cursor-not-allowed text-gray-600'
						: 'bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-white'
				}`}
			>
				Submit
			</button>
		</form>
	);
};

export default FormUncontrolled;
