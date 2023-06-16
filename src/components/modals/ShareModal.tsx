import {
	FacebookShareButton,
	TwitterShareButton,
	LinkedinShareButton,
} from 'react-share';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import {
	B,
	brandColors,
	neutralColors,
	IconExternalLink,
	IconTwitter,
	IconLinkedin,
	IconFacebook,
	mediaQueries,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';

import { Modal } from './Modal';
import GiftIcon from '../../../public/images/icons/gift.svg';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { slugToProjectView } from '@/lib/routeCreators';
import { IModal } from '@/types/common';
import CopyLink from '@/components/CopyLink';
import { fullPath } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import {
	EContentType,
	ESocialType,
	shareContentCreator,
} from '@/lib/constants/shareContent';
import Routes from '@/lib/constants/Routes';

interface IShareRewardedModal extends IModal {
	projectHref?: string;
	contentType: EContentType;
	projectTitle?: string;
}

const ShareModal: FC<IShareRewardedModal> = props => {
	const { userData: user } = useAppSelector(state => state.user);
	const { projectHref, setShowModal, contentType } = props;
	const chainvineId = user?.chainvineId!;
	const referral = chainvineId ? `?referrer_id=${chainvineId}` : '';
	const url = projectHref
		? fullPath(slugToProjectView(projectHref + referral))
		: fullPath(Routes.Projects + referral);

	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	const shareTitleTwitter = shareContentCreator(
		contentType,
		ESocialType.twitter,
	);
	const shareTitleFacebookAndLinkedin = shareContentCreator(
		contentType,
		ESocialType.facebook,
	);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={GiftIcon} alt='gift icon' />}
			headerTitle={formatMessage({ id: 'label.share_and_earn_rewards' })}
			headerTitlePosition='left'
		>
			<Container>
				<HowItWorksDiv topBorder={false}>
					<SocialTitle>
						{formatMessage({
							id: 'label.here_is_your_link',
						})}
					</SocialTitle>
					<LinkContainer>
						<CopyLink url={url} />
					</LinkContainer>
					<div>
						<SocialTitle>
							{formatMessage({
								id: 'label.share_on_social_media',
							})}
						</SocialTitle>
						<SocialDiv gap={'16px'}>
							<TwitterShareButton
								hashtags={['giveth']}
								title={shareTitleTwitter}
								url={url}
							>
								<SocialButtonContainer>
									<IconTwitter />
									{formatMessage({
										id: 'label.share_on_twitter',
									})}
								</SocialButtonContainer>
							</TwitterShareButton>
							<LinkedinShareButton
								title={shareTitleFacebookAndLinkedin}
								url={url}
							>
								<SocialButtonContainer>
									<IconLinkedin />
									{formatMessage({
										id: 'label.share_on_linkedin',
									})}
								</SocialButtonContainer>
							</LinkedinShareButton>
							<FacebookShareButton
								hashtag='#giveth'
								quote={shareTitleFacebookAndLinkedin}
								url={url}
							>
								<SocialButtonContainer>
									<IconFacebook />
									{formatMessage({
										id: 'label.share_on_facebook',
									})}
								</SocialButtonContainer>
							</FacebookShareButton>
						</SocialDiv>
					</div>
					<HowItWorksContent>
						<Body>
							{formatMessage({ id: 'label.how_does_this_work' })}
						</Body>
						<span>
							<a>
								<Link target='_blank' href={Routes.Referral}>
									{formatMessage({ id: 'label.learn_more' })}
								</Link>{' '}
							</a>
							<IconExternalLink color={brandColors.pinky[500]} />
						</span>
					</HowItWorksContent>
				</HowItWorksDiv>
			</Container>
		</Modal>
	);
};

const Container = styled(Flex)`
	width: 606px;
	padding: 24px;
	flex-direction: column;
	align-items: center;
`;

const SocialTitle = styled(B)`
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
	color: ${neutralColors.gray[700]};
	text-align: left;
	margin: 0 0 16px 0;
`;

const SocialButtonContainer = styled(FlexCenter)`
	height: 45px;
	width: 100%;
	min-width: 175px;
	cursor: pointer;
	color: ${brandColors.pinky[500]};
	gap: 12px;
	font-weight: 500;
	font-size: 12px;
	line-height: 16px;

	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 48px;
`;

const HowItWorksDiv = styled(Flex)<{ topBorder: boolean }>`
	width: 100%;
	flex-direction: column;
	padding: ${props => (props.topBorder ? '24px 0 0 0' : '0')};
	margin: ${props => (props.topBorder ? '24px 0 0 0' : '0')};
	border-top: ${props =>
		props.topBorder ? `1px solid ${neutralColors.gray[300]}` : null};
	color: ${neutralColors.gray[800]};
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
	span {
		cursor: pointer;
	}
	a {
		color: ${brandColors.pinky[500]};
	}
`;

const LinkContainer = styled(Flex)`
	width: 100%;
	margin: 0 0 24px 0;
	min-height: 130px;
	${mediaQueries.tablet} {
		min-height: 80px;
	}
`;

const SocialDiv = styled(FlexCenter)`
	margin: 0 0 25px 0;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const Body = styled(B)`
	color: ${neutralColors.gray[800]};
	font-weight: 400;
`;

const HowItWorksContent = styled(Flex)`
	justify-content: center;
	align-items: center;
	gap: 8px;
	span {
		display: flex;
		gap: 2px;
		align-items: center;
	}
`;

export default ShareModal;
