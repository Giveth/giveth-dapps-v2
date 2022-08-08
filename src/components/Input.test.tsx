import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Input from '@/components/Input';
import '@testing-library/jest-dom';

test('Testing Input component', () => {
	const { getByRole } = render(<Input />);
	const input = getByRole('textbox');
	expect(input).toBeInTheDocument();
	expect(input).toHaveValue('');
});

test('the input is accessible', async () => {
	const { getByRole, debug } = render(<Input id='TestInput' />);
	const input = getByRole('textbox');
	const accessibilityResults = await axe(input);
	expect(accessibilityResults).toHaveNoViolations();

	debug();
});
