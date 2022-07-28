import React, { FC, useEffect, useState } from 'react';
import {
	brandColors,
	Button,
	Caption,
	H3,
	H4,
	H5,
	IconExternalLink,
	neutralColors,
	OulineButton,
} from '@giveth/ui-design-system';
import { useMutation } from '@apollo/client';
import { utils } from 'ethers';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { captureException } from '@sentry/nextjs';
import { FormProvider, useForm } from 'react-hook-form';

import {
	ACTIVATE_PROJECT,
	CREATE_PROJECT,
	UPDATE_PROJECT,
} from '@/apollo/gql/gqlProjects';
import { isAddressENS } from '@/lib/wallet';
import {
	ICategory,
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

import { compareAddresses, showToastError } from '@/lib/helpers';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { slugToProjectView } from '@/lib/routeCreators';
import { client } from '@/apollo/apolloClient';
import { Shadow } from '@/components/styled-components/Shadow';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';
// import useLeaveConfirm from '@/hooks/useLeaveConfirm';
import config from '@/configuration';
import Input, { InputSize } from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { titleValidation } from '@/components/views/create/helpers';
import CheckBox from '@/components/Checkbox';
import Guidelines from '@/components/views/create/Guidelines';
import useDetectDevice from '@/hooks/useDetectDevice';
import { Container } from '@/components/Grid';
import { setShowFooter } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

const { PRIMARY_NETWORK, SECONDARY_NETWORK } = config;
const ethereumId = PRIMARY_NETWORK.id;
const gnosisId = SECONDARY_NETWORK.id;

interface ICreateProjectProps {
	project?: IProjectEdition;
}

export enum EInputs {
	name = 'name',
	description = 'description',
	categories = 'categories',
	impactLocation = 'impactLocation',
	image = 'image',
	draft = 'draft',
	mainAddress = 'mainAddress',
	secondaryAddress = 'secondaryAddress',
}

export type TInputs = {
	[EInputs.name]: string;
	[EInputs.description]?: string;
	[EInputs.categories]?: ICategory[];
	[EInputs.impactLocation]?: string;
	[EInputs.image]?: string;
	[EInputs.draft]?: boolean;
	[EInputs.mainAddress]: string;
	[EInputs.secondaryAddress]: string;
};

const CreateProject: FC<ICreateProjectProps> = ({ project }) => {
	const [addProjectMutation] = useMutation(CREATE_PROJECT);
	const [editProjectMutation] = useMutation(UPDATE_PROJECT);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const isEditMode = !!project;
	const { title, description, categories, impactLocation, image, addresses } =
		project || {};
	const isDraft = project?.status.name === EProjectStatus.DRAFT;
	const defaultImpactLocation = impactLocation || '';

	const defaultMainAddress = addresses?.find(
		a => a.isRecipient && a.networkId === ethereumId,
	)?.address;
	const defaultSecondaryAddress = addresses?.find(
		a => a.isRecipient && a.networkId === gnosisId,
	)?.address;
	const isSameDefaultAddresses = compareAddresses(
		defaultMainAddress,
		defaultSecondaryAddress,
	);
	const userAddresses: string[] = [];
	if (isSameDefaultAddresses) userAddresses.push(defaultMainAddress!);
	else {
		if (defaultMainAddress) userAddresses.push(defaultMainAddress);
		if (defaultSecondaryAddress)
			userAddresses.push(defaultSecondaryAddress);
	}

	const formMethods = useForm<TInputs>({
		mode: 'onChange',
		defaultValues: {
			[EInputs.name]: title,
			[EInputs.description]: description,
			[EInputs.categories]: categories || [],
			[EInputs.impactLocation]: defaultImpactLocation,
			[EInputs.image]: image || '',
			[EInputs.mainAddress]: defaultMainAddress || '',
			[EInputs.secondaryAddress]: defaultSecondaryAddress || '',
		},
	});

	const {
		register,
		unregister,
		handleSubmit,
		formState: { errors: formErrors },
		setValue,
		watch,
	} = formMethods;

	const [watchName, watchDescription, watchCategories, watchImage] = watch([
		EInputs.name,
		EInputs.description,
		EInputs.categories,
		EInputs.image,
	]);

	const [creationSuccessful, setCreationSuccessful] = useState<IProject>();
	const [mainnetAddressActive, setMainnetAddressActive] = useState(
		isEditMode ? !!defaultMainAddress : true,
	);
	const [gnosisAddressActive, setGnosisAddressActive] = useState(
		isEditMode ? !!defaultSecondaryAddress : true,
	);
	const [isSameMainnetGnosisAddress, setIsSameMainnetGnosisAddress] =
		useState(isEditMode ? isSameDefaultAddresses : true);
	const [isLoading, setIsLoading] = useState(false);
	const [isTitleValidating, setIsTitleValidating] = useState(false);
	const [resolvedENS, setResolvedENS] = useState('');

	// useLeaveConfirm({ shouldConfirm: formChange });

	const noTitleValidation = (i: string) => isEditMode && title === i;

	const onSubmit = async (formData: TInputs) => {
		try {
			setIsLoading(true);
			const addresses = [];
			const {
				mainAddress,
				secondaryAddress,
				name,
				description,
				categories,
				impactLocation,
				image,
				draft,
			} = formData;

			if (isSameMainnetGnosisAddress) {
				const address = isAddressENS(mainAddress)
					? resolvedENS
					: mainAddress;
				const checksumAddress = utils.getAddress(address);
				addresses.push(
					{ address: checksumAddress, networkId: ethereumId },
					{ address: checksumAddress, networkId: gnosisId },
				);
			} else {
				if (mainnetAddressActive) {
					const address = isAddressENS(mainAddress)
						? resolvedENS
						: mainAddress;
					const checksumAddress = utils.getAddress(address);
					addresses.push({
						address: checksumAddress,
						networkId: ethereumId,
					});
				}
				if (gnosisAddressActive) {
					const checksumAddress = utils.getAddress(secondaryAddress);
					addresses.push({
						address: checksumAddress,
						networkId: gnosisId,
					});
				}
			}

			const projectData: IProjectCreation = {
				title: name,
				description: description!,
				impactLocation,
				categories: categories?.map(category => category.name),
				organisationId: 1,
				addresses,
				image,
				isDraft: draft,
			};

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

			if (isDraft && !draft) {
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
				if (draft) {
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

	useEffect(() => {
		dispatch(setShowFooter(false));
	}, []);

	const { isTablet, isMobile } = useDetectDevice();
	const isSmallScreen = isTablet || isMobile;

	if (creationSuccessful) {
		return <SuccessfulCreation project={creationSuccessful} />;
	}

	return (
		<Wrapper>
			<CreateContainer>
				<div>
					<Title>
						{isEditMode ? 'Project details' : 'Create a project'}
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
							size={InputSize.LARGE}
							value={watchName}
							isValidating={isTitleValidating}
							register={register}
							registerName={EInputs.name}
							registerOptions={{
								...requiredOptions.name,
								validate: async i => {
									if (noTitleValidation(i)) return true;
									setIsTitleValidating(true);
									const result = await titleValidation(i);
									setIsTitleValidating(false);
									return result;
								},
							}}
							error={formErrors[EInputs.name]}
						/>
						<br />
						<DescriptionInput
							value={watchDescription}
							setValue={e => setValue(EInputs.description, e)}
						/>
						<CategoryInput
							value={watchCategories}
							setValue={e => setValue(EInputs.categories, e)}
						/>
						<LocationIndex
							defaultValue={defaultImpactLocation}
							setValue={e => setValue(EInputs.impactLocation, e)}
						/>
						<ImageInput
							value={watchImage}
							setValue={e => setValue(EInputs.image, e)}
							setIsLoading={setIsLoading}
						/>
						<H5>Receiving funds</H5>
						<CaptionContainer>
							You can set a custom Ethereum address or ENS to
							receive donations.
						</CaptionContainer>
						<CheckBox
							onChange={setIsSameMainnetGnosisAddress}
							checked={isSameMainnetGnosisAddress}
							title='I’ll raise & receive funds on Mainnet and Gnosis Chain networks with the same address.'
						/>
						<WalletAddressInput
							networkId={ethereumId}
							sameAddress={isSameMainnetGnosisAddress}
							isActive={mainnetAddressActive}
							userAddresses={userAddresses}
							resolvedENS={resolvedENS}
							setResolvedENS={setResolvedENS}
							setIsActive={e => {
								if (!e && !gnosisAddressActive)
									return showToastError(
										'You must select at least one address',
									);
								if (!e) unregister(EInputs.mainAddress);
								setMainnetAddressActive(e);
							}}
						/>
						<WalletAddressInput
							networkId={gnosisId}
							sameAddress={isSameMainnetGnosisAddress}
							isActive={gnosisAddressActive}
							userAddresses={userAddresses}
							setResolvedENS={() => {}}
							setIsActive={e => {
								if (!e && !mainnetAddressActive)
									return showToastError(
										'You must select at least one address',
									);
								if (!e) unregister(EInputs.secondaryAddress);
								setGnosisAddressActive(e);
							}}
						/>
						<PublishTitle>
							{isEditMode
								? 'Publish edited project'
								: `Let's Publish!`}
						</PublishTitle>
						<PublishList>
							<li>
								{isEditMode ? 'Edited' : 'Newly published'}{' '}
								projects will be &quot;unlisted&quot; until
								reviewed by our team{isEditMode && ' again'}.
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
		</Wrapper>
	);
};

const CaptionContainer = styled(Caption)`
	margin-top: 8px;
	margin-bottom: 27px;
`;

const Wrapper = styled.div`
	max-width: ${deviceSize.laptopS + 'px'};
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

const CreateContainer = styled(Container)`
	margin-top: 104px;
	margin-bottom: 154px;
	max-width: 720px;
	> :nth-child(1) {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		flex-direction: column-reverse;
		${mediaQueries.tablet} {
			flex-direction: row;
		}
	}
	@media (max-width: ${deviceSize.mobileL + 'px'}) {
		padding-right: 16px;
		padding-left: 16px;
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
	margin-bottom: 48px;
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
