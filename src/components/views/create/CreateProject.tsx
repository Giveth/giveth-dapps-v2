import React, { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	brandColors,
	Button,
	Caption,
	Col,
	Container,
	H3,
	H4,
	H5,
	IconExternalLink,
	neutralColors,
	OutlineButton,
	Row,
} from '@giveth/ui-design-system';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { captureException } from '@sentry/nextjs';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import {
	ACTIVATE_PROJECT,
	CREATE_PROJECT,
	UPDATE_PROJECT,
} from '@/apollo/gql/gqlProjects';
import {
	EProjectSocialMediaType,
	IProject,
	IProjectCreation,
	IProjectEdition,
	IProjectSocialMedia,
} from '@/apollo/types/types';
import {
	CategoryInput,
	DescriptionInput,
	ImageInput,
	LocationIndex,
} from './Inputs';
import { showToastError } from '@/lib/helpers';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { slugToProjectView, slugToSuccessView } from '@/lib/routeCreators';
import { client } from '@/apollo/apolloClient';
import config, { isRecurringActive } from '@/configuration';
import { setShowFooter, setShowHeader } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';
import NameInput from '@/components/views/create/NameInput';
import CreateProjectAddAddressModal from './CreateProjectAddAddressModal';
import AddressInterface from './AddressInterface';
import { ChainType, NonEVMChain } from '@/types/config';
import StorageLabel from '@/lib/localStorage';
import AlloProtocolModal from './AlloProtocol/AlloProtocolModal';
import { ECreateProjectSections, TInputs, EInputs } from './types';
import { ProGuide } from './proGuide/ProGuide';
import { EQualityState } from './proGuide/score/scoreHelpers';
import { LowScoreModal } from './LowScoreModal';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import SocialMedias from './SocialMediaBox/SocialMedias';
import { CreateHeader } from './CreateHeader';

const ALL_CHAINS = config.CHAINS;

interface ICreateProjectProps {
	project?: IProjectEdition;
}

