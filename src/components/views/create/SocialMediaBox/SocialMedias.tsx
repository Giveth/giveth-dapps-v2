import {
	Caption,
	Flex,
	H5,
	IconDiscord24,
	IconFacebook24,
	IconInstagram24,
	IconLinkedin24,
	IconX24,
	IconYoutube,
	P,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { EInputs } from '../types';
import SocialMediaInput from './SocialMediaInput';

export const socialMediasArray = [
	{
		name: 'Facebook',
		type: EInputs.facebook,
		icon: <IconFacebook24 />,
	},
	{
		name: 'Twitter',
		type: EInputs.twitter,
		icon: <IconX24 />,
	},
	{
		name: 'Instagram',
		type: EInputs.instagram,
		icon: <IconInstagram24 />,
	},
	{
		name: 'YouTube',
		type: EInputs.youtube,
		icon: <IconYoutube />,
	},
	{
		name: 'LinkedIn',
		type: EInputs.linkedIn,
		icon: <IconLinkedin24 />,
	},
	{
		name: 'Reddit',
		type: EInputs.reddit,
		icon: <IconLinkedin24 />,
	},
	{
		name: 'Discord',
		type: EInputs.discord,
		icon: <IconDiscord24 />,
	},
	{
		name: 'Farcaster',
		type: EInputs.farcaster,
		icon: <IconLinkedin24 />,
	},
	{
		name: 'Lens',
		type: EInputs.lens,
		icon: <IconLinkedin24 />,
	},
	{
		name: 'Website',
		type: EInputs.website,
		icon: <IconLinkedin24 />,
	},
];

const SocialMedias = () => {
	return (
		<Container>
			<H5>Social Media Links</H5>
			<StyledCaption>
				Add your project’s social media links (optional)
			</StyledCaption>
			<SocialsContainer>
				<Flex $flexDirection='column' gap='8px'>
					{socialMediasArray.map((socialMedia, index) => (
						<Flex
							key={index}
							$justifyContent='space-between' // Adjust justification to start
							gap='8px'
							$alignItems='center'
						>
							<Flex gap='4px' $alignItems='center'>
								{socialMedia.icon}
								<P>{socialMedia.name}</P>
							</Flex>
							<InputContainer>
								<SocialMediaInput
									registerName={socialMedia.type}
								/>
							</InputContainer>
						</Flex>
					))}
				</Flex>
			</SocialsContainer>
		</Container>
	);
};

const Container = styled.div`
	background-color: ${neutralColors.gray[100]};
`;

const SocialsContainer = styled(Container)`
	padding: 24px;
`;

const StyledCaption = styled(Caption)`
	margin-top: 8px;
`;

const InputContainer = styled.div`
	width: 500px;
`;

export default SocialMedias;
