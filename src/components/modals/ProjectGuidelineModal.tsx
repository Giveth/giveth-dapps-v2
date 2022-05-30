import { FC } from 'react';
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

export const ProjectGuidelineModal: FC<IModal> = ({ setShowModal }) => {
	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={<Image src={BulbIcon} alt='light bulb' />}
			headerTitle='Submission guidelines'
			headerTitlePosition='left'
		>
			<Container>
				<Bullets>
					<li>
						Clear project description explaining who the
						organization is and what you will do with the funds.
					</li>
					<li>A unique or custom banner photo.</li>
					<li>
						No violations of our{' '}
						<ExternalLink
							href={links.COVENANT_DOC}
							title='Covenant'
							color={brandColors.pinky[500]}
						/>{' '}
						and/or{' '}
						<ExternalLink
							href={Routes.Terms}
							title='Terms of Use'
							color={brandColors.pinky[500]}
						/>
						.
					</li>
					<li>
						<Optional>(Optional)</Optional>Embedded photos, videos
						or legitimate external links.
					</li>
					<li>
						<Optional>(Optional)</Optional>A link to the repository
						of open-source projects.
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
