import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TwitterShareButton } from 'react-share';
import styled from 'styled-components';
import { Arc } from '@/components/styled-components/Arc';
import {
	Button,
	brandColors,
	D3,
	Lead,
	H2,
	H3,
} from '@giveth/ui-design-system';

import TwitterIcon from '/public/images/twitter.svg';
import useUser from '@/context/UserProvider';
import { isSSRMode, isUserRegistered } from '@/lib/helpers';
import Routes from '@/lib/constants/Routes';

const HomePurpleSection = () => {
	const router = useRouter();
	const {
		state: { user },
		actions: { showCompleteProfile },
	} = useUser();

	const handleCreateButton = () => {
		if (isUserRegistered(user)) {
			router.push(Routes.CreateProject);
		} else {
			showCompleteProfile();
		}
	};

	const url = !isSSRMode ? window?.location?.href : null;
	const shareTitle = `I am a Giver and you can be one too! 💙 @givethio. Let's Build the Future of Giving together! 🙌 🌈 #maketheworldabetterplace 🌏 💜`;

	return (
		<Wrapper>
			<ArcSmall />
			<ArcBig />
			<div className='d-none d-lg-block'>
				<ArcMustard />
				<DotMustard />
			</div>
			<GivingEffortless weight={700}>
				Giving is effortless and people all around the world are
				rewarded for creating positive change.
			</GivingEffortless>
			<GivingButtons>
				<StartGiving
					size='large'
					label='START GIVING'
					onClick={() => router.push(Routes.Projects)}
				/>
				<TwitterShareButton
					title={shareTitle}
					url={url || ''}
					hashtags={['Giveth']}
				>
					<TwitterButton
						buttonType='texty'
						size='large'
						label='Tweet this'
						icon={<Image src={TwitterIcon} alt='twitter icon' />}
					/>
				</TwitterShareButton>
			</GivingButtons>
			<GIVeconomy>
				<D3>The GIVeconomy</D3>
				<br />
				<Lead>
					Our system connects the people on the ground directly to the
					Givers with zero added fees. It creates an economy of giving
					by rewarding donors and encouraging decentralized community
					governance.
				</Lead>
				<br />
				<Link href={Routes.GIVECONOMY} passHref>
					<GIVeconomyUrl>Learn more about GIVeconomy</GIVeconomyUrl>
				</Link>
			</GIVeconomy>
			<ForMakersGivers>
				<ForMakersContainers>
					<H3 weight={700}>For Projects</H3>
					<br />
					<Lead>
						Create a project and start raising funds in crypto
						within minutes. Get verified to reward your donors with
						GIVbacks.
					</Lead>
					<br />
					<ForMakersButton
						buttonType='primary'
						size='large'
						label='CREATE A PROJECT'
						onClick={handleCreateButton}
					/>
				</ForMakersContainers>
				<ForMakersContainers>
					<H3 weight={700}>For Givers</H3>
					<br />
					<Lead>
						Donate to change-makers that are working hard to make a
						difference. Earn GIV from GIVbacks when you donate to
						verified projects and become a stakeholder in the future
						of philanthropy.
					</Lead>
					<br />
					<ForMakersButton
						buttonType='primary'
						size='large'
						label='DONATE TO A PROJECT'
						onClick={() => router.push(Routes.Projects)}
					/>
				</ForMakersContainers>
			</ForMakersGivers>
		</Wrapper>
	);
};

const ArcMustard = styled(Arc)`
	border-width: 132px;
	border-color: transparent transparent ${brandColors.mustard[500]}
		transparent;
	top: -50px;
	right: -300px;
	width: 675px;
	height: 675px;
	transform: rotate(31deg);
`;

const DotMustard = styled(Arc)`
	border-width: 71px;
	border-color: ${brandColors.mustard[500]};
	top: 140px;
	right: 290px;
	width: 142px;
	height: 142px;
`;

const ArcBig = styled(Arc)`
	border-width: 150px;
	border-color: ${brandColors.giv[600]};
	top: -700px;
	left: -700px;
	width: 1740px;
	height: 1740px;
	opacity: 60%;
`;

const ArcSmall = styled(Arc)`
	border-width: 50px;
	border-color: ${brandColors.giv[600]};
	top: -200px;
	left: -550px;
	width: 700px;
	height: 700px;
`;

const ForMakersGivers = styled.div`
	margin-top: 107px;
	margin-bottom: 162px;
	display: flex;
	flex-wrap: wrap;
	gap: 200px;
`;

const ForMakersContainers = styled.div`
	min-width: 350px;
	max-width: 445px;
	min-height: 320px;
	display: flex;
	flex-direction: column;
`;

const ForMakersButton = styled(Button)`
	height: 66px;
	padding: 0 80px;
	margin-top: auto;
	align-self: start;
`;

const GIVeconomy = styled.div`
	margin-top: 235px;
	max-width: 800px;
`;

const GIVeconomyUrl = styled.a`
	color: ${brandColors.mustard[500]} !important;
`;

const GivingButtons = styled.div`
	display: flex;
	margin-top: 70px;
	flex-wrap: wrap;
`;

const StartGiving = styled(Button)`
	background-color: ${brandColors.mustard[500]};
	color: ${brandColors.giv[500]};
	height: 66px;
	padding: 0 80px;

	&:hover {
		background-color: ${brandColors.mustard[500]};
		color: ${brandColors.giv[500]};
	}
`;

const TwitterButton = styled(Button)`
	color: white;
	height: 66px;
	padding: 0 80px;

	&:hover {
		background-color: transparent;
		color: white;
	}
`;

const GivingEffortless = styled(H2)`
	color: ${brandColors.mustard[500]};
	max-width: 654px;
`;

const Wrapper = styled.div`
	background: ${brandColors.giv[500]};
	padding: 90px 120px;
	color: white;
	position: relative;
	z-index: 2;
	overflow: hidden;
`;

export default HomePurpleSection;
