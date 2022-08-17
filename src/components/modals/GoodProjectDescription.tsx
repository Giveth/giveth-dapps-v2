import { FC } from 'react';
import styled from 'styled-components';
import { Button, Lead, brandColors, H5 } from '@giveth/ui-design-system';
import Image from 'next/image';

import Routes from '@/lib/constants/Routes';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import BulbIcon from '/public/images/icons/lightbulb.svg';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

export const GoodProjectDescription: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={BulbIcon} alt='light bulb' />}
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
				<ExternalLink
					title='Browse examples.'
					href={Routes.Projects}
					color={brandColors.pinky[500]}
				/>

				<LeadStyled>Read this blog post tutorial,</LeadStyled>
				<ExternalLink
					title='How to write a fundraising project description to increase
					donations.'
					href={links.FUNDRAISING_DOCS}
					color={brandColors.pinky[500]}
				/>

				<OkButton
					label='DISMISS'
					onClick={closeModal}
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
