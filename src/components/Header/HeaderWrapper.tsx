import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/features/hooks';
import {
	HeaderLink,
	HeaderLinks,
	HeaderPlaceHolder,
	Logo,
	StyledHeader,
} from './Header.sc';
import Routes from '@/lib/constants/Routes';
import { Flex } from '../styled-components/Flex';

const Header = dynamic(() => import('./Header'), {
	loading: () => <HeaderLoading />,
	ssr: false,
});

const HeaderLoading = () => {
	const theme = useAppSelector(state => state.general.theme);
	return (
		<StyledHeader $alignItems='center' $baseTheme={theme} show={true}>
			<Flex gap='24px' $alignItems='center'>
				<Link href={Routes.Home}>
					<Logo>
						<Image
							width='50'
							height='50'
							alt='Giveth logo'
							src='/images/logo/logo.svg'
						/>
					</Logo>
				</Link>
			</Flex>
			<HeaderLinks $baseTheme={theme}>
				<Link href={Routes.AllProjects}>
					<HeaderLink>Projects</HeaderLink>
				</Link>
				<Link href={Routes.GIVeconomy}>
					<HeaderLink>GIVeconomy</HeaderLink>
				</Link>
			</HeaderLinks>
		</StyledHeader>
	);
};

export const HeaderWrapper = () => {
	const showHeader = useAppSelector(state => state.general.showHeader);
	return showHeader ? (
		<>
			<HeaderPlaceHolder />
			<Header />
		</>
	) : null;
};
