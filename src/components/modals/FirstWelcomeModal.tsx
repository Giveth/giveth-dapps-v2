import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import {
	H5,
	Button,
	Lead,
	brandColors,
	IconDonation,
} from '@giveth/ui-design-system';

import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import Routes from '@/lib/constants/Routes';
import StorageLabel from '@/lib/localStorage';
import { Bullets } from '@/components/styled-components/Bullets';
import ExternalLink from '@/components/ExternalLink';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IText {
	isDark?: boolean;
}

export const FirstWelcomeModal: FC<IModal> = ({ setShowModal }) => {
	const intl = useIntl();
	const theme = useAppSelector(state => state.general.theme);
	const router = useRouter();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	useEffect(() => {
		localStorage.setItem(StorageLabel.FIRSTMODALSHOWED, '1');
	}, []);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconDonation />}
			headerTitle={`Let's Donate`}
			headerTitlePosition='left'
		>
			<Container>
				<Title isDark={theme === ETheme.Dark}>
					<FormattedMessage id='page.home.bigscreen.title' />
				</Title>
				<LeadTitle>You can use Giveth to:</LeadTitle>
				<Bullets>
					<Paragraph isDark={theme === ETheme.Dark}>
						Donate to awesome for-good{' '}
						<ExternalLink
							href={Routes.Projects}
							title='projects'
							color={brandColors.pinky[500]}
						/>
						.
					</Paragraph>
					<Paragraph isDark={theme === ETheme.Dark}>
						<ExternalLink
							href={Routes.CreateProject}
							title='Create a project '
							color={brandColors.pinky[500]}
						/>
						&amp; start raising funds for your cause.
					</Paragraph>
					<Paragraph isDark={theme === ETheme.Dark}>
						Earn GIV from{' '}
						<ExternalLink
							href={Routes.GIVbacks}
							title='GIVbacks'
							color={brandColors.pinky[500]}
						/>{' '}
						when you donate to verified{' '}
						<ExternalLink
							href={Routes.Projects}
							title='projects'
							color={brandColors.pinky[500]}
						/>
						.
					</Paragraph>
					<Paragraph isDark={theme === ETheme.Dark}>
						Earn a yield by staking tokens in the{' '}
						<ExternalLink
							href={Routes.GIVfarm}
							title='GIVfarm'
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
							closeModal();
						}}
						buttonType={
							theme === ETheme.Dark ? 'secondary' : 'primary'
						}
					/>
					<Button
						buttonType='texty'
						label='CLOSE'
						onClick={closeModal}
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
