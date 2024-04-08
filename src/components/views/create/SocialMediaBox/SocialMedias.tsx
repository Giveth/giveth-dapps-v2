import {
	Caption,
	Flex,
	H5,
	IconDiscord18,
	IconFacebook18,
	IconFaracaster,
	IconInstagram18,
	IconLens,
	IconLinkedin18,
	IconRedit,
	IconWorld16,
	IconXSocial18,
	IconYoutube,
	P,
} from '@giveth/ui-design-system';
import { type FC } from 'react';
import styled from 'styled-components';
import { ECreateProjectSections, EInputs } from '../types';
import SocialMediaInput from './SocialMediaInput';
import { validators } from '@/lib/constants/regex';

export const socialMediasArray = [
	{
		name: 'Facebook',
		type: EInputs.facebook,
		icon: IconFacebook18,
		validator: validators.facebook,
	},
	{
		name: 'Twitter',
		type: EInputs.x,
		icon: IconXSocial18,
		validator: validators.twitter,
	},
	{
		name: 'Instagram',
		type: EInputs.instagram,
		icon: IconInstagram18,
		validator: validators.instagram,
	},
	{
		name: 'YouTube',
		type: EInputs.youtube,
		icon: IconYoutube,
		validator: validators.youtube,
	},
	{
		name: 'LinkedIn',
		type: EInputs.linkedin,
		icon: IconLinkedin18,
		validator: validators.linkedin,
	},
	{
		name: 'Reddit',
		type: EInputs.reddit,
		icon: IconRedit,
		validator: validators.reddit,
	},
	{
		name: 'Discord',
		type: EInputs.discord,
		icon: IconDiscord18,
		validator: validators.discord,
	},
	{
		name: 'Farcaster',
		type: EInputs.farcaster,
		icon: IconFaracaster,
		validators: validators.farcaster,
	},
	{
		name: 'Lens',
		type: EInputs.lens,
		icon: IconLens,
		validators: validators.lens,
	},
	{
		name: 'Website',
		type: EInputs.website,
		icon: IconWorld16,
		validators: validators.website,
	},
];

interface ISocialMediaProps {
	setActiveProjectSection: (section: ECreateProjectSections) => void;
}

const SocialMedias: FC<ISocialMediaProps> = ({ setActiveProjectSection }) => {
	return (
		<div
			onMouseEnter={() =>
				setActiveProjectSection(ECreateProjectSections.socialMedia)
			}
		>
			<H5>Social Media Links</H5>
			<StyledCaption>
				Add your project’s social media links (optional)
			</StyledCaption>
			<SocialsContainer>
				<Flex $flexDirection='column'>
					{socialMediasArray.map((socialMedia, index) => {
						const Icon = socialMedia.icon;
						return (
							<Flex
								key={index}
								$justifyContent='space-between' // Adjust justification to start
								gap='8px'
								$alignItems='center'
							>
								<IconAndNameContainer
									gap='4px'
									$alignItems='center'
								>
									<Icon />
									<P>{socialMedia.name}</P>
								</IconAndNameContainer>
								<InputContainer>
									<SocialMediaInput
										registerName={socialMedia.type}
										validator={socialMedia.validator}
									/>
								</InputContainer>
							</Flex>
						);
					})}
				</Flex>
			</SocialsContainer>
		</div>
	);
};

const IconAndNameContainer = styled(Flex)`
	margin-top: -40px;
`;

const SocialsContainer = styled.div`
	padding: 24px;
`;

const StyledCaption = styled(Caption)`
	margin-top: 8px;
`;

const InputContainer = styled.div`
	width: 500px;
`;

export default SocialMedias;
