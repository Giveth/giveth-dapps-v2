import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IButtonProps } from '@giveth/ui-design-system/lib/esm/components/buttons/type';
import {
	brandColors,
	Container,
	H1,
	QuoteText,
	Button,
} from '@giveth/ui-design-system';

import Routes from '@/lib/constants/Routes';
import ContributeCard from './PublicProfileContributeCard';
import { Row } from '@/components/styled-components/Grid';
import { IUserPublicProfileView } from './UserPublicProfile.view';
import useUser from '@/context/UserProvider';
import { isUserRegistered } from '@/lib/helpers';

const PublicProfileOverviewTab: FC<IUserPublicProfileView> = ({ user }) => {
	const router = useRouter();
	const {
		actions: { showCompleteProfile },
	} = useUser();

	const handleCreateButton = () => {
		if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			showCompleteProfile();
		}
	};

	const Sections = {
		stranger: {
			title: 'Don’t be a stranger!',
			subtitle:
				'Complete your profile for better management of your donations & projects',
			buttons: [
				{
					label: 'COMPLETE PROFILE',
					buttonType: 'primary',
					onClick: () => router.push(Routes.Onboard),
				} as IButtonProps,
			],
		},
		donate: {
			title: 'Start donating or raising funds',
			subtitle:
				'Giveth is the place to donate to or raise funds for awesome projects with zero added feeds. ',
			buttons: [
				{
					label: 'CREATE A PROJECT',
					buttonType: 'primary',
					onClick: handleCreateButton,
				} as IButtonProps,
				{
					label: 'VIEW PROJECTS',
					buttonType: 'secondary',
					onClick: () => router.push(Routes.Projects),
				} as IButtonProps,
			],
		},
		getGiv: {
			title: 'Give and get GIV',
			subtitle: ' Donate to verified projects and get rewarded with GIV',
			buttons: [
				{
					label: 'EXPLORE GIVBACKS',
					buttonType: 'primary',
					onClick: () => router.push(Routes.GIVBACKS),
				} as IButtonProps,
			],
		},
	};

	const [section, setSection] = useState(Sections.getGiv);
	const { title, subtitle, buttons } = section;

	useEffect(() => {
		const setupSections = async () => {
			if (!user?.name) {
				setSection(Sections.stranger);
			} else if (!user?.totalDonated) {
				setSection(Sections.donate);
			} else {
				setSection(Sections.getGiv);
			}
		};
		setupSections();
	}, [user]);

	return (
		<UserContributeInfo>
			<ContributeCard user={user} myAccount={true} />
			<Container>
				<AccountHero title={title}>
					<H1>{title}</H1>
					<QuoteText>{subtitle}</QuoteText>
					<Buttons>
						{buttons.map((btn, index) => {
							return (
								<Btn
									size='large'
									key={index}
									label={btn.label}
									buttonType={btn.buttonType}
									onClick={e => btn.onClick && btn.onClick(e)}
								/>
							);
						})}
					</Buttons>
				</AccountHero>
			</Container>
		</UserContributeInfo>
	);
};

export default PublicProfileOverviewTab;

const AccountHero = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 480px;
	background-image: url('/images/backgrounds/account-bg.png');
	margin: 31px 0 0 0;
	border-radius: 8px;
	color: ${brandColors.giv[500]};
	padding: 0 60px;
	align-items: ${props =>
		props.title === 'Start donating or raising funds'
			? 'flex-start'
			: 'center'};
	justify-content: center;
	h1 {
		font-weight: bold;
	}
	div {
		font-size: 24px;
	}
`;

const UserContributeInfo = styled.div`
	padding: 40px 0 60px;
`;

const Buttons = styled(Row)`
	margin: 40px 0 0 0;
	gap: 12px;
`;

const Btn = styled(Button)`
	background-color: ${props =>
		props.buttonType === 'secondary' && 'transparent'};
	color: ${props =>
		props.buttonType === 'secondary' && brandColors.pinky[500]};
	border: 2px solid
		${props => props.buttonType === 'secondary' && brandColors.pinky[500]};
	:hover {
		background-color: ${props =>
			props.buttonType === 'secondary' && 'transparent'};
		border: 2px solid
			${props =>
				props.buttonType === 'secondary' && brandColors.pinky[700]};
		color: ${props =>
			props.buttonType === 'secondary' && brandColors.pinky[700]};
	}
`;
