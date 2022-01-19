import config from '@/configuration';
import {
	P,
	B,
	H5,
	neutralColors,
	IconGIVStream,
	Title,
	GLink,
	brandColors,
	IconExternalLink,
	OulineButton,
	IconGIVBack,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { Row } from '../styled-components/Grid';
import { Modal, IModal } from './Modal';
import Link from 'next/link';

interface IGIVBackExplainModal extends IModal {}

export const GIVBackExplainModal: FC<IGIVBackExplainModal> = ({
	showModal,
	setShowModal,
}) => {
	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<GIVBackExplainContainer>
				<TitleRow alignItems='center' justifyContent='center'>
					<IconGIVBack size={24} />
					<Title>Why don&apos;t I have GIVbacks?</Title>
				</TitleRow>
				<Desc>
					GIVbacks rewards corresponding to the current round become
					available after the round ends. If you donated to a verified
					project and do not yet have rewards to claim, it is likely
					that GIVbacks have not yet been distributed for that round,
					or that you claimed your GIVbacks rewards already.
				</Desc>
				<LinksRow alignItems='center' justifyContent='center'>
					<GLink
						onClick={() => setShowModal(false)}
						target='_blank'
						href='https://docs.giveth.io/giveconomy/givbacks'
					>
						<LinksRow justifyContent='center'>
							Read More
							<IconExternalLink
								size={16}
								color={'currentColor'}
							/>
						</LinksRow>
					</GLink>
				</LinksRow>
				<GotItButton
					label='GOT IT'
					onClick={() => {
						setShowModal(false);
					}}
				/>
			</GIVBackExplainContainer>
		</Modal>
	);
};

const GIVBackExplainContainer = styled.div`
	padding: 56px 24px 24px;
	background-image: url('/images/stream1.svg');
	background-repeat: no-repeat;
	width: 570px;
	color: ${neutralColors.gray[100]};
`;

const TitleRow = styled(Row)`
	gap: 16px;
	margin-bottom: 41px;
`;

const Desc = styled(P)`
	margin-bottom: 41px;
`;

const LinksRow = styled(Row)`
	gap: 8px;
	color: ${brandColors.cyan[500]};
	margin-bottom: 24px;
`;

const GotItButton = styled(OulineButton)`
	width: 316px;
	margin: 0 auto;
`;
