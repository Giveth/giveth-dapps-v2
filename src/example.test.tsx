import { render } from '@testing-library/react';
import HomePage from '../pages/_app';

describe('HomePage', () => {
	it('should render App', () => {
		render(<HomePage />);
	});
});
