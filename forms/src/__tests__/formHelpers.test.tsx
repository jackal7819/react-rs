import { describe, it, expect, vi } from 'vitest';
import { fileToBase64, checkPasswordStrength } from '../utils/formHelpers';

type MockFileReader = {
	result: string | null;
	onload: () => void;
	onerror: (error: Error) => void;
	readAsDataURL: (file: File) => void;
};

describe('fileToBase64', () => {
	it('should successfully convert a file to a Base64 string', async () => {
		const mockFile = new File(['hello'], 'hello.txt', { type: 'text/plain' });
		const expectedBase64 = 'data:text/plain;base64,aGVsbG8=';

		const mockReader: MockFileReader = {
			result: '',
			onload: () => {},
			onerror: () => {},
			readAsDataURL: () => {},
		};

		mockReader.readAsDataURL = vi.fn(() => {
			mockReader.result = expectedBase64;
			mockReader.onload();
		});

		vi.stubGlobal(
			'FileReader',
			vi.fn(() => mockReader)
		);

		const result = await fileToBase64(mockFile);

		expect(result).toBe(expectedBase64);
		expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
	});

	it('should reject the promise if reading the file fails', async () => {
		const mockFile = new File(['error'], 'error.txt', { type: 'text/plain' });
		const mockError = new Error('Failed to read file');

		const mockReader: MockFileReader = {
			result: '',
			onload: () => {},
			onerror: () => {},
			readAsDataURL: () => {},
		};

		mockReader.readAsDataURL = vi.fn(() => {
			mockReader.onerror(mockError);
		});

		vi.stubGlobal(
			'FileReader',
			vi.fn(() => mockReader)
		);

		await expect(fileToBase64(mockFile)).rejects.toThrow('Failed to read file');
		expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
	});
});

describe('checkPasswordStrength', () => {
	it('should return strength: 4 for a very strong password', () => {
		const result = checkPasswordStrength('StrongP@ss1');
		expect(result.strength).toBe(4);
		expect(result.met).toHaveLength(4);
		expect(result.unmet).toHaveLength(0);
	});

	it('should return strength: 3 for a strong password (missing special char)', () => {
		const result = checkPasswordStrength('StrongPass1');
		expect(result.strength).toBe(3);
		expect(result.met).toHaveLength(3);
		expect(result.unmet).toHaveLength(1);
		expect(result.unmet[0].label).toBe('1 special character');
	});

	it('should return strength: 2 for a medium password (missing special char and number)', () => {
		const result = checkPasswordStrength('StrongPass');
		expect(result.strength).toBe(2);
		expect(result.met).toHaveLength(2);
		expect(result.unmet).toHaveLength(2);
	});

	it('should return strength: 1 for a weak password (only lowercase)', () => {
		const result = checkPasswordStrength('weak');
		expect(result.strength).toBe(1);
		expect(result.met).toHaveLength(1);
		expect(result.met[0].label).toBe('1 lowercase letter');
		expect(result.unmet).toHaveLength(3);
	});

	it('should return strength: 0 for an empty password', () => {
		const result = checkPasswordStrength('');
		expect(result.strength).toBe(0);
		expect(result.met).toHaveLength(0);
		expect(result.unmet).toHaveLength(4);
	});
});
