import { FC } from 'react';
import styled from 'styled-components';
import { P, neutralColors, brandColors } from '@giveth/ui-design-system';
import { IModal, Modal } from '@/components/modals/Modal';
import { useRouter } from 'next/router';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';

export const ProjectGuidelineModal: FC<IModal> = ({
	showModal,
	setShowModal,
}) => {
	const router = useRouter();
	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			hiddenClose={false}
			headerIcon={<img src='/images/icons/lightbulb.svg' />}
			headerTitle='Submission guidelines'
			headerTitlePosition='left'
		>
			<Container>
				<Bullets>
					<li>
						<P>
							Clear project descriptions explaining who they are
							and what they want to do with the funds.
						</P>
					</li>
					<li>
						<P>A unique or custom banner photo.</P>
					</li>

					<li>
						<P>
							No violations of our{' '}
							<InlineLink
								onClick={() => router.push(links.COVENANT)}
							>
								Covenant
							</InlineLink>{' '}
							and/or{' '}
							<InlineLink
								onClick={() => router.push(Routes.Terms)}
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
							<Optional>(Optional)</Optional> For open-source
							projects, a link to their repository.
						</P>
					</li>
				</Bullets>
			</Container>
		</Modal>
	);
};

const InlineLink = styled.span`
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
