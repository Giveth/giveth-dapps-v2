import { render } from '@testing-library/react';
import About from '../pages/about';

describe('HomePage', () => {
	it('should render App', () => {
		const { debug } = render(<About />);
		debug();
	});
});
