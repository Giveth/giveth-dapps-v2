import { FC } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import useUser from '@/context/UserProvider';
import {
	P,
	H5,
	Button,
	Lead,
	neutralColors,
	brandColors,
} from '@giveth/ui-design-system';

import { IModal, Modal } from '@/components/modals/Modal';
import { ETheme, useGeneral } from '@/context/general.context';

interface IText {
	isDark?: boolean;
}

export const FirstWelcomeModal: FC<IModal> = ({ setShowModal }) => {
	const { theme } = useGeneral();
	const {
		state: { user },
	} = useUser();
	const router = useRouter();

	if (!user) return null;
	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={<img src='/images/icons/donate.svg' />}
			headerTitle={`Let's Donate`}
			headerTitlePosition='left'
		>
			<Container>
				<Title isDark={theme === ETheme.Dark}>
					{' '}
					Welcome to the future of giving
				</Title>
				<LeadTitle>Here is the things that you can do now!</LeadTitle>
				<Bullets>
					<li>
						<Paragraph isDark={theme === ETheme.Dark}>
							Take a look at awesome{' '}
							<InlineLink
								target='_blank'
								rel={'noopener noreferrer'}
								href={'/projects'}
							>
								{' '}
								projects
							</InlineLink>{' '}
							on Giveth.
						</Paragraph>
					</li>
					<li>
						<Paragraph isDark={theme === ETheme.Dark}>
							You can also create a{' '}
							<InlineLink
								target='_blank'
								rel={'noopener noreferrer'}
								href={'/create'}
							>
								new project
							</InlineLink>{' '}
							and receive donations.
						</Paragraph>
					</li>

					<li>
						<Paragraph isDark={theme === ETheme.Dark}>
							You can earn GIV token by{' '}
							<InlineLink
								target='_blank'
								rel={'noopener noreferrer'}
								href={'/projects'}
							>
								donating to projects
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
