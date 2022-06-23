import dynamic from 'next/dynamic';
import { useAppSelector } from '@/features/hooks';

const Header = dynamic(() => import('./Header'), { ssr: false });

export const HeaderWrapper = () => {
	const showHeader = useAppSelector(state => state.general.showHeader);
	return showHeader ? <Header /> : null;
};
