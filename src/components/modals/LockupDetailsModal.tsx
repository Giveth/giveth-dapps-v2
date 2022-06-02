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
import { Flex } from '../styled-components/Flex';
import { Modal } from './Modal';
import links from '@/lib/constants/links';
import { IModal } from '@/types/common';

export const LockupDetailsModal: FC<IModal> = ({ setShowModal }) => {
	return (
		<Modal
			setShowModal={setShowModal}
			headerTitle='GIVpower'
			headerTitlePosition='left'
			headerIcon={<IconRocketInSpace32 />}
		>
			<GIVPowerExplainContainer>
				<GivPowerContainer>
					<H6>You have</H6>
					<AmountContainer>
						<IconRocketInSpace32 color={brandColors.mustard[500]} />
						<H5>0</H5>
						<H6>GIVpower</H6>
					</AmountContainer>
				</GivPowerContainer>
				<Desc>
					You can boost your favorite projects with GIVpower or
					delegate to community top supporters. GIVpower allows you to
					influence the ranking of projects on Giveth. Get GIVpower
					when you stake &amp; lock GIV. Top ranked projects from
					GIVpower get additional matching funds &amp; their donors
					get more GIVbacks.
					<GLink
						onClick={() => setShowModal(false)}
						target='_blank'
						href={links.GIVPOWER_DOC}
					>
						<LinksRow> Learn More</LinksRow>
					</GLink>
				</Desc>

				<BoostButton
					label='BOOST PROJECT'
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