const CreateProject: FC<ICreateProjectProps> = ({ project }) => {
	const [quality, setQuality] = useState(EQualityState.LOW);
	const [isLoading, setIsLoading] = useState(false);
	const [addedProjectState, setAddedProjectState] = useState<IProject>();
	const [showAlloProtocolModal, setShowAlloProtocolModal] = useState(false);
	const [addressModalChainId, setAddressModalChainId] = useState<number>();
	const [addressModalChainType, setAddressModalChainType] =
		useState<ChainType>();
	const [activeProjectSection, setActiveProjectSection] =
		useState<ECreateProjectSections>(ECreateProjectSections.default);
	const [showLowScoreModal, setShowLowScoreModal] = useState(false);

	const { formatMessage } = useIntl();
	const [addProjectMutation] = useMutation(CREATE_PROJECT);
	const [editProjectMutation] = useMutation(UPDATE_PROJECT);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const publishOnMediumQuality = useRef(false);

	useEffect(() => {
		dispatch(setShowHeader(false));
		dispatch(setShowFooter(false));
		return () => {
			dispatch(setShowHeader(true));
			dispatch(setShowFooter(true));
		};
	}, [dispatch]);

	const isEditMode = !!project;

	let storageProjectData: TInputs | undefined;

	if (!isEditMode) {
		const storedProject = localStorage.getItem(
			StorageLabel.CREATE_PROJECT_FORM,
		);
		if (storedProject) {
			storageProjectData = JSON.parse(storedProject);
		}
	}

	const { title, description, categories, impactLocation, image, addresses } =
		project || {};

	const findSocialMedia = (type: EProjectSocialMediaType) => {
		return project?.socialMedia?.find(
			(socialMedia: IProjectSocialMedia) => socialMedia.type === type,
		);
	};

	const {
		name: storageTitle,
		description: storageDescription,
		categories: storageCategories,
		impactLocation: storageImpactLocation,
		image: storageImage,
		alloProtocolRegistry: storageAlloProtocolRegistry,
		facebook: storageFacebook,
		x: storageX,
		instagram: storageInstagram,
		youtube: storageYoutube,
		linkedin: storageLinkedin,
		reddit: storageReddit,
		discord: storageDiscord,
		farcaster: storageFarcaster,
		lens: storageLens,
		website: storageWebsite,
	} = storageProjectData || {};
	const storageAddresses =
		storageProjectData?.addresses instanceof Array
			? storageProjectData.addresses
			: [];

	const isDraft = project?.status.name === EProjectStatus.DRAFT;
	const defaultImpactLocation = impactLocation || '';
	const activeAddresses =
		addresses
			?.filter(a => a.isRecipient)
			.map(a => {
				const _a = { ...a };
				delete _a.isRecipient;
				return _a;
			}) || [];

	const userUniqueAddresses = [
		...new Set(activeAddresses.map(a => a.address!)),
	];

	const formMethods = useForm<TInputs>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		defaultValues: {
			[EInputs.name]: title || storageTitle,
			[EInputs.description]: description || storageDescription || '',
			[EInputs.categories]: categories || storageCategories || [],
			[EInputs.impactLocation]:
				defaultImpactLocation || storageImpactLocation,
			[EInputs.image]: image || storageImage || '',
			[EInputs.alloProtocolRegistry]: isEditMode
				? false //Should change to backend data when the backend is ready
				: storageAlloProtocolRegistry,
			[EInputs.addresses]: isEditMode
				? activeAddresses
				: storageAddresses,
			[EInputs.facebook]:
				findSocialMedia(EProjectSocialMediaType.FACEBOOK)?.link ||
				storageFacebook ||
				'',
			[EInputs.x]:
				findSocialMedia(EProjectSocialMediaType.X)?.link ||
				storageX ||
				'',
			[EInputs.instagram]:
				findSocialMedia(EProjectSocialMediaType.INSTAGRAM)?.link ||
				storageInstagram ||
				'',
			[EInputs.youtube]:
				findSocialMedia(EProjectSocialMediaType.YOUTUBE)?.link ||
				storageYoutube ||
				'',
			[EInputs.linkedin]:
				findSocialMedia(EProjectSocialMediaType.LINKEDIN)?.link ||
				storageLinkedin ||
				'',
			[EInputs.reddit]:
				findSocialMedia(EProjectSocialMediaType.REDDIT)?.link ||
				storageReddit ||
				'',
			[EInputs.discord]:
				findSocialMedia(EProjectSocialMediaType.DISCORD)?.link ||
				storageDiscord ||
				'',
			[EInputs.farcaster]:
				findSocialMedia(EProjectSocialMediaType.FARCASTER)?.link ||
				storageFarcaster ||
				'',
			[EInputs.lens]:
				findSocialMedia(EProjectSocialMediaType.LENS)?.link ||
				storageLens ||
				'',
			[EInputs.website]:
				findSocialMedia(EProjectSocialMediaType.WEBSITE)?.link ||
				storageWebsite ||
				'',
		},
	});

	const { handleSubmit, setValue, watch, getFieldState } = formMethods;

	const data = watch();
	const {
		name: watchName,
		description: watchDescription,
		categories: watchCategories,
		image: watchImage,
		impactLocation: watchImpactLocation,
		addresses: watchAddresses,
		alloProtocolRegistry: watchAlloProtocolRegistry,
		facebook: watchFacebook,
		x: watchX,
		instagram: watchInstagram,
		youtube: watchYoutube,
		linkedin: watchLinkedIn,
		reddit: watchReddit,
		discord: watchDiscord,
		farcaster: watchFarcaster,
		lens: watchLens,
		website: watchWebsite,
		draft: watchDraft,
	} = data;

	useEffect(() => {
		if (isEditMode) return;
		localStorage.setItem(
			StorageLabel.CREATE_PROJECT_FORM,
			JSON.stringify(data),
		);
	}, [
		watchName,
		watchDescription,
		watchCategories,
		watchImage,
		watchImpactLocation,
		watchAddresses,
		watchAlloProtocolRegistry,
		watchFacebook,
		watchX,
		watchInstagram,
		watchYoutube,
		watchLinkedIn,
		watchReddit,
		watchDiscord,
		watchFarcaster,
		watchLens,
		watchWebsite,
	]);
	const hasOptimismAddress = watchAddresses.some(
		address => config.OPTIMISM_NETWORK_NUMBER === address.networkId,
	);
	const onError = (errors: FieldErrors<TInputs>) => {
		if (errors[EInputs.description]) {
			document?.getElementById('project_description')?.scrollIntoView();
		}
	};

	const onSubmit = async (formData: TInputs) => {
		setIsLoading(true);
		if (
			!watchDraft &&
			quality === EQualityState.MEDIUM &&
			!publishOnMediumQuality.current
		) {
			setIsLoading(false);
			setShowLowScoreModal(true);
			return;
		}
		try {
			// Extracting the relevant fields from formData
			const {
				addresses,
				name,
				description,
				categories,
				impactLocation,
				image,
				draft,
				facebook,
				x,
				instagram,
				youtube,
				linkedin,
				reddit,
				discord,
				farcaster,
				lens,
				website,
			} = formData;

			// Transforming the social media fields into the required structure
			const socialMedia = [
				{ type: EProjectSocialMediaType.FACEBOOK, link: facebook },
				{ type: EProjectSocialMediaType.X, link: x },
				{ type: EProjectSocialMediaType.INSTAGRAM, link: instagram },
				{ type: EProjectSocialMediaType.YOUTUBE, link: youtube },
				{ type: EProjectSocialMediaType.LINKEDIN, link: linkedin },
				{ type: EProjectSocialMediaType.REDDIT, link: reddit },
				{ type: EProjectSocialMediaType.DISCORD, link: discord },
				{ type: EProjectSocialMediaType.FARCASTER, link: farcaster },
				{ type: EProjectSocialMediaType.LENS, link: lens },
				{ type: EProjectSocialMediaType.WEBSITE, link: website },
			].filter(
				social => social.link && social.link !== '',
			) as IProjectSocialMedia[]; // Filtering out empty links

			if (addresses.length === 0) {
				showToastError(
					formatMessage({ id: 'label.recipient_addresses_cant' }),
				);
				setIsLoading(false);
				return;
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
				socialMedia,
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

			if (
				watchAlloProtocolRegistry &&
				hasOptimismAddress &&
				isRecurringActive
			) {
				!isEditMode
					? setAddedProjectState(addedProject.data?.createProject)
					: setAddedProjectState(addedProject.data?.updateProject);
				setIsLoading(false);
			}

			if (isDraft && !draft) {
				await client.mutate({
					mutation: ACTIVATE_PROJECT,
					variables: { projectId: Number(project.id) },
				});
			}

			//handle Anchor contract modal here.

			if (addedProject) {
				// Success

				if (
					watchAlloProtocolRegistry &&
					hasOptimismAddress &&
					isRecurringActive &&
					!draft
				) {
					setShowAlloProtocolModal(true);
					localStorage.removeItem(StorageLabel.CREATE_PROJECT_FORM);
				} else {
					setIsLoading(false);
					if (!isEditMode) {
						localStorage.removeItem(
							StorageLabel.CREATE_PROJECT_FORM,
						);
					}
					const _project = isEditMode
						? addedProject.data?.updateProject
						: addedProject.data?.createProject;
					if (draft) {
						await router.push(slugToProjectView(_project.slug));
					} else {
						if (!isEditMode || (isEditMode && isDraft)) {
							await router.push(slugToSuccessView(_project.slug));
						} else {
							await router.push(slugToProjectView(_project.slug));
						}
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
		} finally {
			setIsLoading(false);
			publishOnMediumQuality.current = false;
		}
	};

	const handleCancel = () => {
		router.back();
		if (!isEditMode) {
			localStorage.removeItem(StorageLabel.CREATE_PROJECT_FORM);
		}
	};

	return (
		<>
			<CreateHeader
				formData={data}
				getFieldState={getFieldState}
				setQuality={setQuality}
			/>
			<StyledContainer>
				<Row>
					<Col lg={8} md={12}>
						<Title
							onMouseEnter={() =>
								setActiveProjectSection(
									ECreateProjectSections.default,
								)
							}
						>
							{isEditMode
								? formatMessage({ id: 'label.project_details' })
								: formatMessage({
										id: 'label.create_a_project',
									})}
						</Title>
						<FormProvider {...formMethods}>
							<form
								onSubmit={handleSubmit(onSubmit, onError)}
								onSubmitCapture={() => setIsLoading(true)}
								id='hook-form'
							>
								<NameInput
									setActiveProjectSection={
										setActiveProjectSection
									}
									preTitle={title}
								/>
								<DescriptionInput
									setActiveProjectSection={
										setActiveProjectSection
									}
								/>
								<SocialMedias
									setActiveProjectSection={
										setActiveProjectSection
									}
								/>
								<CategoryInput
									setActiveProjectSection={
										setActiveProjectSection
									}
								/>
								<LocationIndex
									setActiveProjectSection={
										setActiveProjectSection
									}
								/>
								<ImageInput
									setIsLoading={setIsLoading}
									setActiveProjectSection={
										setActiveProjectSection
									}
								/>
								<H5>
									{formatMessage({
										id: 'label.receiving_funds',
									})}
								</H5>
								<CaptionContainer>
									{formatMessage({
										id: 'label.you_can_set_a_custom_ethereum_address',
									})}
								</CaptionContainer>
								<div
									onMouseEnter={() => {
										setActiveProjectSection(
											ECreateProjectSections.addresses,
										);
									}}
								>
									{ALL_CHAINS.map(chain => (
										<AddressInterface
											key={chain.id}
											networkId={chain.id}
											chainType={
												(chain as NonEVMChain).chainType
											}
											onButtonClick={() => {
												setAddressModalChainType(
													(chain as NonEVMChain)
														.chainType,
												);
												setAddressModalChainId(
													chain.id,
												);
											}}
											isEditMode={isEditMode}
											anchorContractData={
												(project?.anchorContracts &&
													project
														?.anchorContracts[0]) ??
												undefined
											}
										/>
									))}
								</div>
								<PublishTitle>
									{isEditMode
										? formatMessage({
												id: 'label.publish_edited_project',
											})
										: formatMessage({
												id: 'label.lets_publish',
											})}
								</PublishTitle>
								<PublishList
									onMouseEnter={() =>
										setActiveProjectSection(
											ECreateProjectSections.default,
										)
									}
								>
									<li>
										{isEditMode
											? formatMessage({
													id: 'label.edited_projects',
												})
											: formatMessage({
													id: 'label.newly_published_projects',
												})}{' '}
										{formatMessage({
											id: 'label.will_be_unlisted_until',
										})}
										{isEditMode &&
											` ${formatMessage({
												id: 'label.again',
											})}`}
										.
									</li>
									<li>
										{formatMessage({
											id: 'label.you_can_still_access_your_project_from_your_account',
										})}
									</li>
									<li>
										{formatMessage({
											id: 'label.youll_receive_an_email_from_us_once_its_listed',
										})}
									</li>
								</PublishList>
								<Buttons>
									{(!isEditMode || isDraft) && (
										<OutlineButton
											label={formatMessage({
												id: 'label.preview',
											})}
											buttonType='primary'
											disabled={isLoading}
											loading={isLoading}
											icon={
												<IconExternalLink size={16} />
											}
											type='submit'
											onClick={() =>
												setValue(EInputs.draft, true)
											}
										/>
									)}
									{quality === EQualityState.LOW ? (
										<IconWithTooltip
											icon={
												<Button
													label={formatMessage({
														id: 'label.publish',
													})}
													buttonType='primary'
													disabled={true}
												/>
											}
											direction='top'
										>
											<TooltipWrapper>
												{formatMessage({
													id: 'component.create_project.low_score',
												})}
											</TooltipWrapper>
										</IconWithTooltip>
									) : (
										<Button
											label={formatMessage({
												id: 'label.publish',
											})}
											buttonType='primary'
											type='submit'
											disabled={isLoading}
											loading={isLoading}
										/>
									)}
									<OutlineButton
										onClick={handleCancel}
										label={formatMessage({
											id: 'label.cancel',
										})}
										buttonType='primary'
										disabled={isLoading}
									/>
								</Buttons>
								{addressModalChainId !== undefined && (
									<CreateProjectAddAddressModal
										networkId={addressModalChainId}
										chainType={addressModalChainType}
										userAddresses={userUniqueAddresses}
										setShowModal={() => {
											setAddressModalChainId(undefined);
											setAddressModalChainType(undefined);
										}}
										onSubmit={() => {
											setAddressModalChainId(undefined);
											setAddressModalChainType(undefined);
										}}
									/>
								)}
							</form>
						</FormProvider>
					</Col>
					<Col lg={4} md={12}>
						<ProGuide activeSection={activeProjectSection} />
					</Col>
				</Row>
				{showAlloProtocolModal && addedProjectState && (
					<AlloProtocolModal
						setShowModal={setShowAlloProtocolModal}
						addedProjectState={addedProjectState}
						project={project}
					/>
				)}
				{showLowScoreModal && (
					<LowScoreModal
						setShowModal={setShowLowScoreModal}
						publishOnMediumQuality={publishOnMediumQuality}
						onSubmit={handleSubmit(onSubmit, onError)}
					/>
				)}
			</StyledContainer>
		</>
	);
};

const StyledContainer = styled(Container)`
	margin-top: 136px;
`;

const CaptionContainer = styled(Caption)`
	margin-top: 8px;
	margin-bottom: 27px;
`;

const Buttons = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10px;
	margin: 61px 0 32px 0;
	& > *,
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

const TooltipWrapper = styled(Caption)`
	max-width: 320px;
`;

export default CreateProject;
