import { FC } from 'react';
import styled from 'styled-components';
import { Button, Lead, brandColors, H5 } from '@giveth/ui-design-system';
import Image from 'next/image';
import { useIntl } from 'react-intl';

import Routes from '@/lib/constants/Routes';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import BulbIcon from '/public/images/icons/lightbulb.svg';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

export const GoodProjectDescription: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={BulbIcon} alt='light bulb' />}
			headerTitle={formatMessage({
				id: 'label.how_to_write_a_great_project_description',
			})}
			headerTitlePosition='left'
		>
			<Container>
				<Title>
					{formatMessage({ id: 'label.try_to_use_this_structure' })}
				</Title>
				<Description>{formatMessage({ id: 'label.who?' })}</Description>
				<Description>
					{formatMessage({ id: 'label.what?' })}
				</Description>
				<Description>{formatMessage({ id: 'label.why?' })}</Description>
				<Description>
					{formatMessage({ id: 'label.where?' })}
				</Description>
				<Description>{formatMessage({ id: 'label.how?' })}</Description>
				<Description>
					{formatMessage({ id: 'label.when?' })}
				</Description>

				<LeadStyled>
					{formatMessage({ id: 'label.see_how_others_have_done_it' })}
				</LeadStyled>
				<ExternalLink
					title={formatMessage({ id: 'label.browse_examples' })}
					href={Routes.Projects}
					color={brandColors.pinky[500]}
				/>

				<LeadStyled>
					{formatMessage({
						id: 'label.read_this_blog_post_tutorial',
					})}
				</LeadStyled>
				<ExternalLink
					title={formatMessage({
						id: 'label.how_to_write_a_fundraising_project',
					})}
					href={links.FUNDRAISING_DOCS}
					color={brandColors.pinky[500]}
				/>

				<OkButton
					label={formatMessage({ id: 'label.dismiss' })}
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
