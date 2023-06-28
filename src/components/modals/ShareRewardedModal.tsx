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
	IconAlertTriangleOutline,
	mediaQueries,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { Modal } from './Modal';
import GiftIcon from '../../../public/images/icons/gift.svg';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { slugToProjectView } from '@/lib/routeCreators';
import { IModal } from '@/types/common';
import CopyLink from '@/components/CopyLink';
import { fullPath } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import { startChainvineReferral } from '@/features/user/user.thunks';
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
	projectHref?: string;
	contentType: EContentType;
	projectTitle?: string;
}

function getMessageWithBoldText(
	_message: string,
	targetString?: string,
): React.ReactNode {
	let message = _message;
	if (targetString) {
		message = message.replaceAll(
			targetString,
			`<strong>${targetString}</strong>`,
		);
	}
	const parts = message.split(/(<strong>.*?<\/strong>)/g);
	return parts.map((part, index) => {
		if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
			const text = part.replace(/<\/?strong>/g, '');
			console.log({ text });

			return <strong key={index}>{text}</strong>;
		}
		console.log({ part });

		return part;
	});
}

const ShareRewardedModal: FC<IShareRewardedModal> = props => {
	const {
		isSignedIn,
		isEnabled,
		userData: user,
	} = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const { projectHref, setShowModal, contentType, projectTitle } = props;
	const url = projectHref
		? fullPath(
				slugToProjectView(
					projectHref + `?referrer_id=${user?.chainvineId}`,
				),
		  )
		: fullPath(Routes.Projects + `?referrer_id=${user?.chainvineId}`);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const [error, setError] = useState(false);
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

	const setReferral = async () => {
		try {
			await dispatch(
				startChainvineReferral({
					address: user?.walletAddress!,
				}),
			);
			setError(false);
		} catch (error) {
			setError(true);
		}
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
			headerIcon={
				error ? (
					<IconAlertTriangleOutline size={32} />
				) : (
					<Image src={GiftIcon} alt='gift icon' />
				)
			}
			headerTitle={
				error
					? 'Oops'
					: formatMessage({ id: 'label.share_and_earn_rewards' })
			}
			headerTitlePosition='left'
		>
			<Content>
				{error
					? formatMessage({
							id: 'label.we_ran_into_an_issue_and_couldnt_generate_your_referral',
					  })
					: notSigned
					? getMessageWithBoldText(
							formatMessage({
								id: 'label.connet_your_wallet_and_sign_in_to_get_your_referral',
							}),
					  )
					: chainvineId && projectTitle
					? getMessageWithBoldText(
							formatMessage(
								{
									id: 'label.heres_your_referral',
								},
								{ projectTitle },
							),
							projectTitle,
					  )
					: chainvineId && (
							<>
								{formatMessage({
									id: 'label.heres_your_unique_referral',
								})}
								<br />
								{formatMessage({
									id: 'label.share_your_unique_link_to_get_started',
								})}
							</>
					  )}
			</Content>
			<Container>
				{error ? (
					<ConnectButton
						label={formatMessage({
							id: 'label.create_referrral_id_again',
						})}
						onClick={() => setReferral()}
						buttonType='primary'
					/>
				) : notSigned ? (
					<ConnectButton
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
				<HowItWorksDiv
					topBorder={
						error ? false : isSignedIn && chainvineId ? false : true
					}
				>
					{isSignedIn && chainvineId && (
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
					)}
					{!error && (
						<HowItWorksContent>
							<Body>
								{formatMessage({
									id: 'label.how_does_this_work',
								})}
							</Body>
							<span>
								<a>
									<Link
										target='_blank'
										href={Routes.Referral}
									>
										{formatMessage({
											id: 'label.learn_more',
										})}
									</Link>{' '}
								</a>
								<IconExternalLink
									color={brandColors.pinky[500]}
								/>
							</span>
						</HowItWorksContent>
					)}
				</HowItWorksDiv>
			</Container>
		</Modal>
	);
};

const Container = styled(Flex)`
	width: 100%;
	padding: 24px;
	flex-direction: column;
	align-items: center;
	${mediaQueries.tablet} {
		width: 606px;
	}
`;

const Content = styled(B)`
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
	padding: 0 24px;
	margin: 26px 0 0 0;
	color: ${neutralColors.gray[800]};
	text-align: left;
`;

const ConnectButton = styled(Button)`
	width: 250px;
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

export default ShareRewardedModal;
