import React, { FC } from 'react';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import {
	FacebookShareButton,
	LinkedinShareButton,
	TwitterShareButton,
} from 'react-share';
import { Lead, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { fullPath } from '@/lib/helpers';
import { IProject } from '@/apollo/types/types';
import { slugToProjectView } from '@/lib/routeCreators';

interface ISocialBox {
	project: IProject;
	isSuccess?: boolean;
}

const SocialBox: FC<ISocialBox> = ({ project, isSuccess }) => {
	const { description, slug } = project;
	const { formatMessage } = useIntl();
	const shareTitleTwitter = `${
		isSuccess ? 'This' : 'Our'
	} project is raising funds in crypto on @givethio! 🙌
Donate directly on Ethereum Mainnet or @gnosischain w/ no fees or intermediaries.👇`;

	const shareTitleFacebookAndLinkedin = `${
		isSuccess ? 'This' : 'Our'
	} project is raising funds in crypto on @givethio!
	Donate directly on Ethereum Mainnet or Gnosis Chain with no fees or intermediaries.
	
	Here's the link to ${isSuccess ? 'this' : 'our'} project:
	`;

	const projectUrl = fullPath(slugToProjectView(slug));

	return (
		<Social isSuccess={isSuccess}>
			<BLead>
				{isSuccess
					? formatMessage({ id: 'label.share_this' })
					: formatMessage({ id: 'label.cant_donate' })}
			</BLead>
			<SocialItems>
				<SocialItem isSuccess={isSuccess}>
					<TwitterShareButton
						title={shareTitleTwitter}
						url={projectUrl || ''}
						hashtags={['Giveth']}
					>
						<Image
							src={'/images/social-tw.svg'}
							alt='twitter'
							width='44'
							height='44'
						/>
					</TwitterShareButton>
				</SocialItem>
				<SocialItem isSuccess={isSuccess}>
					<LinkedinShareButton
						title={shareTitleFacebookAndLinkedin}
						summary={description}
						url={projectUrl || ''}
					>
						<Image
							src={'/images/social-linkedin.svg'}
							alt='linked-in'
							width='44'
							height='44'
						/>
					</LinkedinShareButton>
				</SocialItem>
				<SocialItem isSuccess={isSuccess}>
					<FacebookShareButton
						quote={shareTitleFacebookAndLinkedin}
						url={projectUrl || ''}
						hashtag='#Giveth'
					>
						<Image
							src={'/images/social-fb.svg'}
							alt='facebook'
							width='44'
							height='44'
						/>
					</FacebookShareButton>
				</SocialItem>
			</SocialItems>
		</Social>
	);
};

const BLead = styled(Lead)`
	line-height: 30px;
	font-weight: 400;
	color: ${neutralColors.gray[900]};
	z-index: 2;
`;

const Social = styled.div<{ isSuccess?: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: ${props => (props.isSuccess ? '50px 0' : '18px 0')};
	color: ${neutralColors.gray[900]};
	align-items: center;
`;
const SocialItems = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: center;
	margin: 8px 0 0 0;
`;
const SocialItem = styled.div<{ isSuccess?: boolean }>`
	cursor: pointer;
	border-radius: 8px;
	padding: ${props => (props.isSuccess ? `0 6px` : '0 12px')};
	margin: ${props => (props.isSuccess ? `0 12px` : '0')};
`;

export default SocialBox;
