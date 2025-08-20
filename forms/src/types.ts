export interface ValidationErrors {
	name?: string;
	age?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
	gender?: string;
	acceptTnC?: string;
	avatar?: string;
	country?: string;
}

export interface PasswordRequirement {
	label: string;
}

export interface PasswordStrength {
	met: PasswordRequirement[];
	unmet: PasswordRequirement[];
	strength: number;
}