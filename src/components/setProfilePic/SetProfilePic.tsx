import {
	brandColors,
	Button,
	H5,
	H6,
	IconExternalLink16,
	IconImage32,
	mediaQueries,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import { captureException } from '@sentry/nextjs';
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import useUpload from '@/hooks/useUpload';
import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import { gToast, ToastType } from '@/components/toasts';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { useAppDispatch } from '@/features/hooks';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';
import config from '@/configuration';
import Routes from '@/lib/constants/Routes';
import ImageUploader from '../ImageUploader';
import PfpItem from '../modals/UploadProfilePicModal/PfpItem';
import { Flex, FlexCenter } from '../styled-components/Flex';
import { TabItem } from '../styled-components/Tabs';
import { IGiverPFPToken, IUser } from '@/apollo/types/types';
import { gqlRequest } from '@/helpers/requests';
import { buildUsersPfpInfoQuery } from '@/lib/subgraph/pfpQueryBuilder';
import Spinner from '../Spinner';

enum EProfilePicTab {
	LOADING,
	UPLOAD,
	PFP,
}

const tabs = [
	{ id: EProfilePicTab.UPLOAD, title: 'Upload Image' },
	{ id: EProfilePicTab.PFP, title: 'My NFTs' },
];

export interface ISetProfilePic {
	user: IUser;
}

export const SetProfilePic: FC<ISetProfilePic> = ({ user }) => {
	const useUploadProps = useUpload();
	const { formatMessage } = useIntl();
	const [activeTab, setActiveTab] = useState(EProfilePicTab.LOADING);
	const [selectedPFP, setSelectedPFP] = useState<IGiverPFPToken>();
	const [pfpData, setPfpData] = useState<IGiverPFPToken[]>();

	const dispatch = useAppDispatch();
	const { account } = useWeb3React();
	const [updateUser] = useMutation(UPDATE_USER);
	const { url, onDelete } = useUploadProps;

	useEffect(() => {
		const fetchPFPInfo = async (walletAddress: string) => {
			try {
				const query = buildUsersPfpInfoQuery([walletAddress]);
				const { data } = await gqlRequest(
					config.MAINNET_CONFIG.subgraphAddress,
					false,
					query,
				);
				if (
					data[`user_${walletAddress}`] &&
					data[`user_${walletAddress}`].length > 0
				) {
					console.log(
						'data[`user_${walletAddress}`]',
						data[`user_${walletAddress}`],
						user,
					);
					setPfpData(data[`user_${walletAddress}`]);
					setActiveTab(EProfilePicTab.PFP);
				} else {
					setActiveTab(EProfilePicTab.UPLOAD);
				}
			} catch (error) {
				console.error('error', error);
				setActiveTab(EProfilePicTab.UPLOAD);
			}
		};
		if (user?.walletAddress) {
			fetchPFPInfo(user.walletAddress);
		}
	}, [user, dispatch]);
	console.log('pfpData', pfpData);

	const nftUrl = selectedPFP?.imageIpfs
		? convertIPFSToHTTPS(selectedPFP?.imageIpfs)
		: undefined;

	const handleAvatar = () => {
		if (activeTab === 1) {
			return url;
		} else {
			return nftUrl;
		}
	};

	const onSaveAvatar = async () => {
		try {
			const { data: response } = await updateUser({
				variables: {
					avatar: handleAvatar(),
				},
			});

			if (response.updateUser) {
				account && dispatch(fetchUserByAddress(account));
				gToast('Profile Photo updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				onDelete();
			} else {
				throw 'updateUser false';
			}
		} catch (error: any) {
			gToast('Failed to update your information. Please try again.', {
				type: ToastType.DANGER,
				title: error.message,
			});
			captureException(error, {
				tags: {
					section: 'onSaveAvatar',
				},
			});
		}
	};

	useEffect(() => {
		const compareHashes = () => {
			const regex = /(\d+)\.\w+$/;
			const selectedAvatarHash = user.avatar?.match(regex)?.[0] ?? null;
			if (pfpData && pfpData.length > 0) {
				pfpData.find(pfp => {
					const pfpHash =
						pfp.imageIpfs.match(regex)?.[0] ?? undefined;
					if (pfpHash === selectedAvatarHash) {
						setSelectedPFP(pfp);
					}
				});
			}
		};
		compareHashes();
	}, []);

	return (
		<Wrapper>
			<Flex gap='16px'>
				{tabs.map(i => (
					<TabItem
						onClick={() => setActiveTab(i.id)}
						className={activeTab === i.id ? 'active' : ''}
						key={i.id}
						active={activeTab === i.id}
					>
						{i.title}
					</TabItem>
				))}
			</Flex>
			{activeTab === EProfilePicTab.LOADING && <Spinner />}
			{activeTab === EProfilePicTab.UPLOAD && (
				<Flex flexDirection='column' gap='36px'>
					<ImageUploader {...useUploadProps} />
					<Flex flexDirection='row' justifyContent='space-between'>
						<Button
							buttonType='secondary'
							label='SAVE'
							disabled={!url}
							onClick={onSaveAvatar}
						/>
						<TextButton
							buttonType='texty'
							label={formatMessage({
								id: 'label.cancel',
							})}
							onClick={() => {
								onDelete();
							}}
						/>
					</Flex>
				</Flex>
			)}
			{activeTab === EProfilePicTab.PFP && (
				<>
					{pfpData && pfpData.length > 0 ? (
						<Flex flexDirection='column' gap='36px'>
							<CustomH5>
								Your Unique Giveth’s PFP Artwork
							</CustomH5>
							<Flex gap='25px' flexWrap>
								{pfpData?.map(pfp => (
									<PfpItem
										onClick={() => setSelectedPFP(pfp)}
										image={pfp.imageIpfs}
										key={pfp.tokenId}
										isSelected={
											pfp.tokenId === selectedPFP?.tokenId
										}
										id={pfp.tokenId}
									/>
								))}
							</Flex>
							{selectedPFP && (
								<SelectedPFPContainer>
									<Flex flexDirection='column' gap='8px'>
										<H6>
											The The Givers Collection #
											{selectedPFP.tokenId}
										</H6>
										<P>
											Short information/summary about the
											selected PFP
										</P>
										<CustomLink
											href={
												config.RARIBLE_ADDRESS +
												'token/' +
												selectedPFP.id.replace('-', ':')
											}
											target='_blank'
										>
											View on Rarible{' '}
											<IconExternalLink16 />
										</CustomLink>
									</Flex>
								</SelectedPFPContainer>
							)}
							<NFTsButtonsContainer
								flexDirection='row'
								justifyContent='space-between'
							>
								<Button
									buttonType='secondary'
									label='SAVE'
									disabled={!nftUrl}
									onClick={onSaveAvatar}
								/>
								<TextButton
									buttonType='texty'
									label={formatMessage({
										id: 'label.cancel',
									})}
									onClick={() => {
										setSelectedPFP(undefined);
									}}
								/>
							</NFTsButtonsContainer>
						</Flex>
					) : (
						<Flex flexDirection='column'>
							<CustomH5>
								Your Unique Giveth’s PFP Artwork
							</CustomH5>
							<NoNFTContainer>
								<FlexCenter direction='column'>
									<IconImage32
										color={neutralColors.gray[500]}
									/>
									<br />
									<P>Sorry!!</P>
									<P>
										This wallet address does not have a
										unique Giveth’s NFT Yet.
									</P>
									<P>
										<MintLink href={Routes.NFT}>
											Mint{' '}
										</MintLink>
										yours now on the NFT minter page.
									</P>
								</FlexCenter>
							</NoNFTContainer>
							<br />
							<Flex justifyContent='space-between'>
								<Link href={Routes.NFT}>
									<Button
										buttonType='secondary'
										label='MINT NOW'
										type='submit'
									/>
								</Link>
								<TextButton
									buttonType='texty'
									label='DO IT LATER'
									// onClick={closeModal}
								/>
							</Flex>
						</Flex>
					)}
				</>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 24px;
	${mediaQueries.laptopL} {
		width: 1100px;
	}
`;

const TextButton = styled(Button)<{ color?: string }>`
	color: ${props => props.color};
	text-transform: uppercase;

	&:hover {
		background-color: transparent;
		color: ${props => props.color};
	}
`;

const CustomH5 = styled(H5)`
	text-align: left;
	margin-top: 16px;
`;

const NoNFTContainer = styled(FlexCenter)`
	flex-direction: column;
	border: 1px dotted ${neutralColors.gray[400]};
	margin: 24px 0 16px 0;
	padding: 64px 20px;
	color: ${brandColors.deep[500]};
	img {
		margin: 0 0 30px 0;
	}
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

const SelectedPFPContainer = styled.div`
	background-color: ${neutralColors.gray[200]};
	border-left: 6px solid ${brandColors.pinky[500]};
	margin-top: 8px;
	padding: 16px 24px;
	border-radius: 8px;
	text-align: left;
`;

const CustomLink = styled.a`
	color: ${brandColors.pinky[500]};
	display: flex;
	align-items: center;
	gap: 8px;
	max-width: fit-content;
`;

const MintLink = styled(Link)`
	max-width: fit-content;
	color: ${brandColors.pinky[500]};
`;

const NFTsButtonsContainer = styled(Flex)`
	margin-bottom: 60px;

	${mediaQueries.tablet} {
		margin-bottom: 0;
	}
`;
