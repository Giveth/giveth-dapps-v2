import { FC } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { neutralColors, brandColors, P } from '@giveth/ui-design-system';
import Image from 'next/image';

import { Modal } from '@/components/modals/Modal';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';
import { IModal } from '@/types/common';
import { Bullets } from '@/components/styled-components/Bullets';
import BulbIcon from '/public/images/icons/lightbulb.svg';
import ExternalLink from '@/components/ExternalLink';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export const ProjectGuidelineModal: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={BulbIcon} alt='light bulb' />}
			headerTitle={formatMessage({ id: 'label.submission_guidelines' })}
			headerTitlePosition='left'
		>
			<Container>
				<Bullets>
					<li>
						{formatMessage({
							id: 'label.submission_guidelines.one',
						})}
					</li>
					<li>
						{formatMessage({
							id: 'label.submission_guidelines.two',
						})}
					</li>
					<li>
						{formatMessage({
							id: 'label.submission_guidelines.three',
						})}{' '}
						<ExternalLink
							href={links.COVENANT_DOC}
							title={formatMessage({ id: 'label.covenant' })}
							color={brandColors.pinky[500]}
						/>{' '}
						{formatMessage({ id: 'label.and_or' })}{' '}
						<ExternalLink
							href={Routes.Terms}
							title={formatMessage({ id: 'component.title.tos' })}
							color={brandColors.pinky[500]}
						/>
						.
					</li>
					<li>
						<Optional>
							({formatMessage({ id: 'label.optional' })})
						</Optional>
						{formatMessage({
							id: 'label.submission_guidelines.four',
						})}
					</li>
					<li>
						<Optional>
							({formatMessage({ id: 'label.optional' })})
						</Optional>
						{formatMessage({
							id: 'label.submission_guidelines.five',
						})}
					</li>
				</Bullets>
			</Container>
		</Modal>
	);
};

const Container = styled(P)`
	width: 350px;
	text-align: left;
	padding: 0 30px 30px;
`;

const Optional = styled.span`
	color: ${neutralColors.gray[700]};
	padding: 0 5px 0 0;
`;
