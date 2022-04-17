import dynamic from 'next/dynamic';
import { useGeneral } from '@/context/general.context';

const Header = dynamic(() => import('./Header'), { ssr: false });

export const HeaderWrapper = () => {
	const { showHeader } = useGeneral();
	return showHeader ? <Header /> : null;
};
