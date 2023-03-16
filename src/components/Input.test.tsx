import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { neutralColors, semanticColors } from '@giveth/ui-design-system';
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

test('the input border is gray on normal', async () => {
	render(<Input label='test' />);
	const input = screen.getByTestId('styled-input');
	expect(input).toHaveStyle(`border: 2px solid ${neutralColors.gray[300]}`);
});

test('the input border is red on error', async () => {
	render(<Input label='test' error={{ message: 'Error' }} />);
	const input = screen.getByTestId('styled-input');
	expect(input).toHaveStyle(`border: 2px solid ${semanticColors.punch[500]}`);
});
