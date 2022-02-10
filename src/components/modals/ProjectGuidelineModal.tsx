import { IModal, Modal } from '@/components/modals/Modal';
import { FC } from 'react';
import styled from 'styled-components';
import { Button, P, Lead, neutralColors } from '@giveth/ui-design-system';
import { ETheme, useGeneral } from '@/context/general.context';

export const ProjectGuidelineModal: FC<IModal> = ({
	showModal,
	setShowModal,
}) => {
	const { theme } = useGeneral();
	return (
		<Modal
			showModal={showModal}
			setShowModal={setShowModal}
			hiddenClose={false}
			headerIcon={<img src='/images/icons/lightbulb.svg' />}
			headerTitle='Before you continue...'
			headerTitlePosition='left'
		>
			<Container>
				<Title>Please read the project submission guidelines.</Title>
				<Bullets>
					<li>
						<Lead>
							Clear project descriptions explaining who they are
							and what they want to do with the funds.
						</Lead>
					</li>
					<li>
						<Lead>A unique or custom banner photo.</Lead>
					</li>

					<li>
						<Lead>
							No violations of our Covenant and/or Terms of Use.
						</Lead>
					</li>

					<li>
						<Lead>
							<Optional>(Optional)</Optional>Embedded photos,
							videos or legitimate external links.
						</Lead>
					</li>

					<li>
						<Lead>
							<Optional>(Optional)</Optional> For open-source
							projects, a link to their repository.
						</Lead>
					</li>
				</Bullets>

				<OkButton
					label='GOT IT'
					onClick={() => setShowModal(false)}
					buttonType={theme === ETheme.Dark ? 'primary' : 'secondary'}
				/>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	width: 528px;
	text-align: left;
	padding: 0 30px;
`;

const OkButton = styled(Button)`
	width: 100%;
	height: 48px;
	margin: 48px auto 24px auto;
`;

const Title = styled(P)`
	color: ${neutralColors.gray[800]};
	font-weight: 400;
	margin: 16px 0 36px 0;
`;

const Optional = styled.span`
	color: ${neutralColors.gray[800]};
	padding: 0 5px 0 0;
`;

const Bullets = styled.ul`
	list-style-image: url('/images/bullet_tiny.svg');
	display: flex;
	flex-direction: column;
	li {
		margin: 8px 0;
		color: ${neutralColors.gray[900]};
	}
`;
