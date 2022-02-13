import React, { useEffect, useRef, useState } from 'react';
import {
	H3,
	H4,
	P,
	Button,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { useMutation } from '@apollo/client';
import { utils } from 'ethers';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import Debounced from 'lodash.debounce';

import SignInModal from '../../modals/SignInModal';
import { WALLET_ADDRESS_IS_VALID, ADD_PROJECT } from '@/apollo/gql/gqlProjects';
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
import { getImageFile } from '@/utils';
import useUser from '@/context/UserProvider';
import Logger from '@/utils/Logger';
import SuccessfulCreation from './SuccessfulCreation';
import { ProjectGuidelineModal } from '@/components/modals/ProjectGuidelineModal';
import { client } from '@/apollo/apolloClient';
import {
	TitleValidation,
	WalletAddressValidation,
} from '@/components/views/create/FormValidation';

const CreateIndex = () => {
	const { library } = useWeb3React();
	const [addProjectMutation] = useMutation(ADD_PROJECT);

	const [creationSuccessful, setCreationSuccessful] = useState<any>(null);
	const [showSigninModal, setShowSigninModal] = useState(false);
	const [showGuidelineModal, setShowGuidelineModal] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [categories, setCategories] = useState([]);
	const [impactLocation, setImpactLocation] = useState('');
	const [image, setImage] = useState(null);
	const [walletAddress, setWalletAddress] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{
		name: string;
		walletAddress: string;
	}>({ name: '', walletAddress: '' });

	const {
		state: { user, isSignedIn },
		actions: { signIn },
	} = useUser();

	const debouncedTitleValidation = useRef<any>();
	const debouncedAddressValidation = useRef<any>();

	useEffect(() => {
		debouncedTitleValidation.current = Debounced(TitleValidation, 1000);
		debouncedAddressValidation.current = Debounced(
			WalletAddressValidation,
			1000,
		);
	}, []);

	const onSubmit = async () => {
		try {
			// check heavy description
			const stringSize = encodeURI(description).split(/%..|./).length - 1;
			if (stringSize > 4000000) {
				// 4Mb tops max maybe?
				// TODO: ADD TOAST HERE
				return alert('Description too large');
			}

			// Check wallet
			let address;
			// Handle ENS address
			if (isAddressENS(walletAddress)) {
				address = await getAddressFromENS(walletAddress, library);
			} else {
				address = walletAddress;
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
			for (const category in categories) {
				projectCategories.push(category);
			}
			const projectData: IProjectCreation = {
				title: name,
				description,
				impactLocation: impactLocation?.global
					? 'Global'
					: impactLocation,
				categories: projectCategories,
				organisationId: 1,
				walletAddress: utils.getAddress(address),
				imageStatic: null,
				imageUpload: null,
			};

			if (!isNaN(image)) {
				projectData.imageStatic = image?.toString();
			} else if (image) {
				projectData.imageUpload = await getImageFile(image, name);
			}

			setIsLoading(true);

			const addedProject = await addProjectMutation({
				variables: {
					project: { ...projectData },
				},
			});

			if (addedProject) {
				// Success
				setIsLoading(false);
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

	const createProject = (e: any) => {
		e.preventDefault();
		onSubmit().then();
	};

	const hasErrors = Object.entries(errors).length !== 0;

	useEffect(() => {
		if (isSignedIn) {
			setShowGuidelineModal(true);
		}
	}, [isSignedIn]);

	useEffect(() => {
		const userAddress = user?.walletAddress;
		if (userAddress) {
			WalletAddressValidation(userAddress, library)
				.then(() => setWalletAddress(userAddress))
				.catch(() => {});
		}
	}, [user]);

	if (creationSuccessful) {
		return <SuccessfulCreation project={creationSuccessful} />;
	}

	const handleInputChange = (value: string, id: string) => {
		const _errors = { ...errors };
		if (id === 'name') {
			setName(value);
			TitleValidation(value)
				.then(() => {
					_errors[id] = '';
					setErrors(_errors);
				})
				.catch((error: { message: string }) => {
					_errors[id] = error?.message;
					setErrors(_errors);
				});
		}
		if (id === 'walletAddress') {
			setWalletAddress(value);
			WalletAddressValidation(value, library)
				.then(() => {
					_errors[id] = '';
					setErrors(_errors);
				})
				.catch((error: { message: string }) => {
					_errors[id] = error?.message;
					setErrors(_errors);
				});
		}
	};

	return (
		<>
			{showGuidelineModal && (
				<ProjectGuidelineModal
					showModal={showGuidelineModal}
					setShowModal={val => {
						if (!val) {
							if (!isSignedIn && signIn) {
								signIn().then();
							}
						}
						setShowGuidelineModal(val);
					}}
				/>
			)}
			{showSigninModal && (
				<SignInModal
					showModal={showSigninModal}
					closeModal={() => setShowSigninModal(false)}
				/>
			)}
			{user && (
				<CreateContainer>
					<Title>Create a Project</Title>
					<form>
						<NameInput
							value={name}
							setValue={e => handleInputChange(e, 'name')}
							error={errors['name']}
						/>
						<DescriptionInput setValue={setDescription} />
						<CategoryInput setValue={setCategories} />
						<LocationInput setValue={setImpactLocation} />
						<ImageInput setValue={setImage} />
						<WalletAddressInput
							value={walletAddress}
							setValue={e =>
								handleInputChange(e, 'walletAddress')
							}
							error={errors['walletAddress']}
						/>

						<PublishTitle>{`Let's Publish!`}</PublishTitle>
						<PublishList>
							<li>
								Newly published projects will be
								&quot;unlisted&quot; until reviewed by our team.
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
							<Button
								label='PREVIEW'
								buttonType='primary'
								disabled={isLoading}
								// onClick={uploadImage}
							/>
							<Button
								label='PUBLISH'
								buttonType='primary'
								disabled={isLoading}
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
			)}
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
