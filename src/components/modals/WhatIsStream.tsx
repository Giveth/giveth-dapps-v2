import {
	P,
	H5,
	IconGIVStream,
	Title,
	GLink,
	brandColors,
	IconExternalLink,
	OutlineButton,
	mediaQueries,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import Link from 'next/link';
import { Flex, FlexCenter } from '../styled-components/Flex';
import { Modal } from './Modal';
import Routes from '@/lib/constants/Routes';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { RegenStreamConfig } from '@/types/config';
import type { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';

interface IWhatIsStreamModal extends IModal {
	tokenDistroHelper?: TokenDistroHelper;
	regenStreamConfig?: RegenStreamConfig;
	cb?: any;
}

export const WhatIsStreamModal: FC<IWhatIsStreamModal> = ({
	setShowModal,
	tokenDistroHelper,
	regenStreamConfig,
	cb,
}) => {
	const theme = useAppSelector(state => state.general.theme);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const { rewardTokenSymbol } = regenStreamConfig || {
		rewardTokenSymbol: 'GIV',
	};
	const closeModalWithCb = () => {
		closeModal();
		cb && cb();
	};

	return (
		<Modal closeModal={closeModalWithCb} isAnimating={isAnimating}>
			<WhatIsStreamContainer theme={theme}>
				<TitleRow>
					<IconGIVStream size={24} />
					<Title>
						What is
						{regenStreamConfig
							? ' a RegenStream?'
							: ' the GIVstream?'}
					</Title>
				</TitleRow>
				<Desc>
					Welcome to the expanding
					{regenStreamConfig
						? ' Multiverse! The RegenStream aligns community members with the long term success of platforms and DAOs that are value-aligned with Giveth.'
						: ' GIViverse! With the GIVstream, as the GIVeconomy grows, so does the governance power of its contributors.'}
				</Desc>
				<H5 weight={900}>How it Works </H5>
				<Desc>
					When you harvest {rewardTokenSymbol} rewards, a portion of
					your {rewardTokenSymbol} is sent directly to your wallet and
					the rest is added to your {rewardTokenSymbol}stream. As time
					passes and the {rewardTokenSymbol}stream flows, a larger
					portion of the total {rewardTokenSymbol} you get is sent
					directly to you at the time of harvest. The
					{' ' + rewardTokenSymbol}stream flows until{' '}
					{new Date(
						tokenDistroHelper?.endTime || 0,
					).toLocaleDateString('en-US', {
						day: 'numeric',
						year: 'numeric',
						month: 'short',
					})}
					.
				</Desc>
				{!regenStreamConfig && (
					<LinksRow>
						<Link href={Routes.GIVstream}>
							<GLink onClick={closeModalWithCb}>
								<Flex justifyContent='center'>
									View Your {rewardTokenSymbol}stream{' '}
									<IconExternalLink
										size={16}
										color={'currentColor'}
									/>
								</Flex>
							</GLink>
						</Link>
					</LinksRow>
				)}
				<GotItButton
					label='GOT IT'
					buttonType={theme === ETheme.Dark ? 'secondary' : 'primary'}
					onClick={closeModalWithCb}
				/>
			</WhatIsStreamContainer>
		</Modal>
	);
};

const WhatIsStreamContainer = styled.div`
	padding: 24px 24px 24px;
	background-image: ${props =>
		props.theme === ETheme.Dark
			? `url('/images/stream1.svg')`
			: `url('/images/stream2.svg')`};
	background-repeat: no-repeat;
	width: 100%;
	${mediaQueries.tablet} {
		width: 570px;
	}
`;

const TitleRow = styled(FlexCenter)`
	gap: 16px;
	margin-bottom: 41px;
`;

const Desc = styled(P)`
	margin-bottom: 41px;
`;

const LinksRow = styled(FlexCenter)`
	gap: 8px;
	color: ${brandColors.cyan[500]};
	margin-bottom: 24px;
`;

const GotItButton = styled(OutlineButton)`
	width: 316px;
	margin: 0 auto;
`;
