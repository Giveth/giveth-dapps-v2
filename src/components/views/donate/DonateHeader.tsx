import Image from 'next/image';
import { FC } from 'react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { useAccount, useNetwork } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import Link from 'next/link';
import { Caption, B, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex, FlexSpacer } from '@/components/styled-components/Flex';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';

import { isGIVeconomyRoute as checkIsGIVeconomyRoute } from '@/lib/helpers';
import {
	StyledHeader,
	Logo,
	ConnectButton,
} from '@/components/Header/Header.sc';
import { UserButtonWithMenu } from '@/components/menu/UserButtonWithMenu';
import Routes from '@/lib/constants/Routes';
import { useDonateData } from '@/context/donate.context';
import { useShowHiderByScroll } from '@/hooks/useShowHiderByScroll';

export interface IHeader {
	theme?: ETheme;
	show?: boolean;
}

export const DonateHeader: FC<IHeader> = () => {
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();
	const { address } = useAccount();
	const { chain } = useNetwork();
	const router = useRouter();
	const { open: openConnectModal } = useWeb3Modal();
	const { project } = useDonateData();
	const showHeader = useShowHiderByScroll();
	const chainId = chain?.id;
	const isGIVeconomyRoute = checkIsGIVeconomyRoute(router.route);

	return (
		<StyledHeader alignItems='center' theme={theme} show={showHeader}>
			<Flex alignItems='center' gap='16px'>
				<Link href={Routes.Project + '/' + project.slug}>
					<Logo>
						<Image
							width='26'
							height='26'
							alt='Giveth logo'
							src={`/images/back-2.svg`}
						/>
					</Logo>
				</Link>
				<Flex flexDirection='column' gap='4px'>
					<StyledCaption medium>Donating to</StyledCaption>
					<B>{project.title}</B>
				</Flex>
			</Flex>
			<FlexSpacer />
			<Flex gap='8px'>
				{address && chainId ? (
					<UserButtonWithMenu
						isHeaderShowing={showHeader}
						theme={theme}
					/>
				) : (
					<ConnectButton
						buttonType='primary'
						size='small'
						label={formatMessage({
							id: isGIVeconomyRoute
								? 'component.button.connect_wallet'
								: 'component.button.sign_in',
						})}
						onClick={() => openConnectModal?.()}
					/>
				)}
			</Flex>
		</StyledHeader>
	);
};

const StyledCaption = styled(Caption)`
	color: ${neutralColors.gray[700]};
`;
