import Image from 'next/image';
import { useIntl } from 'react-intl';
import {
	Button,
	H6,
	IconTwitter,
	Lead,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import DiscordIcon from '/public/images/icons/social/discord.svg';
import LinkedinIcon from '/public/images/icons/social/linkedin.svg';
import { ContentSeparator, BtnContainer } from './Common.sc';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_PROJECT_VERIFICATION,
	REMOVE_SOCIAL_MEDIA,
	SEND_NEW_SOCIAL_MEDIA,
} from '@/apollo/gql/gqlVerification';
import { RemoveButton } from './Common';
import { gToast, ToastType } from '@/components/toasts';
import { ISocialProfile } from '@/apollo/types/types';

const SocialProfile = () => {
	const { setStep } = useVerificationData();
	const { verificationData, setVerificationData, isDraft } =
		useVerificationData();
	const router = useRouter();
	const { formatMessage } = useIntl();

	const { slug } = router.query;

	const findSocialMedia = useCallback(
		(socialName: string): ISocialProfile | undefined => {
			const res = verificationData?.socialProfiles?.find(
				socialProfile => socialProfile.socialNetwork === socialName,
			);
			return res;
		},
		[verificationData],
	);

	const discordData = useMemo(
		() => findSocialMedia('discord'),
		[findSocialMedia],
	);

	const twitterData = useMemo(
		() => findSocialMedia('twitter'),
		[findSocialMedia],
	);

	const linkedinData = useMemo(
		() => findSocialMedia('linkedin'),
		[findSocialMedia],
	);

	async function handleSocialSubmit(
		socialNetwork: string,
		notAuthorized: boolean,
		id?: number,
	) {
		if (!isDraft) {
			gToast('Please wait until the project is verified', {
				type: ToastType.INFO_PRIMARY,
				position: 'top-center',
			});
			return;
		}
		if (notAuthorized) {
			if (id) {
				const res = await client.mutate({
					mutation: SEND_NEW_SOCIAL_MEDIA,
					variables: {
						socialNetwork,
						projectVerificationId: id,
					},
				});
				window.open(res.data.addNewSocialProfile, '_blank');
			}
		} else {
			gToast(`You already connected a ${socialNetwork} profile`, {
				type: ToastType.INFO_PRIMARY,
				position: 'top-center',
			});
		}
	}

	async function handleSocialRemove(id?: number) {
		if (!isDraft) {
			gToast('Please wait until the project is verified', {
				type: ToastType.INFO_PRIMARY,
				position: 'top-center',
			});
			return;
		}
		if (id) {
			await client.mutate({
				mutation: REMOVE_SOCIAL_MEDIA,
				variables: {
					socialProfileId: id,
				},
			});

			if (slug) {
				const { data } = await client.query({
					query: FETCH_PROJECT_VERIFICATION,
					variables: { slug },
				});
				setVerificationData(data.getCurrentProjectVerificationForm);
			}
		}
	}

	return (
		<>
			<div>
				<H6 weight={700}>
					{formatMessage({ id: 'label.personal_social_media' })}
				</H6>
				<br />
				<Lead>
					{formatMessage({
						id: 'label.connecting_your_social_media_is_a_good_way',
					})}
				</Lead>
				<Description>
					{formatMessage({ id: 'label.this_is_optional' })}
				</Description>
				<ButtonsSection>
					{/* <ButtonRow>
						<ButtonSocial color='#00ACEE'>
							<IconTwitter />
							@LAURENLUZ
						</ButtonSocial>
						<RemoveButton />
					</ButtonRow>
					<ButtonRow>
						<ButtonSocial color='#3B5998'>
							<Image src={FacebookIcon} alt='facebook icon' />
							@LAURENLUZ
						</ButtonSocial>
						<RemoveButton />
					</ButtonRow>
					<ButtonRow>
						<ButtonSocial color='#CD486B'>
							<Image src={InstagramIcon} alt='instagram icon' />
							@LAURENLUZ
						</ButtonSocial>
						<RemoveButton />
					</ButtonRow>
					<ButtonRow>
						<ButtonSocial color='#F7003B'>
							<Image src={YoutubeIcon} alt='youtube icon' />
							CONNECT TO YOUTUBE
						</ButtonSocial>
					</ButtonRow> */}
					<ButtonRow>
						<ButtonSocial
							color='#0077B5'
							onClick={() => {
								handleSocialSubmit(
									'twitter',
									twitterData === undefined,
									Number(verificationData?.id),
								);
							}}
						>
							<IconTwitter />
							{twitterData?.socialNetworkId ??
								`${formatMessage({
									id: 'label.connect_to',
								})} TWITTER`}
						</ButtonSocial>
						{twitterData?.socialNetworkId && (
							<RemoveButton
								onClick={() =>
									handleSocialRemove(+twitterData?.id)
								}
							/>
						)}
					</ButtonRow>
					<ButtonRow>
						<ButtonSocial
							color='#7700D5'
							onClick={() => {
								handleSocialSubmit(
									'discord',
									discordData === undefined,
									Number(verificationData?.id),
								);
							}}
						>
							<Image src={DiscordIcon} alt='discord icon' />
							{discordData?.socialNetworkId ??
								`${formatMessage({
									id: 'label.connect_to',
								})} DISCORD`}
						</ButtonSocial>
						{discordData?.socialNetworkId && (
							<RemoveButton
								onClick={() =>
									handleSocialRemove(+discordData?.id)
								}
							/>
						)}
					</ButtonRow>
					<ButtonRow>
						<ButtonSocial
							color='#0077B5'
							onClick={() => {
								handleSocialSubmit(
									'linkedin',
									linkedinData === undefined,
									Number(verificationData?.id),
								);
							}}
						>
							<Image src={LinkedinIcon} alt='linkedin icon' />
							{linkedinData?.name ??
								`${formatMessage({
									id: 'label.connect_to',
								})} LINKEDIN`}
						</ButtonSocial>
						{linkedinData?.name && (
							<RemoveButton
								onClick={() =>
									handleSocialRemove(+linkedinData?.id)
								}
							/>
						)}
					</ButtonRow>
				</ButtonsSection>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button
						onClick={() => setStep(1)}
						label={`<     ${formatMessage({ id: 'label.prev' })}`}
					/>
					<Button
						onClick={() => setStep(3)}
						label={`${formatMessage({ id: 'label.next' })}     >`}
					/>
				</BtnContainer>
			</div>
		</>
	);
};

const ButtonRow = styled(Flex)`
	gap: 8px;
`;

const ButtonsSection = styled.div`
	> div {
		margin-top: 24px;
	}
`;

const ButtonSocial = styled(FlexCenter)<{ color?: string }>`
	border-radius: 48px;
	background: white;
	height: 48px;
	box-shadow: ${Shadow.Giv[400]};
	color: ${props => props.color || 'inherit'};
	font-size: 12px;
	font-weight: 700;
	gap: 9px;
	width: fit-content;
	padding: 0 24px;
	cursor: pointer;
	text-transform: uppercase;
`;

const Description = styled(P)`
	display: flex;
	margin-top: 8px;
	align-items: center;
	gap: 10px;
	color: ${neutralColors.gray[700]};
	> :first-child {
		flex-shrink: 0;
	}
`;

export default SocialProfile;
