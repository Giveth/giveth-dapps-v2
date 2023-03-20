import {
	P,
	neutralColors,
	GLink,
	brandColors,
	Button,
	IconRocketInSpace32,
	H5,
	H6,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Flex } from '../styled-components/Flex';
import { Modal } from './Modal';
import links from '@/lib/constants/links';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export const GIVPowerExplainModal: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='GIVpower'
			headerTitlePosition='left'
			headerIcon={<IconRocketInSpace32 />}
		>
			<GIVPowerExplainContainer>
				<GivPowerContainer>
					<H6>{formatMessage({ id: 'label.you_have' })}</H6>
					<AmountContainer>
						<IconRocketInSpace32 color={brandColors.mustard[500]} />
						<H5>0</H5>
						<H6>GIVpower</H6>
					</AmountContainer>
				</GivPowerContainer>
				<Desc>
					{formatMessage({
						id: 'label.you_can_boost_your_favorite_projects',
					})}
					<GLink
						onClick={() => setShowModal(false)}
						as='a'
						target='_blank'
						href={links.GIVPOWER_DOC}
					>
						<LinksRow>
							{' '}
							{formatMessage({ id: 'label.learn_more' })}
						</LinksRow>
					</GLink>
				</Desc>

				<BoostButton
					label={formatMessage({ id: 'label.boost_project' })}
					onClick={() => {
						setShowModal(false);
					}}
				/>
			</GIVPowerExplainContainer>
		</Modal>
	);
};

const GIVPowerExplainContainer = styled.div`
	padding: 24px 24px 24px;
	background-repeat: no-repeat;
	width: 448px;
	color: ${neutralColors.gray[100]};
`;

const GivPowerContainer = styled(Flex)`
	flex-direction: column;
	align-items: center;
	background-color: ${brandColors.giv[500]};
	padding: 24px;
	margin: 0 0 24px 0;
	gap: 11px;
	border-radius: 16px;
`;

const AmountContainer = styled(Flex)`
	align-items: center;
	gap: 11px;
`;

const Desc = styled(P)`
	margin-bottom: 41px;
	text-align: left;
`;

const LinksRow = styled(Flex)`
	color: ${brandColors.cyan[500]};
`;

const BoostButton = styled(Button)`
	width: 316px;
	margin: 0 auto;
`;
