import React, { useEffect, useRef, useState } from 'react';
import {
	brandColors,
	Button,
	Caption,
	H3,
	H4,
	IconExternalLink,
	neutralColors,
	OulineButton,
	H6,
} from '@giveth/ui-design-system';
import { useMutation } from '@apollo/client';
import { utils } from 'ethers';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import Debounced from 'lodash.debounce';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { captureException } from '@sentry/nextjs';

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
	LocationInput,
	NameInput,
	WalletAddressInput,
} from './Inputs';
import SuccessfulCreation from './SuccessfulCreation';
import { ProjectGuidelineModal } from '@/components/modals/ProjectGuidelineModal';
import {
	isDescriptionHeavy,
	titleValidation,
	walletAddressValidation,
} from '@/helpers/createProjectValidation';
import { compareAddresses, showToastError } from '@/lib/helpers';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { slugToProjectView } from '@/lib/routeCreators';
import { client } from '@/apollo/apolloClient';
import LightBulbIcon from '/public/images/icons/lightbulb.svg';
import { Shadow } from '@/components/styled-components/Shadow';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';
import { useAppSelector } from '@/features/hooks';
import useLeaveConfirm from '@/hooks/useLeaveConfirm';

export enum ECreateErrFields {
	NAME = 'name',
	DESCRIPTION = 'description',
	WALLET_ADDRESS = 'walletAddress',
}

export interface ICreateProjectErrors {
	[ECreateErrFields.NAME]: string;
	[ECreateErrFields.DESCRIPTION]: string;
	[ECreateErrFields.WALLET_ADDRESS]: string;
}

export interface ICategoryComponent {
	[key: string]: boolean;
}

