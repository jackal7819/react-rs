import { z } from 'zod';

export const formSchema = z
	.object({
		name: z
			.string()
			.min(1, { error: 'Name is required' })
			.regex(/^[A-Z][a-z]*$/, { error: 'First letter must be uppercase' }),
		age: z.number().positive({ error: 'Age must be positive' }),
		email: z.email({ error: 'Invalid email' }),
		password: z
			.string()
			.min(8, { error: 'Password must be at least 8 characters' })
			.regex(/[0-9]/, { error: 'Must contain at least one number' })
			.regex(/[A-Z]/, { error: 'Must contain at least one uppercase letter' })
			.regex(/[a-z]/, { error: 'Must contain at least one lowercase letter' })
			.regex(/[^a-zA-Z0-9]/, { error: 'Must contain at least one special character' }),
		confirmPassword: z.string(),
		gender: z.enum(['male', 'female'], { error: 'Gender is required' }),
		acceptTnC: z
			.boolean()
			.refine((val) => val, { error: 'You must accept Terms & Conditions' }),
		avatar: z
			.file({ error: 'Please select a file' })
			.refine((file) => file.size <= 5 * 1024 * 1024, {
				error: 'File size must be less than 5MB',
			})
			.refine((file) => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type), {
				error: 'Only PNG and JPEG files are allowed',
			}),
		country: z.string().min(1, { error: 'Country is required' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: 'Passwords must match',
		path: ['confirmPassword'],
	});
