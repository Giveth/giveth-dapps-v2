import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
	H3,
	H4,
	P,
	Button,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { useMutation } from '@apollo/client';
import { client } from '@/apollo/apolloClient';
import { utils } from 'ethers';
import { WALLET_ADDRESS_IS_VALID, ADD_PROJECT } from '@/apollo/gql/gqlProjects';
import { useWeb3React } from '@web3-react/core';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import { IProjectCreation } from '@/apollo/types/types';
import {
	NameInput,
	DescriptionInput,
	CategoryInput,
	LocationInput,
	ImageInput,
	WalletAddressInput,
} from './Inputs';
import { getImageFile } from '@/utils/index';
import useUser from '@/context/UserProvider';
import Logger from '@/utils/Logger';
import SuccessfulCreation from './SuccessfulCreation';
import { ProjectGuidelineModal } from '@/components/modals/ProjectGuidelineModal';
import styled from 'styled-components';

type Inputs = {
	name: string;
	description: string;
	categories: any;
	impactLocation: any;
	image: any;
	walletAddress: string;
};

const CreateIndex = () => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<Inputs>();
	const { library } = useWeb3React();
	const [addProjectMutation] = useMutation(ADD_PROJECT);
	const [creationSuccessful, setCreationSuccessful] = useState<any>(null);
	const {
		state: { isSignedIn },
		actions: { signIn },
	} = useUser();

	const onSubmit: SubmitHandler<Inputs> = async data => {
		try {
			// check heavy description
			const stringSize =
				encodeURI(data?.description).split(/%..|./).length - 1;
			if (stringSize > 4000000) {
				// 4Mb tops max maybe?
				// TODO: ADD TOAST HERE
				return alert('Description too large');
			}

			// Check wallet
			let address;
			// Handle ENS address
			if (isAddressENS(data.walletAddress)) {
				address = await getAddressFromENS(data.walletAddress, library);
			} else {
				address = data.walletAddress;
			}
			// Check wallet valid
			await client.query({
				query: WALLET_ADDRESS_IS_VALID,
				variables: {
					address,
				},
			});
			// Set categories
			const projectCategories = [];
			for (const category in data.categories) {
				projectCategories.push(category);
			}
			const projectData: IProjectCreation = {
				title: data.name,
				description: data.description,
				impactLocation: data.impactLocation?.global
					? 'Global'
					: data.impactLocation,
				categories: projectCategories,
				organisationId: 1,
				walletAddress: utils.getAddress(address),
				imageStatic: null,
				imageUpload: null,
			};

			if (!isNaN(data?.image)) {
				projectData.imageStatic = data.image?.toString();
			} else if (data.image) {
				projectData.imageUpload = await getImageFile(
					data.image,
					data.name,
				);
			}

			const addedProject = await addProjectMutation({
				variables: {
					project: { ...projectData },
				},
			});

			if (addedProject) {
				// Success
				setCreationSuccessful(addedProject?.data?.addProject);
			}
		} catch (e) {
			const error = e as Error;
			if (error.message === 'Access denied') {
				console.log('Please first sign in');
			} else {
				Logger.captureException(error);
			}
			console.log({ error });
			// TODO: TOAST ERROR
			alert(JSON.stringify(error));
		}
	};
	const [showGuidelineModal, setShowGuidelineModal] = useState(false);

	const createProject = (e: any) => {
		e.preventDefault();
		handleSubmit(onSubmit)();
	};

	const hasErrors = Object.entries(errors).length !== 0;

	useEffect(() => {
		// Show guideline first thing
		setShowGuidelineModal(true);

		if (!isSignedIn && signIn) {
			signIn();
		}
	}, []);

	if (creationSuccessful) {
		return <SuccessfulCreation project={creationSuccessful} />;
	}

	return (
		<>
			{showGuidelineModal && (
				<ProjectGuidelineModal
					showModal={showGuidelineModal}
					setShowModal={setShowGuidelineModal}
				/>
			)}
			<CreateContainer>
				<Title>Create a Project</Title>
				<form>
					{/* register your input into the hook by invoking the "register" function */}
					<NameInput
						{...register('name', { required: true })}
						setValue={(val: string) => setValue('name', val)}
					/>
					<DescriptionInput
						{...register('description', { required: true })}
						setValue={(val: string) => setValue('description', val)}
					/>
					<CategoryInput
						{...register('categories', { required: true })}
						setValue={(val: Array<any>) =>
							setValue('categories', val)
						}
					/>
					<LocationInput
						{...register('impactLocation')}
						setValue={(val: string) =>
							setValue('impactLocation', val)
						}
					/>
					<ImageInput
						{...register('image')}
						setValue={(val: string) => setValue('image', val)}
					/>
					<WalletAddressInput
						{...register('walletAddress', { required: true })}
						setValue={(val: string) =>
							setValue('walletAddress', val)
						}
					/>

					<PublishTitle>{`Let's Publish!`}</PublishTitle>
					<PublishList>
						<li>
							Newly published projects will be "unlisted" until
							reviewed by our team.
						</li>
						<li>
							You can still access your project from your account
							and share it with your friends via the project link!
						</li>
						<li>
							You'll receive an email from us once your project is
							listed.
						</li>
					</PublishList>
					<Buttons>
						<Button
							label='PREVIEW'
							buttonType='primary'
							// onClick={uploadImage}
						/>
						<Button
							label='PUBLISH'
							buttonType='primary'
							onClick={createProject}
						/>
					</Buttons>
					{hasErrors && (
						<ErrorMessage>
							Empty fields or errors, please check the values
						</ErrorMessage>
					)}
				</form>
			</CreateContainer>
		</>
	);
};

const CreateContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 104px 0 154px 264px;
	width: 677px;
	form {
		display: flex;
		flex-direction: column;
		margin: 48px 0;
		width: 677px;
	}
	h5 {
		font-weight: normal;
		line-height: 36px;
		letter-spacing: -0.005em;
	}
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: row;
	margin: 61px 0 32px 0;
	* {
		font-weight: bold;
	}
	button {
		width: 100%;
	}
	button:first-child {
		background: white;
		color: ${brandColors.pinky[500]};
		border: 2px solid ${brandColors.pinky[500]};
		margin: 0 24px 0 0;
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

const PublishList = styled.ul`
	font-size: 14px;
	color: ${neutralColors.gray[900]};
`;

const ErrorMessage = styled(P)`
	color: ${brandColors.pinky[500]};
	font-weight: bold;
`;

export default CreateIndex;