const CreateProject = (props: { project?: IProjectEdition }) => {
	const { library, chainId } = useWeb3React();
	const [addProjectMutation] = useMutation(CREATE_PROJECT);
	const [editProjectMutation] = useMutation(UPDATE_PROJECT);
	const router = useRouter();

	const { project } = props;

	const isEditMode = !!project;
	const isDraft = project?.status.name === EProjectStatus.DRAFT;
	const defaultImpactLocation = project?.impactLocation || '';

	const [creationSuccessful, setCreationSuccessful] = useState<IProject>();
	const [showGuidelineModal, setShowGuidelineModal] = useState(false);
	const [name, setName] = useState(project?.title || '');
	const [description, setDescription] = useState(project?.description || '');
	const [categories, setCategories] = useState(project?.categories || []);
	const [image, setImage] = useState(project?.image || '');
	const [walletAddress, setWalletAddress] = useState(
		project?.walletAddress || '',
	);
	const [isLoading, setIsLoading] = useState(false);
	const [publish, setPublish] = useState<boolean>(false);
	const [impactLocation, setImpactLocation] = useState(
		project?.impactLocation || '',
	);
	const user = useAppSelector(state => state.user?.userData);
	const [errors, setErrors] = useState<ICreateProjectErrors>({
		[ECreateErrFields.NAME]: isEditMode ? '' : 'Title is required',
		[ECreateErrFields.DESCRIPTION]: '',
		[ECreateErrFields.WALLET_ADDRESS]: '',
	});
	const [formChange, setFormChange] = useState(false);

	const debouncedTitleValidation = useRef<any>();
	const debouncedAddressValidation = useRef<any>();
	const debouncedDescriptionValidation = useRef<any>();
	useLeaveConfirm({ shouldConfirm: formChange });

	useEffect(() => {
		if (isEditMode) {
			if (!project) return;
			const imageComparator = image === '' ? null : image;
			if (
				name !== project.title ||
				description !== project.description ||
				JSON.stringify(categories) !==
					JSON.stringify(project.categories) ||
				imageComparator !== project.image ||
				walletAddress !== project.walletAddress ||
				impactLocation !== project.impactLocation
			) {
				setPublish(false);
			} else {
				setPublish(true);
			}
		}
	}, [name, description, categories, image, walletAddress, impactLocation]);

	useEffect(() => {
		if (!isEditMode) {
			setShowGuidelineModal(true);
		}
	}, []);

	useEffect(() => {
		const userAddress = user?.walletAddress || '';
		if (!isEditMode) {
			setWalletAddress(userAddress);
			walletAddressValidation(
				userAddress,
				library,
				errors,
				setErrors,
				chainId,
			);
		}
	}, [user]);

	useEffect(() => {
		debouncedTitleValidation.current = Debounced(titleValidation, 1000);
		debouncedAddressValidation.current = Debounced(
			walletAddressValidation,
			1000,
		);
		debouncedDescriptionValidation.current = Debounced(
			isDescriptionHeavy,
			1000,
		);
	}, []);

	const handleInputChange = (value: string, id: string) => {
		if (id === ECreateErrFields.NAME) {
			setName(value);
			if (isEditMode && value === project.title) {
				const _errors = { ...errors };
				_errors[ECreateErrFields.NAME] = '';
				setErrors(_errors);
				return;
			}
			debouncedTitleValidation.current(value, errors, setErrors);
		} else if (id === ECreateErrFields.WALLET_ADDRESS) {
			setWalletAddress(value);
			if (isEditMode && compareAddresses(value, project?.walletAddress)) {
				const _errors = { ...errors };
				_errors[ECreateErrFields.WALLET_ADDRESS] = '';
				setErrors(_errors);
				return;
			}
			debouncedAddressValidation.current(
				value,
				library,
				errors,
				setErrors,
				chainId,
			);
		} else if (id === ECreateErrFields.DESCRIPTION) {
			setDescription(value);
			debouncedDescriptionValidation.current(value, errors, setErrors);
		}
	};

	const submitErrorHandler = (id: string, error: string) => {
		document.getElementById(id)?.scrollIntoView({
			behavior: 'smooth',
		});
		showToastError(error);
	};

	const isReadyToPublish = () => {
		for (const [key, value] of Object.entries(errors)) {
			if (value) {
				submitErrorHandler(key, value);
				return false;
			}
		}
		return true;
	};

	const onSubmit = async (drafted?: boolean) => {
		try {
			if (!isReadyToPublish()) return;
			setFormChange(false);

			const address = isAddressENS(walletAddress)
				? await getAddressFromENS(walletAddress, library)
				: walletAddress;

			const projectData: IProjectCreation = {
				title: name,
				description,
				impactLocation,
				categories: categories.map(category => category.name),
				organisationId: 1,
				walletAddress: utils.getAddress(address),
				image,
				isDraft: !!drafted,
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

			if (isDraft && !drafted) {
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
				if (drafted) {
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
			const error = e as Error;
			showToastError(error);
			captureException(error, {
				tags: {
					section: 'CreateProjectSubmit',
				},
			});
		}
	};

	if (creationSuccessful) {
		return <SuccessfulCreation project={creationSuccessful} />;
	}

	const Guidelines = () => {
		return (
			<div onClick={() => setShowGuidelineModal(true)}>
				<Image src={LightBulbIcon} alt='Light Bulb Icon' />
				<H6>Submission guidelines</H6>
			</div>
		);
	};

	return (
		<>
			{showGuidelineModal && (
				<ProjectGuidelineModal setShowModal={setShowGuidelineModal} />
			)}
			{user && (
				<Container>
					<CreateContainer>
						<div>
							<Title>
								{isEditMode
									? 'Project details'
									: 'Create a Project'}
							</Title>
							<GuidelinesStyleTablet>
								<Guidelines />
							</GuidelinesStyleTablet>
						</div>

						<div>
							<NameInput
								value={name}
								setValue={e => {
									console.log('name');
									setFormChange(true);
									handleInputChange(e, ECreateErrFields.NAME);
								}}
								error={errors[ECreateErrFields.NAME]}
							/>
							<DescriptionInput
								value={description}
								setValue={e => {
									console.log('name');
									setFormChange(true);
									handleInputChange(
										e,
										ECreateErrFields.DESCRIPTION,
									);
								}}
								error={errors[ECreateErrFields.DESCRIPTION]}
							/>
							<CategoryInput
								value={categories}
								setValue={category => {
									console.log('category');
									setFormChange(true);
									setCategories(category);
								}}
							/>
							<LocationInput
								defaultValue={defaultImpactLocation}
								setValue={location => {
									console.log('location');
									setFormChange(true);
									setImpactLocation(location);
								}}
							/>
							<ImageInput
								value={image}
								setValue={img => {
									console.log('image');
									setFormChange(true);
									setImage(img);
								}}
								setIsLoading={setIsLoading}
							/>
							<WalletAddressInput
								value={walletAddress}
								setValue={e => {
									console.log('walletAddress');
									setFormChange(true);
									handleInputChange(
										e,
										ECreateErrFields.WALLET_ADDRESS,
									);
								}}
								error={errors[ECreateErrFields.WALLET_ADDRESS]}
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
									reviewed by our team {isEditMode && 'again'}
									.
								</li>
								<li>
									You can still access your project from your
									account and share it with your friends via
									the project link!
								</li>
								<li>
									You&apos;ll receive an email from us once
									your project is listed.
								</li>
							</PublishList>
							<Buttons>
								{(!isEditMode || isDraft) && (
									<OulineButton
										label='PREVIEW '
										buttonType='primary'
										disabled={isLoading}
										icon={<IconExternalLink size={16} />}
										onClick={() => onSubmit(true)}
									/>
								)}
								<Button
									label='PUBLISH'
									buttonType='primary'
									disabled={isLoading || publish}
									onClick={() => onSubmit(false)}
								/>
								{isEditMode && (
									<OulineButton
										onClick={() => router.back()}
										label='CANCEL'
										buttonType='primary'
									/>
								)}
							</Buttons>
						</div>
					</CreateContainer>
					<GuidelinesStyleLaptop>
						<Guidelines />
					</GuidelinesStyleLaptop>
				</Container>
			)}
		</>
	);
};

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
	${mediaQueries.laptop} {
		display: none;
	}
`;

const GuidelinesStyleLaptop = styled(GuidelinesStyle)`
	display: none;
	${mediaQueries.laptop} {
		display: flex;
		> div {
			position: sticky;
			top: 104px;
		}
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
	${mediaQueries.laptop} {
		width: ${(deviceSize.laptop * 8) / 12 + 'px'};
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
