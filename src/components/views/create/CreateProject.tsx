import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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

import {
	ACTIVATE_PROJECT,
	CREATE_PROJECT,
	UPDATE_PROJECT,
} from '@/apollo/gql/gqlProjects';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import { IProjectCreation, IProjectEdition } from '@/apollo/types/types';
import {
	CategoryInput,
	DescriptionInput,
	ImageInput,
	LocationInput,
	NameInput,
	WalletAddressInput,
} from './Inputs';
import useUser from '@/context/UserProvider';
import Logger from '@/utils/Logger';
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
import { deviceSize, mediaQueries } from '@/utils/constants';

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

	const [creationSuccessful, setCreationSuccessful] = useState<any>(null);
	const [showGuidelineModal, setShowGuidelineModal] = useState(false);
	const [name, setName] = useState(project?.title || '');
	const [description, setDescription] = useState(project?.description || '');
	const [categories, setCategories] = useState(project?.categories || []);
	const [image, setImage] = useState(project?.image || '');
	const [walletAddress, setWalletAddress] = useState(
		project?.walletAddress || '',
	);
	const [isLoading, setIsLoading] = useState(false);
	const [impactLocation, setImpactLocation] = useState(
		project?.impactLocation || '',
	);
	const [errors, setErrors] = useState<ICreateProjectErrors>({
		[ECreateErrFields.NAME]: isEditMode ? '' : 'Title is required',
		[ECreateErrFields.DESCRIPTION]: '',
		[ECreateErrFields.WALLET_ADDRESS]: '',
	});

	const [publish, setPublish] = useState<boolean>(true);

	const {
		state: { user },
	} = useUser();

	const debouncedTitleValidation = useRef<any>();
	const debouncedAddressValidation = useRef<any>();
	const debouncedDescriptionValidation = useRef<any>();

	useEffect(() => {
		console.log(project);
		if (!project) return;
		let imageComparator = image === '' ? null : image;
		if (
			name !== project.title ||
			description !== project.description ||
			JSON.stringify(categories) !== JSON.stringify(project.categories) ||
			imageComparator !== project.image ||
			walletAddress !== project.walletAddress ||
			impactLocation !== project.impactLocation
		) {
			setPublish(false);
		} else {
			setPublish(true);
		}
	}, [
		project,
		name,
		description,
		categories,
		image,
		walletAddress,
		impactLocation,
	]);

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
		for (let [key, value] of Object.entries(errors)) {
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
			Logger.captureException(error);
			showToastError(error);
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
				<ProjectGuidelineModal
					showModal={showGuidelineModal}
					setShowModal={setShowGuidelineModal}
				/>
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
								setValue={e =>
									handleInputChange(e, ECreateErrFields.NAME)
								}
								error={errors[ECreateErrFields.NAME]}
							/>
							<DescriptionInput
								value={description}
								setValue={e =>
									handleInputChange(
										e,
										ECreateErrFields.DESCRIPTION,
									)
								}
								error={errors[ECreateErrFields.DESCRIPTION]}
							/>
							<CategoryInput
								value={categories}
								setValue={setCategories}
							/>
							<LocationInput
								defaultValue={defaultImpactLocation}
								setValue={setImpactLocation}
							/>
							<ImageInput
								value={image}
								setValue={setImage}
								setIsLoading={setIsLoading}
							/>
							<WalletAddressInput
								value={walletAddress}
								setValue={e =>
									handleInputChange(
										e,
										ECreateErrFields.WALLET_ADDRESS,
									)
								}
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
								<Link href={`/project/${project?.slug!}`}>
									<OulineButton
										label='CANCEL'
										buttonType='primary'
									/>
								</Link>
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
