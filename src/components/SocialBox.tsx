import React, { FC } from 'react';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import {
	FacebookShareButton,
	LinkedinShareButton,
	TwitterShareButton,
} from 'react-share';
import { IconXSocial24, Lead, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Link from 'next/link';
import { fullPath } from '@/lib/helpers';
import { IProject } from '@/apollo/types/types';
import { slugToProjectView } from '@/lib/routeCreators';
import {
	EContentType,
	ESocialType,
	shareContentCreator,
} from '@/lib/constants/shareContent';
import Warpcast from '../../public/images/icons/social-warpcast.svg';

interface ISocialBox {
	project: IProject;
	contentType: EContentType;
	isDonateFooter?: boolean;
}

const SocialBox: FC<ISocialBox> = props => {
	const { project, contentType, isDonateFooter } = props;
	const { descriptionSummary, slug } = project;
	const { formatMessage } = useIntl();

	const shareTitleTwitter = shareContentCreator(
		contentType,
		ESocialType.twitter,
	);
	const shareTitleFacebookAndLinkedin = shareContentCreator(
		contentType,
		ESocialType.facebook,
	);

	const projectUrl = fullPath(slugToProjectView(slug));

	return (
		<Social $isDonateFooter={isDonateFooter}>
			<BLead>
				{isDonateFooter
					? formatMessage({ id: 'label.cant_donate' })
					: formatMessage({ id: 'label.share_this' })}
			</BLead>
			<SocialItems>
				<SocialItem $isDonateFooter={isDonateFooter}>
					<TwitterShareButton
						title={shareTitleTwitter}
						url={projectUrl || ''}
						hashtags={['Giveth']}
					>
						<IconXSocial24 />
					</TwitterShareButton>
				</SocialItem>
				<SocialItem $isDonateFooter={isDonateFooter}>
					<LinkedinShareButton
						title={shareTitleFacebookAndLinkedin}
						summary={descriptionSummary}
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
				<SocialItem $isDonateFooter={isDonateFooter}>
					<FacebookShareButton
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
				<SocialItem $isDonateFooter={isDonateFooter}>
					<Link
						href={`https://warpcast.com/~/compose?embeds[]=${projectUrl}&text=${shareTitleTwitter}`}
						target='_blank'
					>
						<Image
							src={Warpcast}
							alt='warpcast icon'
							width={25}
							height={25}
						/>
					</Link>
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

const Social = styled.div<{ $isDonateFooter?: boolean }>`
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: ${props => (props.$isDonateFooter ? '18px 0' : '50px 0')};
	color: ${neutralColors.gray[900]};
	align-items: center;
`;
const SocialItems = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	justify-content: center;
	margin: 8px 0 0 0;
`;
const SocialItem = styled.div<{ $isDonateFooter?: boolean }>`
	cursor: pointer;
	border-radius: 8px;
	padding: ${props => (props.$isDonateFooter ? `0 12px` : '0 6px')};
	margin: ${props => (props.$isDonateFooter ? '0' : '0 12px')};
`;

export default SocialBox;
