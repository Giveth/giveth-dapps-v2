import dynamic from 'next/dynamic';
import { useAppSelector } from '@/features/hooks';
import { HeaderPlaceHolder } from './Header.sc';

const Header = dynamic(() => import('./Header'), { ssr: false });

export const HeaderWrapper = () => {
	const showHeader = useAppSelector(state => state.general.showHeader);
	return showHeader ? (
		<>
			<HeaderPlaceHolder />
			<Header />
		</>
	) : null;
};
