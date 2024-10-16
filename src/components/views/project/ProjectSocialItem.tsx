import React from 'react';
import styled from 'styled-components';
import { B, Flex, neutralColors } from '@giveth/ui-design-system';
import { IProjectSocialMedia } from '@/apollo/types/types';
import { Shadow } from '@/components/styled-components/Shadow';
import { socialMediasArray } from '../create/SocialMediaBox/SocialMedias';
import { ensureHttps, getSocialMediaHandle } from '@/helpers/url';

interface IProjectSocialMediaItem {
	socialMedia: IProjectSocialMedia;
}

const socialMediaColor: { [key: string]: string } = {
	facebook: '#4267B2',
	x: '#26A7DE',
	instagram: '#8668FC',
	youtube: '#C4302B',
	linkedin: '#165FFA',
	reddit: '#FF5700',
	discord: '#7289DA',
	website: '#2EA096',
	telegram: '#229ED9',
	github: '#1D1E1F',
};

const ProjectSocialItem = ({ socialMedia }: IProjectSocialMediaItem) => {
	const item = socialMediasArray.find(item => {
		return item.type.toLocaleLowerCase() === socialMedia.type.toLowerCase();
	});

	const IconComponent = item?.icon;

	return (
		<a href={ensureHttps(socialMedia.link)} target='_blank'>
			<SocialItemContainer>
				<Flex gap='8px' $alignItems='center'>
					{IconComponent && (
						<IconComponent
							color={
								socialMediaColor[
									item?.name.toLocaleLowerCase() || 'website'
								]
							}
						/>
					)}

					<B
						style={{
							color: socialMediaColor[
								item?.name.toLocaleLowerCase() || 'website'
							],
						}}
					>
						{/* Use the updated function to show a cleaner link or username */}
						{getSocialMediaHandle(
							socialMedia.link,
							socialMedia.type,
						)}
					</B>
				</Flex>
			</SocialItemContainer>
		</a>
	);
};

const SocialItemContainer = styled.div`
	padding: 16px 24px;
	border-radius: 48px;
	background-color: ${neutralColors.gray[100]};
	box-shadow: ${Shadow.Giv[400]};
`;

export default ProjectSocialItem;
