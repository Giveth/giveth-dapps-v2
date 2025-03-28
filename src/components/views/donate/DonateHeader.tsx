import Image from 'next/image';
import { FC } from 'react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import {
	Caption,
	B,
	neutralColors,
	Flex,
	FlexSpacer,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
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
import { EScrollDir, useScrollDetection } from '@/hooks/useScrollDetection';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import { getActiveRound } from '@/helpers/qf';

export interface IHeader {
	theme?: ETheme;
	show?: boolean;
	isSuccessDonation?: boolean;
}

export const DonateHeader: FC<IHeader> = props => {
	const { isSuccessDonation } = props;
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();
	const { walletAddress } = useGeneralWallet();
	const dispatch = useAppDispatch();
	const router = useRouter();

	const { project } = useDonateData();
	const scrollDir = useScrollDetection();

	const isGIVeconomyRoute = checkIsGIVeconomyRoute(router.route);

	let routePath = Routes.Project + '/' + project.slug;

	// Change route if donation done successfully
	if (isSuccessDonation) {
		const { qfRounds } = project;
		const { activeQFRound } = getActiveRound(qfRounds);

		const isActiveQF = activeQFRound?.isActive;

		routePath = isActiveQF ? Routes.AllQFProjects : Routes.AllProjects;
	}

	return (
		<StyledHeader
			$alignItems='center'
			$baseTheme={theme}
			$show={scrollDir !== EScrollDir.Down}
		>
			<Flex $alignItems='center' gap='16px'>
				<Link href={routePath}>
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
					<StyledCaption $medium>Donating to</StyledCaption>
					<B>{project.title}</B>
				</Flex>
			</Flex>
			<FlexSpacer />
			<Flex gap='8px'>
				{walletAddress ? (
					<UserButtonWithMenu
						isHeaderShowing={scrollDir !== EScrollDir.Down}
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
