import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	brandColors,
	Button,
	Caption,
	H3,
	H4,
	H5,
	IconExternalLink,
	neutralColors,
	OutlineButton,
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
import { compareAddressesArray, showToastError } from '@/lib/helpers';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { slugToProjectView } from '@/lib/routeCreators';
import { client } from '@/apollo/apolloClient';
import { Shadow } from '@/components/styled-components/Shadow';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';
// import useLeaveConfirm from '@/hooks/useLeaveConfirm';
import config from '@/configuration';
import CheckBox from '@/components/Checkbox';
import Guidelines from '@/components/views/create/Guidelines';
import useDetectDevice from '@/hooks/useDetectDevice';
import { Container } from '@/components/Grid';
import { setShowFooter } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';
import NameInput from '@/components/views/create/NameInput';

const { PRIMARY_NETWORK, SECONDARY_NETWORK, POLYGON_NETWORK } = config;
const ethereumId = PRIMARY_NETWORK.id;
const gnosisId = SECONDARY_NETWORK.id;
const polygonId = POLYGON_NETWORK.id;

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
	polygonAddress = 'polygonAddress',
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
	[EInputs.polygonAddress]: string;
};

const CreateProject: FC<ICreateProjectProps> = ({ project }) => {
	const { formatMessage } = useIntl();
	const [addProjectMutation] = useMutation(CREATE_PROJECT);
	const [editProjectMutation] = useMutation(UPDATE_PROJECT);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const isEditMode = !!project;
	const { title, description, categories, impactLocation, image, addresses } =
		project || {};
	const isDraft = project?.status.name === EProjectStatus.DRAFT;
	const defaultImpactLocation = impactLocation || '';

	const prevMainAddress = addresses?.find(
		a => a.isRecipient && a.networkId === ethereumId,
	)?.address;
	const prevSecondaryAddress = addresses?.find(
		a => a.isRecipient && a.networkId === gnosisId,
	)?.address;
	const prevPolygonAddress = addresses?.find(
		a => a.isRecipient && a.networkId === polygonId,
	)?.address;
	const isSamePrevAddresses = compareAddressesArray([
		prevMainAddress,
		prevSecondaryAddress,
		prevPolygonAddress,
	]);
	const userAddresses: string[] = [];
	if (isSamePrevAddresses) userAddresses.push(prevMainAddress!);
	else {
		if (prevMainAddress) userAddresses.push(prevMainAddress);
		if (prevSecondaryAddress) userAddresses.push(prevSecondaryAddress);
		if (prevPolygonAddress) userAddresses.push(prevPolygonAddress);
	}

	const formMethods = useForm<TInputs>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		defaultValues: {
			[EInputs.name]: title,
			[EInputs.description]: description || '',
			[EInputs.categories]: categories || [],
			[EInputs.impactLocation]: defaultImpactLocation,
			[EInputs.image]: image || '',
			[EInputs.mainAddress]: prevMainAddress || '',
			[EInputs.secondaryAddress]: prevSecondaryAddress || '',
			[EInputs.polygonAddress]: prevPolygonAddress || '',
		},
	});

	const { unregister, handleSubmit, setValue } = formMethods;

	const [creationSuccessful, setCreationSuccessful] = useState<IProject>();
	const [mainnetAddressActive, setMainnetAddressActive] = useState(
		isEditMode ? !!prevMainAddress : true,
	);
	const [gnosisAddressActive, setGnosisAddressActive] = useState(
		isEditMode ? !!prevSecondaryAddress : true,
	);
	const [polygonAddressActive, setPolygonAddressActive] = useState(
		isEditMode ? !!prevPolygonAddress : true,
	);
	const [isSameAddress, setIsSameAddress] = useState(
		isEditMode ? isSamePrevAddresses : true,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [resolvedENS, setResolvedENS] = useState('');

	// useLeaveConfirm({ shouldConfirm: formChange });

	const onSubmit = async (formData: TInputs) => {
		try {
			setIsLoading(true);
			const addresses = [];
			const {
				mainAddress,
				secondaryAddress,
				polygonAddress,
				name,
				description,
				categories,
				impactLocation,
				image,
				draft,
			} = formData;

			if (isSameAddress) {
				const address = isAddressENS(mainAddress)
					? resolvedENS
					: mainAddress;
				const checksumAddress = utils.getAddress(address);
				addresses.push(
					{ address: checksumAddress, networkId: ethereumId },
					{ address: checksumAddress, networkId: gnosisId },
					{ address: checksumAddress, networkId: polygonId },
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
				if (polygonAddressActive) {
					const checksumAddress = utils.getAddress(polygonAddress);
					addresses.push({
						address: checksumAddress,
						networkId: polygonId,
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
		return () => {
			dispatch(setShowFooter(true));
		};
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
						{isEditMode
							? formatMessage({ id: 'label.project_details' })
							: formatMessage({ id: 'label.create_a_project' })}
					</Title>
					{isSmallScreen && (
						<GuidelinesStyleTablet>
							<Guidelines />
						</GuidelinesStyleTablet>
					)}
				</div>

				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<NameInput preTitle={title} />
						<DescriptionInput />
						<CategoryInput />
						<LocationIndex />
						<ImageInput setIsLoading={setIsLoading} />
						<H5>
							{formatMessage({ id: 'label.receiving_funds' })}
						</H5>
						<CaptionContainer>
							{formatMessage({
								id: 'label.you_can_set_a_custom_ethereum_address',
							})}
						</CaptionContainer>
						<CheckBox
							onChange={setIsSameAddress}
							checked={isSameAddress}
							label={formatMessage({
								id: 'label.ill_raise_and_receive_funds_on_mainnet_and_gnosis',
							})}
						/>
						<WalletAddressInput
							networkId={ethereumId}
							sameAddress={isSameAddress}
							isActive={mainnetAddressActive}
							userAddresses={userAddresses}
							resolvedENS={resolvedENS}
							setResolvedENS={setResolvedENS}
							setIsActive={e => {
								if (
									!e &&
									!gnosisAddressActive &&
									!polygonAddressActive
								)
									return showToastError(
										formatMessage({
											id: 'label.you_must_select_at_least_one_address',
										}),
									);
								if (!e) unregister(EInputs.mainAddress);
								setMainnetAddressActive(e);
							}}
						/>
						<WalletAddressInput
							networkId={gnosisId}
							sameAddress={isSameAddress}
							isActive={gnosisAddressActive}
							userAddresses={userAddresses}
							setResolvedENS={() => {}}
							setIsActive={e => {
								if (
									!e &&
									!mainnetAddressActive &&
									!polygonAddressActive
								)
									return showToastError(
										formatMessage({
											id: 'label.you_must_select_at_least_one_address',
										}),
									);
								if (!e) unregister(EInputs.secondaryAddress);
								setGnosisAddressActive(e);
							}}
						/>
						<WalletAddressInput
							networkId={polygonId}
							sameAddress={isSameAddress}
							isActive={polygonAddressActive}
							userAddresses={userAddresses}
							setResolvedENS={() => {}}
							setIsActive={e => {
								if (
									!e &&
									!mainnetAddressActive &&
									!gnosisAddressActive
								)
									return showToastError(
										formatMessage({
											id: 'label.you_must_select_at_least_one_address',
										}),
									);
								if (!e) unregister(EInputs.polygonAddress);
								setPolygonAddressActive(e);
							}}
						/>
						<PublishTitle>
							{isEditMode
								? formatMessage({
										id: 'label.publish_edited_project',
								  })
								: formatMessage({ id: 'label.lets_publish' })}
						</PublishTitle>
						<PublishList>
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
									icon={<IconExternalLink size={16} />}
									type='submit'
									onClick={() =>
										setValue(EInputs.draft, true)
									}
								/>
							)}
							<Button
								label={formatMessage({ id: 'label.publish' })}
								buttonType='primary'
								type='submit'
								disabled={isLoading}
							/>
							{isEditMode && (
								<OutlineButton
									onClick={() => !isLoading && router.back()}
									label={formatMessage({
										id: 'label.cancel',
									})}
									buttonType='primary'
									disabled={isLoading}
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
		padding: 28px 30px 28px 28px;
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
