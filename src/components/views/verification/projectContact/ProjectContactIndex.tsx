import { useState } from 'react';

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
import Input, { IFormValidations } from '@/components/Input';
import { BtnContainer, ContentSeparator } from '../VerificationIndex';
import { useVerificationData } from '@/context/verification.context';
import { UPDATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import { client } from '@/apollo/apolloClient';
import {
	IProjectContact,
	PROJECT_VERIFICATION_STEPS,
} from '@/apollo/types/types';
import { OutlineStyled } from '@/components/views/verification/common.styled';
import AddSocialModal from '@/components/views/verification/projectContact/AddSocialModal';
import { EMainSocials } from '@/components/views/verification/common.types';
import { WebsiteInput } from '@/components/views/verification/projectContact/common';
import useFormValidation from '@/hooks/useFormValidation';
import { validators } from '@/lib/constants/regex';

export default function ProjectContactIndex() {
	const { verificationData, setVerificationData, setStep } =
		useVerificationData();

	const socials = verificationData?.projectContacts || [];

	const findMainSocialUrl = (name: EMainSocials) => {
		const foundSocial = socials.find(i => i.name === name);
		return foundSocial ? foundSocial.url : '';
	};

	const findOtherSocial = () => {
		return socials.filter(
			i => !(Object as any).values(EMainSocials).includes(i.name),
		);
	};

	const [twitterUrl, setTwitterUrl] = useState(
		findMainSocialUrl(EMainSocials.Twitter),
	);
	const [facebookUrl, setFacebookUrl] = useState(
		findMainSocialUrl(EMainSocials.Facebook),
	);
	const [instagramUrl, setInstagramUrl] = useState(
		findMainSocialUrl(EMainSocials.Instagram),
	);
	const [youtubeUrl, setYoutubeUrl] = useState(
		findMainSocialUrl(EMainSocials.YouTube),
	);
	const [linkedinUrl, setLinkedinUrl] = useState(
		findMainSocialUrl(EMainSocials.LinkedIn),
	);
	const [websiteUrl, setWebsiteUrl] = useState(
		findMainSocialUrl(EMainSocials.Website),
	);
	const [isChanged, setIsChanged] = useState(false);
	const [showSocialModal, setShowSocialModal] = useState(false);
	const [formValidation, setFormValidation] = useState<IFormValidations>();
	const [otherSocials, setOtherSocials] = useState<IProjectContact[]>(
		findOtherSocial(),
	);

	const isFormValid = useFormValidation(formValidation);

	const addSocial = (i: IProjectContact) => {
		setIsChanged(true);
		setOtherSocials([...otherSocials, i]);
	};

	const createSocials = () => {
		const newSocials = [...otherSocials];
		if (twitterUrl) {
			newSocials.push({
				name: EMainSocials.Twitter,
				url: twitterUrl,
			});
		}
		if (facebookUrl) {
			newSocials.push({
				name: EMainSocials.Facebook,
				url: facebookUrl,
			});
		}
		if (instagramUrl) {
			newSocials.push({
				name: EMainSocials.Instagram,
				url: instagramUrl,
			});
		}
		if (youtubeUrl) {
			newSocials.push({
				name: EMainSocials.YouTube,
				url: youtubeUrl,
			});
		}
		if (linkedinUrl) {
			newSocials.push({
				name: EMainSocials.LinkedIn,
				url: linkedinUrl,
			});
		}
		if (websiteUrl) {
			newSocials.push({
				name: EMainSocials.Website,
				url: websiteUrl,
			});
		}
		return newSocials;
	};

	const removeOtherSocials = (name: string) => {
		const index = otherSocials.findIndex(i => i.name === name);
		const newOtherSocials = [...otherSocials];
		setIsChanged(true);
		setOtherSocials(newOtherSocials.splice(index + 1, 1));
	};

	const handleNext = () => {
		async function sendReq() {
			const { data } = await client.mutate({
				mutation: UPDATE_PROJECT_VERIFICATION,
				variables: {
					projectVerificationUpdateInput: {
						projectVerificationId: Number(verificationData?.id),
						step: PROJECT_VERIFICATION_STEPS.PROJECT_CONTACTS,
						projectContacts: createSocials(),
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);
			setStep(5);
		}

		if (isChanged) {
			sendReq().then();
		} else {
			setStep(5);
		}
	};

	return (
		<>
			<div>
				<H6 weight={700}>Project Social Media</H6>
				<InfoWrapper>
					<IconInfo color={neutralColors.gray[900]} />
					<PInline>
						Connect your project's social media accounts to connect
						with your donors and build trust!
					</PInline>
				</InfoWrapper>
				<PStyled>This is optional</PStyled>
				<InputWrapper>
					<Input
						label='Twitter'
						placeholder='https://'
						value={twitterUrl}
						name='Twitter'
						onChange={e => {
							setIsChanged(true);
							setTwitterUrl(e.target.value);
						}}
						LeftIcon={
							<IconTwitter color={neutralColors.gray[600]} />
						}
						validators={[validators.twitter]}
						setFormValidation={setFormValidation}
					/>
					<Input
						label='Facebook'
						placeholder='https://'
						value={facebookUrl}
						name='Facebook'
						onChange={e => {
							setIsChanged(true);
							setFacebookUrl(e.target.value);
						}}
						LeftIcon={
							<IconFacebook color={neutralColors.gray[600]} />
						}
						validators={[validators.facebook]}
						setFormValidation={setFormValidation}
					/>
					<Input
						label='Linkedin'
						placeholder='https://'
						value={linkedinUrl}
						name='Linkedin'
						onChange={e => {
							setIsChanged(true);
							setLinkedinUrl(e.target.value);
						}}
						LeftIcon={
							<IconLinkedin color={neutralColors.gray[600]} />
						}
						validators={[validators.linkedIn]}
						setFormValidation={setFormValidation}
					/>
					<Input
						label='Instagram'
						placeholder='https://'
						value={instagramUrl}
						name='Instagram'
						onChange={e => {
							setIsChanged(true);
							setInstagramUrl(e.target.value);
						}}
						LeftIcon={
							<IconInstagram color={neutralColors.gray[600]} />
						}
						validators={[validators.instagram]}
						setFormValidation={setFormValidation}
					/>
					<Input
						label='Youtube'
						placeholder='https://'
						value={youtubeUrl}
						name='Youtube'
						onChange={e => {
							setIsChanged(true);
							setYoutubeUrl(e.target.value);
						}}
						LeftIcon={
							<IconYoutube color={neutralColors.gray[600]} />
						}
						validators={[validators.youtube]}
						setFormValidation={setFormValidation}
					/>
					<WebsiteInput
						url={websiteUrl}
						setUrl={url => {
							setIsChanged(true);
							setWebsiteUrl(url);
						}}
						setFormValidation={setFormValidation}
					/>
					{otherSocials.map(social => (
						<WebsiteInput
							key={social.name}
							label={social.name}
							url={social.url}
							remove={() => removeOtherSocials(social.name)}
						/>
					))}
					<br />
					<OutlineStyled
						onClick={() => setShowSocialModal(true)}
						label='ADD OTHER'
						buttonType='primary'
					/>
				</InputWrapper>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button onClick={() => setStep(3)} label='<     PREVIOUS' />
					<Button
						disabled={!isFormValid}
						onClick={() => handleNext()}
						label='NEXT     >'
					/>
				</BtnContainer>
			</div>
			{showSocialModal && (
				<AddSocialModal
					addSocial={addSocial}
					setShowModal={setShowSocialModal}
				/>
			)}
		</>
	);
}

const PStyled = styled(P)`
	color: ${neutralColors.gray[700]};
	margin: 8px 0 24px;
`;

const InfoWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 25px;
	> :first-child {
		flex-shrink: 0;
	}
`;

const PInline = styled(P)`
	display: inline;
	color: ${neutralColors.gray[900]};
`;

const InputWrapper = styled.div`
	max-width: 520px;
`;
