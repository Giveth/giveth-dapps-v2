import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import {
	P,
	H5,
	Button,
	Lead,
	neutralColors,
	brandColors,
} from '@giveth/ui-design-system';

import { Modal } from '@/components/modals/Modal';
import { IModal } from '@/types/common';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';
import Routes from '@/lib/constants/Routes';
import StorageLabel from '@/lib/localStorage';

interface IText {
	isDark?: boolean;
}

export const FirstWelcomeModal: FC<IModal> = ({ setShowModal }) => {
	const theme = useAppSelector(state => state.general.theme);
	const router = useRouter();

	useEffect(() => {
		localStorage.setItem(StorageLabel.FIRSTMODALSHOWED, '1');
	}, []);

	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={<img src='/images/icons/donate.svg' />}
			headerTitle={`Let's Donate`}
			headerTitlePosition='left'
		>
			<Container>
				<Title isDark={theme === ETheme.Dark}>
					Welcome to the Future of Giving
				</Title>
				<LeadTitle>You can use Giveth to:</LeadTitle>
				<Bullets>
					<li>
						<Paragraph isDark={theme === ETheme.Dark}>
							Donate to awesome for-good{' '}
							<InlineLink
								target='_blank'
								rel={'noopener noreferrer'}
								href={Routes.Project}
							>
								{' '}
								projects
							</InlineLink>
							.
						</Paragraph>
					</li>
					<li>
						<Paragraph isDark={theme === ETheme.Dark}>
							<InlineLink
								target='_blank'
								rel={'noopener noreferrer'}
								href={Routes.CreateProject}
							>
								Create a project
							</InlineLink>{' '}
							&amp; start raising funds for your cause.
						</Paragraph>
					</li>
					<li>
						<Paragraph isDark={theme === ETheme.Dark}>
							Earn GIV from{' '}
							<InlineLink
								target='_blank'
								rel={'noopener noreferrer'}
								href={Routes.GIVbacks}
							>
								GIVbacks
							</InlineLink>{' '}
							when you donate to verified{' '}
							<InlineLink
								target='_blank'
								rel={'noopener noreferrer'}
								href={Routes.Projects}
							>
								projects
							</InlineLink>
							.
						</Paragraph>
					</li>
					<li>
						<Paragraph isDark={theme === ETheme.Dark}>
							Earn a yield by staking tokens in the{' '}
							<InlineLink
								target='_blank'
								rel={'noopener noreferrer'}
								href={Routes.GIVfarm}
							>
								GIVfarm
							</InlineLink>
							.
						</Paragraph>
					</li>
				</Bullets>
				<DonateButton
					label='Donate to a project'
					onClick={() => {
						router.push('/projects');
						setShowModal(false);
					}}
					buttonType={theme === ETheme.Dark ? 'secondary' : 'primary'}
				/>
			</Container>
		</Modal>
	);
};

const InlineLink = styled.a`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

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
	margin: 48px auto 0;
`;

const Container = styled.div`
	width: 528px;
	text-align: left;
	padding: 26px 33px;
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

const Paragraph = styled(P)`
	color: ${(prop: IText) => (prop.isDark ? 'white' : brandColors.deep[900])};
`;
