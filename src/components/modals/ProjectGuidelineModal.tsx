import { FC } from 'react';
import styled from 'styled-components';
import { P, neutralColors, brandColors } from '@giveth/ui-design-system';

import { IModal, Modal } from '@/components/modals/Modal';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';

export const ProjectGuidelineModal: FC<IModal> = ({ setShowModal }) => {
	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={<img src='/images/icons/lightbulb.svg' />}
			headerTitle='Submission guidelines'
			headerTitlePosition='left'
		>
			<Container>
				<Bullets>
					<li>
						<P>
							Clear project description explaining who the
							organization is and what you will do with the funds.
						</P>
					</li>
					<li>
						<P>A unique or custom banner photo.</P>
					</li>

					<li>
						<P>
							No violations of our{' '}
							<InlineLink
								target='_blank'
								rel={'noopener noreferrer'}
								href={links.COVENANT_DOC}
							>
								Covenant
							</InlineLink>{' '}
							and/or{' '}
							<InlineLink
								target='_blank'
								rel={'noopener noreferrer'}
								href={Routes.Terms}
							>
								Terms of Use
							</InlineLink>
							.
						</P>
					</li>

					<li>
						<P>
							<Optional>(Optional)</Optional>Embedded photos,
							videos or legitimate external links.
						</P>
					</li>

					<li>
						<P>
							<Optional>(Optional)</Optional>A link to the
							repository of open-source projects.
						</P>
					</li>
				</Bullets>
			</Container>
		</Modal>
	);
};

const InlineLink = styled.a`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

const Container = styled.div`
	width: 350px;
	text-align: left;
	padding: 0 30px;
`;

const Optional = styled.span`
	color: ${neutralColors.gray[700]};
	padding: 0 5px 0 0;
`;

const Bullets = styled.ul`
	padding-left: 17px;
	list-style-image: url('/images/bullet_tiny.svg');
	display: flex;
	flex-direction: column;
	margin-bottom: 30px;
	li {
		margin: 8px 0;
		color: ${neutralColors.gray[900]};
	}
`;
