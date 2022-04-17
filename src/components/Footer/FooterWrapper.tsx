import dynamic from 'next/dynamic';
import { useGeneral } from '@/context/general.context';

const Footer = dynamic(() => import('./Footer'), { ssr: false });

export const FooterWrapper = () => {
	const { showFooter } = useGeneral();
	return showFooter ? <Footer /> : null;
};
