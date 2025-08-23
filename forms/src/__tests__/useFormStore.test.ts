import { act } from 'react';
import { useFormStore, type FormData } from '../store/useFormStore';
import { beforeEach, describe, expect, it } from 'vitest';

const mockFormData: FormData = {
	name: 'John Doe',
	age: 30,
	email: 'john.doe@example.com',
	password: 'password123',
	gender: 'male',
	avatar: 'avatar-url-1',
	country: 'USA',
	acceptTnC: true,
};

describe('useFormStore', () => {
	beforeEach(() => {
		act(() => {
			useFormStore.setState({ submittedData: [] });
		});
	});

	it('should initialize with an empty submittedData array', () => {
		const { submittedData } = useFormStore.getState();
		expect(submittedData).toEqual([]);
	});

	it('should add new data to the submittedData array', () => {
		let { submittedData } = useFormStore.getState();
		expect(submittedData.length).toBe(0);

		act(() => {
			useFormStore.getState().addData(mockFormData);
		});

		({ submittedData } = useFormStore.getState());
		expect(submittedData.length).toBe(1);
		expect(submittedData[0]).toEqual(mockFormData);
	});

	it('should handle multiple data submissions correctly', () => {
		const anotherMockFormData: FormData = {
			...mockFormData,
			name: 'Jane Doe',
			email: 'jane.doe@example.com',
			avatar: 'avatar-url-2',
		};

		act(() => {
			useFormStore.getState().addData(mockFormData);
		});

		act(() => {
			useFormStore.getState().addData(anotherMockFormData);
		});

		const { submittedData } = useFormStore.getState();
		expect(submittedData.length).toBe(2);
		expect(submittedData[0]).toEqual(mockFormData);
		expect(submittedData[1]).toEqual(anotherMockFormData);
	});

	it('should not mutate the original state when adding new data', () => {
		const initialState = useFormStore.getState().submittedData;

		act(() => {
			useFormStore.getState().addData(mockFormData);
		});

		const newState = useFormStore.getState().submittedData;

		expect(newState).not.toBe(initialState);
		expect(newState.length).toBe(initialState.length + 1);
	});
});
