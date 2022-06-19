import dynamic from 'next/dynamic';
import { useAppSelector } from '@/features/hooks';

const Footer = dynamic(() => import('./Footer'), { ssr: false });

export const FooterWrapper = () => {
	const showFooter = useAppSelector(state => state.general.showFooter);
	return showFooter ? <Footer /> : null;
};
