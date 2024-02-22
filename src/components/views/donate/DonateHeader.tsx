import Image from 'next/image';
import { FC } from 'react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { Caption, B, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex, FlexSpacer } from '@/components/styled-components/Flex';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
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
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';

export interface IHeader {
	theme?: ETheme;
	show?: boolean;
}

export const DonateHeader: FC<IHeader> = () => {
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();
	const { walletAddress } = useGeneralWallet();
	const dispatch = useAppDispatch();
	const router = useRouter();

	const { project } = useDonateData();
	const showHeader = useShowHiderByScroll();

	const isGIVeconomyRoute = checkIsGIVeconomyRoute(router.route);

	return (
		<StyledHeader $alignItems='center' $baseTheme={theme} show={showHeader}>
			<Flex $alignItems='center' gap='16px'>
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
				<Flex $flexDirection='column' gap='4px'>
					<StyledCaption medium>Donating to</StyledCaption>
					<B>{project.title}</B>
				</Flex>
			</Flex>
			<FlexSpacer />
			<Flex gap='8px'>
				{walletAddress ? (
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
						onClick={() => dispatch(setShowWelcomeModal(true))}
					/>
				)}
			</Flex>
		</StyledHeader>
	);
};

const StyledCaption = styled(Caption)`
	color: ${neutralColors.gray[700]};
`;
