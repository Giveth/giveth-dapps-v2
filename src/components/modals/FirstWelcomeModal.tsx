import { FC } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { H5, Button, Lead, brandColors } from '@giveth/ui-design-system';

import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import { Bullets } from '@/components/styled-components/Bullets';
import Routes from '@/lib/constants/Routes';
import ExternalLink from '@/components/ExternalLink';

interface IText {
	isDark?: boolean;
}

export const FirstWelcomeModal: FC<IModal> = ({ setShowModal }) => {
	const theme = useAppSelector(state => state.general.theme);
	const router = useRouter();

	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={<img src='/images/icons/donate.svg' />}
			headerTitle={`Let's Donate`}
			headerTitlePosition='left'
		>
			<Container>
				<Title isDark={theme === ETheme.Dark}>
					Welcome to the future of giving
				</Title>
				<LeadTitle>Here is the things that you can do now!</LeadTitle>
				<Bullets>
					<Paragraph isDark={theme === ETheme.Dark}>
						Take a look at awesome{' '}
						<ExternalLink
							href={Routes.Projects}
							title='projects'
							color={brandColors.pinky[500]}
						/>{' '}
						on Giveth.
					</Paragraph>
					<Paragraph isDark={theme === ETheme.Dark}>
						You can also create a{' '}
						<ExternalLink
							href={Routes.CreateProject}
							title='new project'
							color={brandColors.pinky[500]}
						/>{' '}
						and receive donations.
					</Paragraph>
					<Paragraph isDark={theme === ETheme.Dark}>
						You can earn GIV token by{' '}
						<ExternalLink
							href={Routes.Projects}
							title='donating to projects'
							color={brandColors.pinky[500]}
						/>
						.
					</Paragraph>
				</Bullets>
				<Buttons>
					<DonateButton
						label='Donate to a project'
						onClick={() => {
							router.push(Routes.Projects);
							setShowModal(false);
						}}
						buttonType={
							theme === ETheme.Dark ? 'secondary' : 'primary'
						}
					/>
					<Button
						buttonType='texty'
						label='CLOSE'
						onClick={() => setShowModal(false)}
					/>
				</Buttons>
			</Container>
		</Modal>
	);
};

const Title = styled(H5)`
	color: ${(prop: IText) => (prop.isDark ? 'white' : brandColors.deep[900])};
	font-weight: 700;
	margin-bottom: 24px;
`;

const LeadTitle = styled(Lead)`
	margin-bottom: 24px;
`;

const DonateButton = styled(Button)`
	width: 300px;
	height: 48px;
`;

const Buttons = styled.div`
	padding-top: 20px;
	> * {
		margin: 20px auto 0;
	}
`;

const Container = styled.div`
	width: 528px;
	text-align: left;
	padding: 26px 33px;
`;

const Paragraph = styled.li`
	color: ${(prop: IText) => (prop.isDark ? 'white' : brandColors.deep[900])};
	font-size: 20px;
`;
