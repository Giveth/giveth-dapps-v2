import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	H1,
	QuoteText,
	Button,
	OutlineButton,
	IButtonProps,
} from '@giveth/ui-design-system';

import { useIntl } from 'react-intl';
import Routes from '@/lib/constants/Routes';
import ContributeCard from './ProfileContributeCard';
import { Flex } from '@/components/styled-components/Flex';
import { isUserRegistered } from '@/lib/helpers';
import { mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';
import { IUserProfileView } from '@/components/views/userProfile/UserProfile.view';

interface IBtnProps extends IButtonProps {
	outline?: boolean;
}

interface ISection {
	title: string;
	subtitle: string;
	buttons: IBtnProps[];
}

const ProfileOverviewTab: FC<IUserProfileView> = ({ user }) => {
	const { formatMessage } = useIntl();
	const router = useRouter();
	const dispatch = useAppDispatch();

	const handleCreateButton = () => {
		if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			dispatch(setShowCompleteProfile(true));
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
					onClick: () => router.push(Routes.Onboard),
				},
			],
		},
		donate: {
			title: 'Start donating or raising funds',
			subtitle:
				'Giveth is the place to donate to or raise funds for awesome projects with zero added feeds. ',
			buttons: [
				{
					label: formatMessage({
						id: 'component.button.create_project',
					}),
					onClick: handleCreateButton,
				},
				{
					label: 'VIEW PROJECTS',
					onClick: () => router.push(Routes.Projects),
					outline: true,
				},
			],
		},
		getGiv: {
			title: 'Give and get GIV',
			subtitle: ' Donate to verified projects and get rewarded with GIV',
			buttons: [
				{
					label: 'EXPLORE GIVBACKS',
					onClick: () => router.push(Routes.GIVbacks),
				},
			],
		},
	};

	const [section, setSection] = useState<ISection>(Sections.getGiv);
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
			<ContributeCard user={user} myAccount />
			<AccountHero leftAlign={title === Sections.donate.title}>
				<H1>{title}</H1>
				<QuoteText>{subtitle}</QuoteText>
				<Buttons>
					{buttons.map((btn, index) => {
						const props: IButtonProps = {
							size: 'large',
							label: btn.label,
							buttonType: 'primary',
							onClick: btn.onClick,
						};
						if (btn.outline)
							return <OutlineButton key={index} {...props} />;
						return <Button key={index} {...props} />;
					})}
				</Buttons>
			</AccountHero>
		</UserContributeInfo>
	);
};

const AccountHero = styled.div<{ leftAlign: boolean }>`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 580px;
	background-image: url('/images/backgrounds/account-bg.png');
	margin: 31px 0 0 0;
	border-radius: 8px;
	color: ${brandColors.giv[500]};
	padding: 0 15px;
	align-items: ${props => (props.leftAlign ? 'flex-start' : 'center')};
	text-align: ${props => (props.leftAlign ? 'left' : 'center')};
	justify-content: center;
	> h1 {
		font-weight: bold;
		margin-bottom: 9px;
	}
	div {
		font-size: 24px;
	}
	${mediaQueries.mobileL} {
		height: 480px;
		padding: 0 60px;
	}
`;

const UserContributeInfo = styled.div`
	padding: 40px 0 60px;
`;

const Buttons = styled(Flex)`
	margin: 40px 0 0 0;
	gap: 12px;
	flex-wrap: wrap;
`;

export default ProfileOverviewTab;
