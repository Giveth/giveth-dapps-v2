import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import {
	Button,
	H6,
	IconFacebook,
	IconInstagram,
	IconLink,
	IconLinkedin,
	IconTwitter,
	IconYoutube,
	neutralColors,
	P,
	IconInfoFilled,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { requiredOptions } from '@/lib/constants/regex';

import Input from '@/components/Input';
import { BtnContainer, ContentSeparator } from '../Common.sc';
import { useVerificationData } from '@/context/verification.context';
import { UPDATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import { client } from '@/apollo/apolloClient';
import { EVerificationSteps, IProjectContact } from '@/apollo/types/types';
import AddSocialModal from '@/components/views/verification/projectContact/AddSocialModal';
import { EMainSocials, IMainSocials } from './common.types';
import { OtherInput } from '@/components/views/verification/projectContact/common';
import { validators } from '@/lib/constants/regex';
import { OutlineStyled } from '@/components/views/verification/Common.sc';

export default function ProjectContactIndex() {
	const { verificationData, setVerificationData, setStep, isDraft } =
		useVerificationData();

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		setValue,
		getValues,
	} = useForm<IMainSocials>();
	const { formatMessage } = useIntl();

	const socials = verificationData?.projectContacts || [];

	const findOtherSocials = () => {
		return socials.filter(
			i => !(Object as any).values(EMainSocials).includes(i.name),
		);
	};

	const findMainSocials = () => {
		return socials.filter(i =>
			(Object as any).values(EMainSocials).includes(i.name),
		);
	};

	useEffect(() => {
		if (socials.length > 0) {
			const mainSocials = findMainSocials();
			mainSocials.forEach(i => setValue(i.name as EMainSocials, i.url));
		}
	}, [verificationData]);

	const [showSocialModal, setShowSocialModal] = useState(false);
	const [isOtherSocialChanged, setIsOtherSocialChanged] = useState(false);
	const [otherSocials, setOtherSocials] = useState<IProjectContact[]>(
		findOtherSocials(),
	);

	const createSocials = () => {
		const mainSocials: IProjectContact[] = [];
		Object.values(EMainSocials).forEach(i => {
			const url = getValues(i);
			if (url) mainSocials.push({ name: i, url });
		});
		return [...mainSocials, ...otherSocials];
	};

	const addOtherSocial = (i: IProjectContact) => {
		setOtherSocials([...otherSocials, i]);
		setIsOtherSocialChanged(true);
	};

	const removeOtherSocials = (name: string) => {
		const newOtherSocials = otherSocials.filter(i => i.name !== name);
		setOtherSocials(newOtherSocials);
		setIsOtherSocialChanged(true);
	};

	const handleNext = () => {
		async function sendReq() {
			const { data } = await client.mutate({
				mutation: UPDATE_PROJECT_VERIFICATION,
				variables: {
					projectVerificationUpdateInput: {
						projectVerificationId: Number(verificationData?.id),
						step: EVerificationSteps.PROJECT_CONTACTS,
						projectContacts: createSocials(),
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);
			setStep(5);
		}

		if (isOtherSocialChanged || isDirty) {
			sendReq().then();
		} else {
			setStep(5);
		}
	};

	return (
		<>
			<div>
				<H6 weight={700}>
					{formatMessage({ id: 'label.project_social_media' })}
				</H6>
				<InfoWrapper>
					<IconInfoFilled color={neutralColors.gray[900]} />
					<PInline>
						{formatMessage({
							id: 'label.please_provide_links_to_any_social_media',
						})}
					</PInline>
				</InfoWrapper>
				<PStyled>
					{formatMessage({ id: 'label.this_is_optional' })}
				</PStyled>
				<FormContainer onSubmit={handleSubmit(handleNext)}>
					{mainSocialsInputs.map(i => (
						<Input
							label={i.type}
							key={i.type}
							placeholder='https://'
							LeftIcon={i.icon}
							error={errors[i.type]}
							register={register}
							registerName={i.type}
							registerOptions={
								validators[
									i.type.toLowerCase() as keyof typeof validators
								]
							}
							disabled={!isDraft}
						/>
					))}
					{otherSocials.map(social => (
						<OtherInput
							key={social.name}
							label={social.name}
							url={social.url}
							remove={() => removeOtherSocials(social.name)}
							hideRemoveIcon={!isDraft}
						/>
					))}
					<br />
					{isDraft && (
						<OutlineStyled
							onClick={() => setShowSocialModal(true)}
							label={formatMessage({ id: 'label.add_other' })}
							buttonType='primary'
						/>
					)}
					<SocialLinkInfo>
						{formatMessage({
							id: 'label.in_order_to_ensure_that_you_are_a_representative',
						})}
					</SocialLinkInfo>
					<br />
					<Input
						label={formatMessage({
							id: 'label.link_to_your_giveth_project',
						})}
						placeholder='https://'
						LeftIcon={<IconLink color={neutralColors.gray[600]} />}
						error={errors['SocialLink']}
						register={register}
						registerName='SocialLink'
						registerOptions={isDraft ? requiredOptions.website : {}}
						disabled={!isDraft}
					/>

					<div>
						<ContentSeparator />
						<BtnContainer>
							<Button
								onClick={() => setStep(3)}
								label={`<     ${formatMessage({
									id: 'label.prev',
								})}`}
							/>
							<Button
								label={`${formatMessage({
									id: 'label.next',
								})}     >`}
								type='submit'
							/>
						</BtnContainer>
					</div>
				</FormContainer>
			</div>
			{showSocialModal && (
				<AddSocialModal
					addSocial={addOtherSocial}
					setShowModal={setShowSocialModal}
				/>
			)}
		</>
	);
}

const mainSocialsInputs = [
	{
		type: EMainSocials.Twitter,
		icon: <IconTwitter color={neutralColors.gray[600]} />,
	},
	{
		type: EMainSocials.Facebook,
		icon: <IconFacebook color={neutralColors.gray[600]} />,
	},
	{
		type: EMainSocials.LinkedIn,
		icon: <IconLinkedin color={neutralColors.gray[600]} />,
	},
	{
		type: EMainSocials.Instagram,
		icon: <IconInstagram color={neutralColors.gray[600]} />,
	},
	{
		type: EMainSocials.YouTube,
		icon: <IconYoutube color={neutralColors.gray[600]} />,
	},
	{
		type: EMainSocials.Website,
		icon: <IconLink color={neutralColors.gray[600]} />,
	},
];

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

const FormContainer = styled.form`
	> * {
		max-width: 520px;
	}
	> :last-child {
		max-width: 100%;
	}
`;

const SocialLinkInfo = styled(P)`
	max-width: fit-content;
`;
