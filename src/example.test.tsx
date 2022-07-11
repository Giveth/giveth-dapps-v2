import { render } from '@/tests/utils';
import Header from './components/Header/Header';

jest.mock('next/router', () => ({
	useRouter() {
		return {
			route: '/',
			pathname: '',
			query: '',
			asPath: '',
		};
	},
}));

describe('HomePage', () => {
	it('should render App', () => {
		const { debug } = render(<Header />);
	});
});
