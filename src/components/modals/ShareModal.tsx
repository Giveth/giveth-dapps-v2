import {
	FacebookShareButton,
	TwitterShareButton,
	LinkedinShareButton,
} from 'react-share';
import Image from 'next/image';
import styled from 'styled-components';
import {
	brandColors,
	H5,
	IconXSocial18,
	Lead,
	neutralColors,
	OutlineButton,
	FlexCenter,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { FC } from 'react';

import Link from 'next/link';
import { Modal } from './Modal';
import FacebookIcon from '../../../public/images/social-fb.svg';
import LinkedinIcon from '../../../public/images/social-linkedin.svg';
import ShareIcon from '../../../public/images/icons/share_dots.svg';
import Warpcast from '../../../public/images/icons/social-warpcast.svg';
import { slugToCauseView, slugToProjectView } from '@/lib/routeCreators';
import { IModal } from '@/types/common';
import CopyLink from '@/components/CopyLink';
import { fullPath } from '@/lib/helpers';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import {
	EContentType,
	ESocialType,
	shareContentCreator,
	shareContentCreatorCause,
} from '@/lib/constants/shareContent';

interface IShareModal extends IModal {
	projectHref: string;
	contentType: EContentType;
	shareTitle?: string | undefined;
	shareDescription?: string | undefined;
	isCause?: boolean;
}

const ShareModal: FC<IShareModal> = props => {
	const {
		projectHref,
		setShowModal,
		contentType,
		shareTitle,
		shareDescription,
		isCause = false,
	} = props;
	const url = isCause
		? fullPath(slugToCauseView(projectHref))
		: fullPath(slugToProjectView(projectHref));
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	const shareTitleTwitter = isCause
		? shareContentCreatorCause(contentType, ESocialType.twitter)
		: shareContentCreator(contentType, ESocialType.twitter);
	const shareTitleFacebookAndLinkedin = isCause
		? shareContentCreatorCause(contentType, ESocialType.facebook)
		: shareContentCreator(contentType, ESocialType.facebook);

	const shareModalTitle = formatMessage({
		id: shareTitle || 'label.share_this',
	});

	const shareModalDesciption = shareDescription
		? formatMessage({ id: shareDescription })
		: null;

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={ShareIcon} alt='share icon' />}
			headerTitle={formatMessage({ id: 'label.share' })}
			headerTitlePosition='left'
		>
			<Container>
				<Subtitle weight={700}>{shareModalTitle}!</Subtitle>
				{shareModalDesciption && (
					<Description>{shareModalDesciption}</Description>
				)}
				<FlexCenter gap={'16px'}>
					<SocialButtonContainer>
						<TwitterShareButton
							hashtags={['giveth']}
							title={shareTitleTwitter}
							url={url}
						>
							<IconXSocial18 />
						</TwitterShareButton>
					</SocialButtonContainer>
					<SocialButtonContainer>
						<LinkedinShareButton
							title={shareTitleFacebookAndLinkedin}
							url={url}
						>
							<Image
								src={LinkedinIcon}
								alt='linkedin icon'
								width={41}
								height={41}
							/>
						</LinkedinShareButton>
					</SocialButtonContainer>
					<SocialButtonContainer>
						<FacebookShareButton hashtag='#giveth' url={url}>
							<Image
								src={FacebookIcon}
								alt='facebook icon'
								width={41}
								height={41}
							/>
						</FacebookShareButton>
					</SocialButtonContainer>
					<SocialButtonContainer>
						<Link
							href={`https://warpcast.com/~/compose?embeds[]=${url}&text=${shareTitleTwitter}`}
							target='_blank'
							className='warpcast-share-button'
						>
							<Image
								src={Warpcast}
								alt='warpcast icon'
								width={25}
								height={25}
							/>
						</Link>
					</SocialButtonContainer>
				</FlexCenter>
				<LeadText>
					{formatMessage({ id: 'label.or_copy_the_link' })}
				</LeadText>
				<CopyLink url={url} />
				<CustomOutlineButton
					buttonType='texty'
					size='small'
					label={formatMessage({ id: 'label.dismiss' })}
					onClick={closeModal}
				/>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	padding: 24px;
`;

const Subtitle = styled(H5)`
	color: ${brandColors.deep[900]};
	margin-bottom: 32px;
`;

const Description = styled(H5)`
	color: ${brandColors.deep[900]};
	margin-bottom: 42px;
	white-space: pre-line;
`;

const SocialButtonContainer = styled(FlexCenter)`
	height: 45px;
	width: 45px;
	border: 1px solid ${neutralColors.gray[400]} !important;
	border-radius: 8px;
	cursor: pointer;

	> * {
		height: 40px;
		width: 40px;
	}

	& .warpcast-share-button {
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;

const LeadText = styled(Lead)`
	margin: 16px 0;
	color: ${brandColors.deep[900]};
`;

const CustomOutlineButton = styled(OutlineButton)`
	text-transform: uppercase;
	font-weight: 700;
	border: none;
	color: ${brandColors.deep[100]};
	margin: 24px auto 0;
`;

export default ShareModal;
