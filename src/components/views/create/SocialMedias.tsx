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
import { useForm } from 'react-hook-form';
import { TInputs } from './types';
import Input from '@/components/Input';

const socialMediasArray = [
	{
		name: 'Facebook',
		icon: <IconFacebook24 />,
	},
	{
		name: 'Twitter',
		icon: <IconX24 />,
	},
	{
		name: 'Instagram',
		icon: <IconInstagram24 />,
	},
	{
		name: 'YouTube',
		icon: <IconYoutube />,
	},
	{
		name: 'LinkedIn',
		icon: <IconLinkedin24 />,
	},
	{
		name: 'Reddit',
		icon: <IconLinkedin24 />,
	},
	{
		name: 'Discord',
		icon: <IconDiscord24 />,
	},
	{
		name: 'Farcaster',
		icon: <IconLinkedin24 />,
	},
	{
		name: 'Lens',
		icon: <IconLinkedin24 />,
	},
	{
		name: 'Website',
		icon: <IconLinkedin24 />,
	},
];

const SocialMedias = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, dirtyFields, isSubmitting },
		control,
		setValue,
		watch,
	} = useForm<TInputs>();

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
								<Input
									placeholder='Enter Link'
									register={register}
									registerName={socialMedia.name.toLowerCase()}
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
