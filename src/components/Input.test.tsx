import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import Input from '@/components/Input';
import '@testing-library/jest-dom';

test('the input is rendering', () => {
	render(<Input />);
	const input = screen.getByRole('textbox');
	expect(input).toBeInTheDocument();
	expect(input).toHaveValue('');
});

test('the input is accessible', async () => {
	render(<Input label='test' />);
	const input = screen.getByRole('textbox');
	const accessibilityResults = await axe(input);
	expect(accessibilityResults).toHaveNoViolations();
});
