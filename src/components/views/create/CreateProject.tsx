import React, { FC, useState } from 'react';
import {
	brandColors,
	Button,
	Caption,
	H3,
	H4,
	IconExternalLink,
	neutralColors,
	OulineButton,
	H5,
} from '@giveth/ui-design-system';
import { useMutation } from '@apollo/client';
import { utils } from 'ethers';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { captureException } from '@sentry/nextjs';
import { useForm, FormProvider } from 'react-hook-form';

import {
	ACTIVATE_PROJECT,
	CREATE_PROJECT,
	UPDATE_PROJECT,
} from '@/apollo/gql/gqlProjects';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import {
	IProject,
	IProjectCreation,
	IProjectEdition,
} from '@/apollo/types/types';
import {
	CategoryInput,
	DescriptionInput,
	ImageInput,
	LocationIndex,
	WalletAddressInput,
} from './Inputs';
import SuccessfulCreation from './SuccessfulCreation';

import { showToastError } from '@/lib/helpers';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { slugToProjectView } from '@/lib/routeCreators';
import { client } from '@/apollo/apolloClient';
import { Shadow } from '@/components/styled-components/Shadow';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';
// import useLeaveConfirm from '@/hooks/useLeaveConfirm';
import config from '@/configuration';
import Input from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { titleValidation } from '@/components/views/create/helpers';
import CheckBox from '@/components/Checkbox';
import Guidelines from '@/components/views/create/Guidelines';
import useDetectDevice from '@/hooks/useDetectDevice';

const { PRIMARY_NETWORK, SECONDARY_NETWORK } = config;
const ethereumId = PRIMARY_NETWORK.id;
const gnosisId = SECONDARY_NETWORK.id;

export enum ECreateErrFields {
	NAME = 'name',
	DESCRIPTION = 'description',
	MAIN_WALLET_ADDRESS = 'mainWalletAddress',
	SECONDARY_WALLET_ADDRESS = 'secondaryWalletAddress',
}

export interface ICreateProjectErrors {
	[ECreateErrFields.NAME]: string;
	[ECreateErrFields.DESCRIPTION]: string;
	[ECreateErrFields.MAIN_WALLET_ADDRESS]: string;
	[ECreateErrFields.SECONDARY_WALLET_ADDRESS]: string;
}

interface ICreateProjectProps {
	project?: IProjectEdition;
}

export enum EInputs {
	name = 'name',
	description = 'description',
	draft = 'draft',
	mainAddress = 'mainAddress',
	secondaryAddress = 'secondaryAddress',
}

export type TInputs = {
	[EInputs.name]: string;
	[EInputs.draft]?: boolean;
	[EInputs.description]?: string;
	[EInputs.mainAddress]: string;
	[EInputs.secondaryAddress]: string;
};

