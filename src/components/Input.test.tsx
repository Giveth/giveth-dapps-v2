import { render } from '@testing-library/react';
import { IconLink } from '@giveth/ui-design-system';
import Input from '@/components/Input';
import '@testing-library/jest-dom';

test('Testing Input component', () => {
	const { getByRole } = render(<Input />);
	const input = getByRole('textbox');
	expect(input).toBeInTheDocument();
	expect(input).toHaveValue('');
});

test('Testing Input Icon', () => {
	const { getByRole, debug } = render(
		<Input LeftIcon={<IconLink />} id='TestInput' />,
	);
	const input = getByRole('textbox');
	// expect(input).toHaveAd;
	debug();
});
