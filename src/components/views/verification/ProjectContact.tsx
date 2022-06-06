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

export default function ProjectContact() {
	const [twitterUrl, setTwitterUrl] = useState('');
	const [facebookUrl, setFacebookUrl] = useState('');
	const [instagramUrl, setInstagramUrl] = useState('');
	const [youtubeUrl, setYoutubeUrl] = useState('');
	const [linkedinUrl, setLinkedinUrl] = useState('');

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
					<Button label='<     PREVIOUS' />
					<Button label='NEXT     >' />
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
