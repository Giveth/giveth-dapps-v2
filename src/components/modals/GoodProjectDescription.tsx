import { FC } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Button, Lead, brandColors, H5 } from '@giveth/ui-design-system';

import Routes from '@/lib/constants/Routes';
import { IModal, Modal } from '@/components/modals/Modal';

export const GoodProjectDescription: FC<IModal> = ({
	showModal,
	setShowModal,
}) => {
	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			hiddenClose={false}
			headerIcon={<img src='/images/icons/lightbulb.svg' />}
			headerTitle='How to write a great project description'
			headerTitlePosition='left'
		>
			<Container>
				<Title>
					Try to use this structure as a guide when writing the
					description
				</Title>
				<Description>Who?</Description>
				<Description>What?</Description>
				<Description>Why?</Description>
				<Description>Where?</Description>
				<Description>How?</Description>
				<Description>When?</Description>

				<LeadStyled>See how others have done it,</LeadStyled>
				<Link href={Routes.Projects} passHref>
					<LinkStyled>Browse examples.</LinkStyled>
				</Link>

				<LeadStyled>Read this blog post tutorial,</LeadStyled>
				<LinkStyled href='https://knowhow.ncvo.org.uk/how-to/how-to-write-an-overview-of-a-nonprofit-organization'>
					How to write a fundraising project description to increase
					donations.
				</LinkStyled>

				<OkButton
					label='DISMISS'
					onClick={() => setShowModal(false)}
					buttonType='texty'
				/>
			</Container>
		</Modal>
	);
};

const LeadStyled = styled(Lead)`
	margin-top: 24px;
`;

const LinkStyled = styled.a`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	font-size: 16px;
`;

const Container = styled.div`
	max-width: 545px;
	text-align: left;
	padding: 20px 30px;
`;

const OkButton = styled(Button)`
	width: 100%;
	height: 48px;
	margin: 48px auto 24px auto;
`;

const Title = styled(Lead)`
	color: ${brandColors.deep[900]};
	margin: 16px 0 36px 0;
	text-align: center;
`;

const Description = styled(H5)`
	color: ${brandColors.deep[900]};
	padding: 0 5px 0 0;
	text-align: center;
	font-weight: 700;
	font-size: 25px;
`;
