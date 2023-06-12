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
	Button,
	brandColors,
	neutralColors,
	IconExternalLink,
	IconTwitter,
	IconLinkedin,
	IconFacebook,
} from '@giveth/ui-design-system';
import { FC, useEffect } from 'react';
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
import { useAppDispatch } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import Routes from '@/lib/constants/Routes';

interface IShareRewardedModal extends IModal {
	projectHref: string;
	contentType: EContentType;
	projectTitle?: string;
	setReferral: () => void;
}

const ShareRewardedModal: FC<IShareRewardedModal> = props => {
	const {
		isSignedIn,
		isEnabled,
		userData: user,
	} = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const {
		projectHref,
		setShowModal,
		contentType,
		projectTitle,
		setReferral,
	} = props;
	const url = fullPath(
		slugToProjectView(projectHref + `?referrer_id=${user?.chainvineId}`),
	);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	const chainvineId = user?.chainvineId;
	const notSigned = !isEnabled || !isSignedIn;

	const shareTitleTwitter = shareContentCreator(
		contentType,
		ESocialType.twitter,
	);
	const shareTitleFacebookAndLinkedin = shareContentCreator(
		contentType,
		ESocialType.facebook,
	);

	const connectAndSignWallet = () => {
		dispatch(setShowSignWithWallet(true));
	};

	useEffect(() => {
		if (isSignedIn && !user?.chainvineId) {
			setReferral();
		}
	}, [isSignedIn]);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={GiftIcon} alt='gift icon' />}
			headerTitle={formatMessage({ id: 'label.share_and_earn_rewards' })}
			headerTitlePosition='left'
		>
			<Content>
				{notSigned
					? 'Connect your wallet and sign in to get your referral link and start earning.'
					: chainvineId &&
					  `Here’s your unique referral link to ${projectTitle}`}
			</Content>
			<Container>
				{notSigned ? (
					<Button
						label={formatMessage({
							id: !isEnabled
								? 'component.button.connect_wallet'
								: 'component.button.sign_in',
						})}
						onClick={connectAndSignWallet}
						buttonType='primary'
					/>
				) : (
					chainvineId && (
						<LinkContainer>
							<CopyLink url={url} />
						</LinkContainer>
					)
				)}
				<HowItWorksDiv>
					{chainvineId && (
						<SocialDiv gap={'16px'}>
							<SocialButtonContainer>
								<TwitterShareButton
									hashtags={['giveth']}
									title={shareTitleTwitter}
									url={url}
								>
									<IconTwitter />
								</TwitterShareButton>
								Share on Twitter
							</SocialButtonContainer>
							<SocialButtonContainer>
								<LinkedinShareButton
									title={shareTitleFacebookAndLinkedin}
									url={url}
								>
									<IconLinkedin />
								</LinkedinShareButton>
								Share on LinkedIn
							</SocialButtonContainer>
							<SocialButtonContainer>
								<FacebookShareButton
									hashtag='#giveth'
									quote={shareTitleFacebookAndLinkedin}
									url={url}
								>
									<IconFacebook />
								</FacebookShareButton>
								Share on Facebook
							</SocialButtonContainer>
						</SocialDiv>
					)}
					<B>
						How does this work?{'  '}
						<span>
							<a>
								<Link target='_blank' href={Routes.Referral}>
									Learn more
								</Link>{' '}
							</a>
							<IconExternalLink color={brandColors.pinky[500]} />
						</span>
					</B>
				</HowItWorksDiv>
			</Container>
		</Modal>
	);
};

const Container = styled(Flex)`
	padding: 24px;
	flex-direction: column;
	align-items: center;
`;

const Content = styled(B)`
	font-weight: 400;
	font-size: 16px;
	line-height: 150%;
	padding: 0 24px;
	margin: 26px 0 0 0;
	color: ${neutralColors.gray[800]};
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

const HowItWorksDiv = styled(Flex)`
	width: 100%;
	flex-direction: column;
	padding: 24px 0 0 0;
	margin: 24px 0 12px 0;
	align-items: center;
	justify-content: center;
	border-top: 1px solid ${neutralColors.gray[300]};
	color: ${neutralColors.gray[800]};
	text-align: center;
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
	max-width: 500px;
`;

const SocialDiv = styled(FlexCenter)`
	margin: 0 0 25px 0;
`;

export default ShareRewardedModal;
