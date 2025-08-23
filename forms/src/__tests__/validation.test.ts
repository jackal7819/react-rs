import { describe, it, expect } from 'vitest';
import { formSchema } from '../utils/validation';

describe('formSchema', () => {
	const baseValidData = {
		name: 'John',
		age: 25,
		email: 'john.doe@example.com',
		password: 'Password123!',
		confirmPassword: 'Password123!',
		gender: 'male',
		acceptTnC: true,
		avatar: new File([''], 'avatar.png', { type: 'image/png' }),
		country: 'USA',
	};

	it('should validate a valid form object', () => {
		const result = formSchema.safeParse(baseValidData);
		expect(result.success).toBe(true);
	});

	it('should fail validation with an incorrect name', () => {
		const invalidData = { ...baseValidData, name: 'john' };
		const result = formSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('First letter must be uppercase');
		}
	});

	it('should fail with a negative age', () => {
		const invalidData = { ...baseValidData, age: -10 };
		const result = formSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Age must be positive');
		}
	});

	it('should fail with an invalid email', () => {
		const invalidData = { ...baseValidData, email: 'invalid-email' };
		const result = formSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Invalid email');
		}
	});

	it('should fail with a password that is too short', () => {
		const invalidData = { ...baseValidData, password: 'pass' };
		const result = formSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
		}
	});

	it('should fail if passwords do not match', () => {
		const invalidData = { ...baseValidData, confirmPassword: 'Password123' };
		const result = formSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Passwords must match');
		}
	});

	it('should fail if avatar is not a valid file', () => {
		const invalidData = { ...baseValidData, avatar: null };
		const result = formSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Please select a file');
		}
	});
});
