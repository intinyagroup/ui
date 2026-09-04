import { describe, it, expect } from 'vitest';
import { validators, createFormValidator } from './validate.js';

describe('validators.required', () => {
	it('rejects empty string', () => {
		expect(validators.required().validate('')).toBe('This field is required');
	});

	it('rejects null', () => {
		expect(validators.required().validate(null)).toBe('This field is required');
	});

	it('rejects undefined', () => {
		expect(validators.required().validate(undefined)).toBe('This field is required');
	});

	it('rejects empty array', () => {
		expect(validators.required().validate([])).toBe('This field is required');
	});

	it('accepts non-empty values', () => {
		expect(validators.required().validate('hello')).toBeNull();
		expect(validators.required().validate(0)).toBeNull();
		expect(validators.required().validate(['a'])).toBeNull();
	});

	it('uses custom message', () => {
		expect(validators.required('Name is required').validate('')).toBe('Name is required');
	});
});

describe('validators.minLength', () => {
	it('rejects values shorter than min', () => {
		expect(validators.minLength(3).validate('ab')).toBe('Must be at least 3 characters');
	});

	it('accepts values at or above min', () => {
		expect(validators.minLength(3).validate('abc')).toBeNull();
		expect(validators.minLength(3).validate('abcd')).toBeNull();
	});

	it('uses custom message', () => {
		expect(validators.minLength(3, 'Too short').validate('ab')).toBe('Too short');
	});
});

describe('validators.email', () => {
	it('rejects invalid emails', () => {
		expect(validators.email().validate('not-an-email')).toBe('Please enter a valid email');
		expect(validators.email().validate('a@b')).toBe('Please enter a valid email');
		expect(validators.email().validate('@b.com')).toBe('Please enter a valid email');
	});

	it('accepts valid emails', () => {
		expect(validators.email().validate('a@b.com')).toBeNull();
		expect(validators.email().validate('user.name+tag@example.co')).toBeNull();
	});
});

describe('createFormValidator', () => {
	const validator = createFormValidator<{ name: string; email: string }>({
		name: [validators.required('Name is required'), validators.minLength(3)],
		email: [validators.email()]
	});

	it('returns valid with no errors for valid values', () => {
		const result = validator.validate({ name: 'Ada', email: 'ada@example.com' });
		expect(result.valid).toBe(true);
		expect(result.errors).toEqual({});
	});

	it('returns invalid with per-field errors for invalid values', () => {
		const result = validator.validate({ name: '', email: 'not-an-email' });
		expect(result.valid).toBe(false);
		expect(result.errors).toEqual({
			name: 'Name is required',
			email: 'Please enter a valid email'
		});
	});

	it('reports the first failing rule per field', () => {
		const result = validator.validate({ name: 'ab', email: 'ada@example.com' });
		expect(result.valid).toBe(false);
		expect(result.errors.name).toBe('Must be at least 3 characters');
	});

	it('validateField returns error for a failing field', () => {
		expect(validator.validateField('name', '')).toBe('Name is required');
		expect(validator.validateField('email', 'nope')).toBe('Please enter a valid email');
	});

	it('validateField returns null for a valid field', () => {
		expect(validator.validateField('name', 'Ada Lovelace')).toBeNull();
		expect(validator.validateField('email', 'ada@example.com')).toBeNull();
	});
});
