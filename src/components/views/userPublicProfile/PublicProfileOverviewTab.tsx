import ContributeCard from './PublicProfileContributeCard';
import { Row } from '@/components/styled-components/Grid';
import { useRouter } from 'next/router';
import {
	brandColors,
	Container,
	H1,
	QuoteText,
	Button,
	Caption,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IUserPublicProfileView } from './UserPublicProfile.view';
import { IButtonProps } from '@giveth/ui-design-system/lib/esm/components/buttons/type';

interface IIncompleteToast {
	close: any;
}

const IncompleteProfileToast = ({ close }: IIncompleteToast) => {
	return (
		<IncompleteToast>
			<IncompleteProfile>
				<img src='/images/warning.svg' />
				<div>
					<Caption>Your profile is incomplete</Caption>
					<Caption>
						You can’t create project unless you complete your
						profile.
					</Caption>
				</div>
			</IncompleteProfile>
			<LetsDoIt>
				<Btn
					size='small'
					label="LET'S DO IT"
					buttonType='texty'
					onClick={e => alert('modal here')}
				/>
				<img
					onClick={close}
					src='/images/x-icon-mustard.svg'
					width='16px'
					height='16px'
				/>
			</LetsDoIt>
		</IncompleteToast>
	);
};

const PublicProfileOverviewTab: FC<IUserPublicProfileView> = ({ user }) => {
	const router = useRouter();

	const Sections = {
		stranger: {
			title: 'Don’t be a stranger!',
			subtitle:
				'Complete your profile for better management of your donations & projects',
			buttons: [
				{
					label: 'COMPLETE PROFILE',
					buttonType: 'primary',
					onClick: () => alert('here edit profile modal'),
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
					onClick: () => router.push('/create'),
				} as IButtonProps,
				{
					label: 'VIEW PROJECTS',
					buttonType: 'secondary',
					onClick: () => router.push('/projects'),
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
					onClick: () => router.push('/givbacks'),
				} as IButtonProps,
			],
		},
	};

	const [section, setSection] = useState(Sections.getGiv);
	const [incompleteProfile, setIncompleteProfile] = useState<boolean>(false);
	const { title, subtitle, buttons } = section;

	useEffect(() => {
		const setupSections = async () => {
			console.log({ user });
			if (!user?.name) {
				setSection(Sections.stranger);
			} else if (!user?.totalDonated) {
				setSection(Sections.donate);
			} else {
				setSection(Sections.getGiv);
			}
			setIncompleteProfile(!user?.name);
		};
		setupSections();
	}, [user]);

	return (
		<>
			{incompleteProfile && (
				<IncompleteProfileToast
					close={() => setIncompleteProfile(false)}
				/>
			)}
			<UserContributeInfo>
				<ContributeCard user={user} />
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
										onClick={e =>
											btn.onClick && btn.onClick(e)
										}
									/>
								);
							})}
						</Buttons>
					</AccountHero>
				</Container>
			</UserContributeInfo>
		</>
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

const IncompleteToast = styled.div`
	width: 85%;
	position: absolute;
	top: 90px;
	background-color: ${brandColors.mustard[200]};
	border: 1px solid ${brandColors.mustard[700]};
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
`;

const IncompleteProfile = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 17px;
	align-items: flex-start;
	div {
		display: flex;
		flex-direction: column;
		color: ${brandColors.mustard[700]};
		padding-left: 8px;
		margin-top: -2px;
	}
	div:first-child {
		font-weight: bold;
	}
`;

const LetsDoIt = styled.div`
	display: flex;
	align-items: flex-start;
	padding-right: 16px;
	margin: 7px 0 0 0;
	button {
		border: none;
		font-weight: bold;
		color: ${brandColors.mustard[700]};
		:hover {
			border: none;
			background: transparent;
			color: ${brandColors.mustard[800]};
		}
	}
	img {
		cursor: pointer;
		margin: 7px 0 0 0;
	}
`;
