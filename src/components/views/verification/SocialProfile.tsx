import Image from 'next/image';
import {
	Button,
	H6,
	IconTwitter,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import FacebookIcon from '/public/images/icons/social/facebook.svg';
import InstagramIcon from '/public/images/icons/social/instagram.svg';
import YoutubeIcon from '/public/images/icons/social/youtube.svg';
import DiscordIcon from '/public/images/icons/social/discord.svg';
import { ButtonRemove } from './common';
import { ContentSeparator, BtnContainer } from './VerificationIndex';
import { useVerificationData } from '@/context/verification.context';

const SocialProfile = () => {
	const { setStep } = useVerificationData();
	return (
		<>
			<div>
				<H6 weight={700}>Personal Social Media</H6>
				<br />
				<Description>
					<Attention>i</Attention>
					Please connect to your personal social media profiles. At
					least one is required.
				</Description>
				<ButtonsSection>
					<ButtonRow>
						<ButtonSocial color='#00ACEE'>
							<IconTwitter />
							@LAURENLUZ
						</ButtonSocial>
						<ButtonRemove />
					</ButtonRow>
					<ButtonRow>
						<ButtonSocial color='#3B5998'>
							<Image src={FacebookIcon} alt='facebook icon' />
							@LAURENLUZ
						</ButtonSocial>
						<ButtonRemove />
					</ButtonRow>
					<ButtonRow>
						<ButtonSocial color='#CD486B'>
							<Image src={InstagramIcon} alt='instagram icon' />
							@LAURENLUZ
						</ButtonSocial>
						<ButtonRemove />
					</ButtonRow>
					<ButtonRow>
						<ButtonSocial color='#F7003B'>
							<Image src={YoutubeIcon} alt='youtube icon' />
							CONNECT TO YOUTUBE
						</ButtonSocial>
					</ButtonRow>
					<ButtonRow>
						<ButtonSocial color='#7700D5'>
							<Image src={DiscordIcon} alt='discord icon' />
							CONNECT TO DISCORD
						</ButtonSocial>
					</ButtonRow>
				</ButtonsSection>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button onClick={() => setStep(1)} label='<     PREVIOUS' />
					<Button onClick={() => setStep(3)} label='NEXT     >' />
				</BtnContainer>
			</div>
		</>
	);
};

const ButtonRow = styled(Flex)`
	gap: 8px;
`;

const ButtonsSection = styled.div`
	> div {
		margin-top: 24px;
	}
`;

const ButtonSocial = styled(FlexCenter)<{ color?: string }>`
	border-radius: 48px;
	background: white;
	height: 48px;
	box-shadow: ${Shadow.Giv[400]};
	color: ${props => props.color || 'inherit'};
	font-size: 12px;
	font-weight: 700;
	gap: 9px;
	width: fit-content;
	padding: 0 24px;
	cursor: pointer;
`;

const Attention = styled(FlexCenter)`
	width: 16px;
	font-size: 14px;
	height: 16px;
	border-radius: 50%;
	border: 1px solid ${neutralColors.gray[600]};
`;

const Description = styled(P)`
	display: flex;
	align-items: center;
	gap: 10px;
	color: ${neutralColors.gray[700]};
`;

export default SocialProfile;
