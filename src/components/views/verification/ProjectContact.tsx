import { ChangeEvent, useState } from 'react';

import {
	Button,
	H6,
	IconFacebook,
	IconInfo,
	IconInstagram,
	IconLinkedin,
	IconTwitter,
	IconYoutube,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Input from '@/components/Input';
import { ContentSeparator, BtnContainer } from './VerificationIndex';
import { useVerificationData } from '@/context/verification.context';
import { UPDATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import { client } from '@/apollo/apolloClient';
import { PROJECT_VERIFICATION_STEPS } from '@/apollo/types/types';

export default function ProjectContact() {
	const { verificationData, setVerificationData, setStep } =
		useVerificationData();
	const { twitter, facebook, linkedin, instagram, youtube } =
		verificationData?.projectContacts || {};
	const [twitterUrl, setTwitterUrl] = useState(twitter || '');
	const [facebookUrl, setFacebookUrl] = useState(facebook || '');
	const [instagramUrl, setInstagramUrl] = useState(instagram || '');
	const [youtubeUrl, setYoutubeUrl] = useState(youtube || '');
	const [linkedinUrl, setLinkedinUrl] = useState(linkedin || '');
	const [isChanged, setIsChanged] = useState(false);

	const handleNext = () => {
		async function sendReq() {
			const { data } = await client.mutate({
				mutation: UPDATE_PROJECT_VERIFICATION,
				variables: {
					projectVerificationUpdateInput: {
						projectVerificationId: Number(verificationData?.id),
						step: PROJECT_VERIFICATION_STEPS.PROJECT_CONTACTS,
						projectContacts: {
							facebook: facebookUrl,
							instagram: instagramUrl,
							linkedin: linkedinUrl,
							twitter: twitterUrl,
							youtube: youtubeUrl,
						},
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);

			setStep(5);
		}

		if (isChanged) {
			sendReq();
		} else {
			setStep(5);
		}
	};

	return (
		<>
			<div>
				<H6 weight={700}>Project Social Media</H6>
				<br />
				<InfoWrapper>
					<IconInfoInline color={neutralColors.gray[700]} />
					<PInline>
						Please provide links to the social media accounts owned
						by the organization or project.
					</PInline>
				</InfoWrapper>
				<br />
				<InputWrapper>
					<Input
						label='Twitter'
						placeholder='https://'
						value={twitterUrl}
						name='Twitter'
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setIsChanged(true);
							setTwitterUrl(e.target.value);
						}}
						LeftIcon={
							<IconTwitter color={neutralColors.gray[600]} />
						}
					/>
					<Input
						label='Facebook'
						placeholder='https://'
						value={facebookUrl}
						name='Facebook'
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setIsChanged(true);
							setFacebookUrl(e.target.value);
						}}
						LeftIcon={
							<IconFacebook color={neutralColors.gray[600]} />
						}
					/>
					<Input
						label='Linkedin'
						placeholder='https://'
						value={linkedinUrl}
						name='Linkedin'
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setIsChanged(true);
							setLinkedinUrl(e.target.value);
						}}
						LeftIcon={
							<IconLinkedin color={neutralColors.gray[600]} />
						}
					/>
					<Input
						label='Instagram'
						placeholder='https://'
						value={instagramUrl}
						name='Instagram'
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setIsChanged(true);
							setInstagramUrl(e.target.value);
						}}
						LeftIcon={
							<IconInstagram color={neutralColors.gray[600]} />
						}
					/>
					<Input
						label='Youtube'
						placeholder='https://'
						value={youtubeUrl}
						name='Youtube'
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setIsChanged(true);
							setYoutubeUrl(e.target.value);
						}}
						LeftIcon={
							<IconYoutube color={neutralColors.gray[600]} />
						}
					/>
				</InputWrapper>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button onClick={() => setStep(3)} label='<     PREVIOUS' />
					<Button onClick={() => handleNext()} label='NEXT     >' />
				</BtnContainer>
			</div>
		</>
	);
}

const InfoWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

const IconInfoInline = styled(IconInfo)`
	display: inline;
`;
const PInline = styled(P)`
	display: inline;
	color: ${neutralColors.gray[700]};
`;
const InputWrapper = styled.div`
	width: 70%;
	max-width: 520px;
`;
