import React from 'react';
import Image from 'next/image';
import {
	FacebookShareButton,
	LinkedinShareButton,
	TwitterShareButton,
} from 'react-share';
import { Lead, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

const SocialBox = (props: any) => {
	const { project } = props;
	const shareTitle = `I am a Giver and you can be one too! 💙 @givethio. Let's Build the Future of Giving together! 🙌 🌈 #maketheworldabetterplace 🌏 💜`;
	const url = typeof window !== 'undefined' ? window?.location?.href : null;
	return (
		<Social isSuccess={props.isSuccess}>
			<BLead>
				{props?.isSuccess
					? 'Share this with your friends'
					: `Can't donate? Share this page instead.`}
			</BLead>
			<SocialItems>
				<SocialItem isSuccess={props.isSuccess}>
					<TwitterShareButton
						title={shareTitle}
						url={url || ''}
						hashtags={['Giveth']}
					>
						<Image
							src={'/images/social-tw.svg'}
							alt='tw'
							width='44px'
							height='44px'
						/>
					</TwitterShareButton>
				</SocialItem>
				<SocialItem isSuccess={props.isSuccess}>
					<LinkedinShareButton
						title={shareTitle}
						summary={project?.description}
						url={url || ''}
					>
						<Image
							src={'/images/social-linkedin.svg'}
							alt='lin'
							width='44px'
							height='44px'
						/>
					</LinkedinShareButton>
				</SocialItem>
				<SocialItem isSuccess={props.isSuccess}>
					<FacebookShareButton
						quote={shareTitle}
						url={url || ''}
						hashtag='#Giveth'
					>
						<Image
							src={'/images/social-fb.svg'}
							alt='fb'
							width='44px'
							height='44px'
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

const Social = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: ${(props: { isSuccess: boolean }) =>
		props.isSuccess ? 0 : '18px 0'};
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
const SocialItem = styled.div`
	cursor: pointer;
	border-radius: 8px;
	padding: ${(props: { isSuccess: boolean }) =>
		props.isSuccess ? `0 6px` : '0 12px'};
	margin: ${(props: { isSuccess: boolean }) =>
		props.isSuccess ? `0 12px` : '0'};
	border: ${(props: { isSuccess: boolean }) =>
		props.isSuccess ? `1px solid ${neutralColors.gray[400]}` : 'none'};
`;

export default SocialBox;
