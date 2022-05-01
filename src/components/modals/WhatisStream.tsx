import {
	P,
	H5,
	IconGIVStream,
	Title,
	GLink,
	brandColors,
	IconExternalLink,
	OulineButton,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import Link from 'next/link';
import { Flex } from '../styled-components/Flex';
import { Modal, IModal } from './Modal';
import Routes from '@/lib/constants/Routes';
import { ETheme, useGeneral } from '@/context/general.context';
import { RegenStreamConfig } from '@/types/config';
import { useTokenDistro } from '@/context/tokenDistro.context';

interface IWhatisStreamModal extends IModal {
	regenStreamConfig?: RegenStreamConfig;
}

export const WhatisStreamModal: FC<IWhatisStreamModal> = ({
	setShowModal,
	regenStreamConfig,
}) => {
	const { theme } = useGeneral();
	const { regenTokenDistroHelpers, givTokenDistroHelper } = useTokenDistro();
	const { rewardTokenSymbol } = regenStreamConfig || {
		rewardTokenSymbol: 'GIV',
	};
	const tokenDistroHelper = regenStreamConfig
		? regenTokenDistroHelpers[regenStreamConfig?.type]
		: givTokenDistroHelper;

	return (
		<Modal setShowModal={setShowModal}>
			<WhatisStreamContainer theme={theme}>
				<TitleRow alignItems='center' justifyContent='center'>
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
						? ' Multiverse! The RegenStream aligns  '
						: ' GIViverse! The GIVstream '}
					community members with the long term success of
					{regenStreamConfig
						? ' platforms and DAOs that are value-aligned with Giveth.'
						: ' Giveth and the GIVeconomy.'}
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
					{new Date(tokenDistroHelper.endTime).toLocaleDateString(
						'en-US',
						{
							day: 'numeric',
							year: 'numeric',
							month: 'short',
						},
					)}
					.
				</Desc>
				{!regenStreamConfig && (
					<LinksRow alignItems='center' justifyContent='center'>
						<Link href={Routes.GIVstream} passHref>
							<GLink onClick={() => setShowModal(false)}>
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
					onClick={() => {
						setShowModal(false);
					}}
				/>
			</WhatisStreamContainer>
		</Modal>
	);
};

const WhatisStreamContainer = styled.div`
	padding: 24px 24px 24px;
	background-image: ${props =>
		props.theme === ETheme.Dark
			? `url('/images/stream1.svg')`
			: `url('/images/stream2.svg')`};
	background-repeat: no-repeat;
	width: 570px;
`;

const TitleRow = styled(Flex)`
	gap: 16px;
	margin-bottom: 41px;
`;

const Desc = styled(P)`
	margin-bottom: 41px;
`;

const LinksRow = styled(Flex)`
	gap: 8px;
	color: ${brandColors.cyan[500]};
	margin-bottom: 24px;
`;

const GotItButton = styled(OulineButton)`
	width: 316px;
	margin: 0 auto;
`;