const CreateProject: FC<ICreateProjectProps> = ({ project }) => {
	const { library } = useWeb3React();
	const [addProjectMutation] = useMutation(CREATE_PROJECT);
	const [editProjectMutation] = useMutation(UPDATE_PROJECT);
	const router = useRouter();
	const formMethods = useForm<TInputs>();

	const {
		register,
		handleSubmit,
		formState: { errors: formErrors },
		setValue,
		getValues,
		watch,
	} = formMethods;

	const watchName = watch(EInputs.name);

	const isEditMode = !!project;
	const isDraft = project?.status.name === EProjectStatus.DRAFT;
	const defaultImpactLocation = project?.impactLocation || '';

	const [creationSuccessful, setCreationSuccessful] = useState<IProject>();
	const [categories, setCategories] = useState(project?.categories || []);
	const [image, setImage] = useState(project?.image || '');
	const [isMainnetGnosisAddEqual, setIsMainnetGnosisAddEqual] =
		useState(true);

	const defaultMainAddress = project?.addresses?.find(
		a => a.networkId === ethereumId,
	)?.address;
	const defaultSecondaryAddress = project?.addresses?.find(
		a => a.networkId === gnosisId,
	)?.address;

	const [isLoading, setIsLoading] = useState(false);
	const [impactLocation, setImpactLocation] = useState(
		project?.impactLocation || '',
	);

	// useLeaveConfirm({ shouldConfirm: formChange });

	const onSubmit = async (formData: TInputs) => {
		try {
			console.log('formData', formData);
			const { mainAddress, secondaryAddress, name, description } =
				formData;
			const mainAddressValidated = isAddressENS(mainAddress)
				? await getAddressFromENS(mainAddress, library)
				: mainAddress;

			const projectData: IProjectCreation = {
				title: name,
				description: description!,
				impactLocation,
				categories: categories.map(category => category.name),
				organisationId: 1,
				addresses: [
					{
						address: utils.getAddress(mainAddressValidated),
						networkId: ethereumId,
					},
					{
						address: utils.getAddress(secondaryAddress),
						networkId: gnosisId,
					},
				],
				image,
				isDraft: formData[EInputs.draft],
			};

			setIsLoading(true);

			const addedProject = isEditMode
				? await editProjectMutation({
						variables: {
							newProjectData: projectData,
							projectId: parseFloat(project.id as string),
						},
				  })
				: await addProjectMutation({
						variables: {
							project: { ...projectData },
						},
				  });

			if (isDraft && !formData[EInputs.draft]) {
				await client.mutate({
					mutation: ACTIVATE_PROJECT,
					variables: { projectId: Number(project.id) },
				});
			}

			if (addedProject) {
				// Success
				setIsLoading(false);
				const _project = isEditMode
					? addedProject.data?.updateProject
					: addedProject.data?.createProject;
				if (formData[EInputs.draft]) {
					await router.push(slugToProjectView(_project.slug));
				} else {
					if (!isEditMode || (isEditMode && isDraft)) {
						setCreationSuccessful(_project);
					} else {
						await router.push(slugToProjectView(_project.slug));
					}
				}
			}
		} catch (e) {
			setIsLoading(false);
			showToastError(e);
			captureException(e, {
				tags: {
					section: 'CreateProjectSubmit',
				},
			});
		}
	};

	const { isTablet, isMobile } = useDetectDevice();
	const isSmallScreen = isTablet || isMobile;

	if (creationSuccessful) {
		return <SuccessfulCreation project={creationSuccessful} />;
	}

	return (
		<Container>
			<CreateContainer>
				<div>
					<Title>
						{isEditMode ? 'Project details' : 'Create a Project'}
					</Title>
					{isSmallScreen && (
						<GuidelinesStyleTablet>
							<Guidelines />
						</GuidelinesStyleTablet>
					)}
				</div>

				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Input
							label='Project name'
							placeholder='My First Project'
							maxLength={55}
							value={watchName}
							register={register}
							registerName={EInputs.name}
							registerOptions={{
								...requiredOptions.name,
								validate: titleValidation,
							}}
							error={formErrors[EInputs.name]}
						/>
						<br />
						<DescriptionInput
							value={getValues(EInputs.description)}
							setValue={e => setValue(EInputs.description, e)}
						/>
						<CategoryInput
							value={categories}
							setValue={category => setCategories(category)}
						/>
						<LocationIndex
							defaultValue={defaultImpactLocation}
							setValue={location => setImpactLocation(location)}
						/>
						<ImageInput
							value={image}
							setValue={img => setImage(img)}
							setIsLoading={setIsLoading}
						/>
						<H5>Receiving funds</H5>
						<CaptionContainer>
							You can set a custom Ethereum address or ENS to
							receive donations.
						</CaptionContainer>
						<CheckBox
							onChange={setIsMainnetGnosisAddEqual}
							checked={isMainnetGnosisAddEqual}
							title='I’ll raise & receive funds on Mainnet and Gnosis chain networks'
						/>
						<WalletAddressInput
							defaultValue={defaultMainAddress}
							networkId={ethereumId}
							equalAddress={isMainnetGnosisAddEqual}
						/>
						{!isMainnetGnosisAddEqual && (
							<WalletAddressInput
								defaultValue={defaultSecondaryAddress}
								networkId={gnosisId}
							/>
						)}
						<PublishTitle>
							{isEditMode
								? 'Publish edited project'
								: `Let's Publish!`}
						</PublishTitle>
						<PublishList>
							<li>
								{isEditMode ? 'Edited' : 'Newly published'}{' '}
								projects will be &quot;unlisted&quot; until
								reviewed by our team {isEditMode && 'again'}.
							</li>
							<li>
								You can still access your project from your
								account and share it with your friends via the
								project link!
							</li>
							<li>
								You&apos;ll receive an email from us once your
								project is listed.
							</li>
						</PublishList>
						<Buttons>
							{(!isEditMode || isDraft) && (
								<OulineButton
									label='PREVIEW '
									buttonType='primary'
									disabled={isLoading}
									icon={<IconExternalLink size={16} />}
									type='submit'
									onClick={() =>
										setValue(EInputs.draft, true)
									}
								/>
							)}
							<Button
								label='PUBLISH'
								buttonType='primary'
								type='submit'
								disabled={isLoading}
							/>
							{isEditMode && (
								<OulineButton
									onClick={() => router.back()}
									label='CANCEL'
									buttonType='primary'
								/>
							)}
						</Buttons>
					</form>
				</FormProvider>
			</CreateContainer>
			{!isSmallScreen && (
				<GuidelinesStyleLaptop>
					<Guidelines />
				</GuidelinesStyleLaptop>
			)}
		</Container>
	);
};

const CaptionContainer = styled(Caption)`
	margin-top: 8px;
	margin-bottom: 27px;
`;

const Container = styled.div`
	max-width: ${deviceSize.desktop + 'px'};
	margin: 0 auto;
	position: relative;
	display: flex;
`;

const GuidelinesStyle = styled.div`
	> div {
		display: flex;
		height: 87px;
		align-items: center;
		gap: 20px;
		padding: 28px 35px 28px 28px;
		border-radius: 8px;
		box-shadow: ${Shadow.Dark[500]};
		position: relative;
		cursor: pointer;
		margin-bottom: 20px;

		> h6 {
			font-weight: 700;
		}
	}
`;

const GuidelinesStyleTablet = styled(GuidelinesStyle)`
	display: flex;
`;

const GuidelinesStyleLaptop = styled(GuidelinesStyle)`
	display: flex;
	> div {
		position: sticky;
		top: 104px;
	}
`;

const CreateContainer = styled.div`
	margin: 104px 42px 154px 40px;

	${mediaQueries.desktop} {
		margin-left: 264px;
		width: ${deviceSize.desktop / 2 + 'px'};
	}
	${mediaQueries.laptopL} {
		margin-left: 134px;
		width: ${(deviceSize.laptopL * 7) / 12 + 'px'};
	}
	${mediaQueries.laptopS} {
		width: ${(deviceSize.laptopS * 8) / 12 + 'px'};
	}

	> :nth-child(1) {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		align-items: center;

		> h3 {
			margin-bottom: 20px;
		}
	}
`;

const Buttons = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10px;
	margin: 61px 0 32px 0;
	button {
		width: 100%;
		max-width: 320px;
	}
`;

const Title = styled(H3)`
	color: ${brandColors.deep[600]};
	font-weight: bold;
`;

const PublishTitle = styled(H4)`
	margin: 45px 0 24px 0;
	color: ${brandColors.deep[900]};
	font-weight: bold;
`;

const PublishList = styled(Caption)`
	color: ${neutralColors.gray[900]};
`;

export default CreateProject;
