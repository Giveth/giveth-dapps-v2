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
import { IProject, ICause } from '@/apollo/types/types';
import {
	EContentType,
	EContentTypeCause,
	ESocialType,
	shareContentCreator,
	shareContentCreatorCause,
} from '@/lib/constants/shareContent';

import Warpcast from '../../public/images/icons/social-warpcast.svg';
import { slugToProjectView, slugToCauseView } from '@/lib/routeCreators';

interface ISocialBox {
	project?: IProject;
	cause?: ICause;
	contentType: EContentType | EContentTypeCause;
	isDonateFooter?: boolean;
	numberOfProjects?: number;
}

const SocialBox: FC<ISocialBox> = props => {
	const { project, cause, contentType, isDonateFooter } = props;
	const { formatMessage } = useIntl();

	if (!project && !cause) return null;

	let descriptionSummary: string = '';
	let slug: string = '';

	if (project) {
		descriptionSummary = project.descriptionSummary || '';
		slug = project.slug || '';
	} else if (cause) {
		descriptionSummary = cause.descriptionSummary || '';
		slug = cause.slug || '';
	}

	const entityUrl = fullPath(
		project ? slugToProjectView(slug) : slugToCauseView(slug),
	);

	const shareTitleTwitter = project
		? shareContentCreator(contentType as EContentType, ESocialType.twitter)
		: shareContentCreatorCause(
				contentType as EContentTypeCause,
				ESocialType.twitter,
				props.numberOfProjects ?? cause?.causeProjects?.length ?? 0,
			);

	const shareTitleFacebookAndLinkedin = project
		? shareContentCreator(contentType as EContentType, ESocialType.facebook)
		: shareContentCreatorCause(
				contentType as EContentTypeCause,
				ESocialType.facebook,
				props.numberOfProjects ?? cause?.causeProjects?.length ?? 0,
			);

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
						url={entityUrl}
						hashtags={['Giveth']}
					>
						<IconXSocial24 />
					</TwitterShareButton>
				</SocialItem>
				<SocialItem $isDonateFooter={isDonateFooter}>
					<LinkedinShareButton
						title={shareTitleFacebookAndLinkedin}
						summary={descriptionSummary}
						url={entityUrl}
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
					<FacebookShareButton url={entityUrl} hashtag='#Giveth'>
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
						href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`${shareTitleTwitter}\n\n${entityUrl}`)}`}
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
