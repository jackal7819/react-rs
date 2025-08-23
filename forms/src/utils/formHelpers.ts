export const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

export const checkPasswordStrength = (password: string) => {
	const requirements = [
		{ test: /[0-9]/, label: '1 number' },
		{ test: /[A-Z]/, label: '1 uppercase letter' },
		{ test: /[a-z]/, label: '1 lowercase letter' },
		{ test: /[^a-zA-Z0-9]/, label: '1 special character' },
	];

	const met = requirements.filter((req) => req.test.test(password));
	const unmet = requirements.filter((req) => !req.test.test(password));

	return { met, unmet, strength: met.length };
};
