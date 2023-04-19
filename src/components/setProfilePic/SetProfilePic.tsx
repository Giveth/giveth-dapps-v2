import {
	brandColors,
	Button,
	H5,
	H6,
	IconExternalLink16,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import useUpload from '@/hooks/useUpload';
import config from '@/configuration';
import Routes from '@/lib/constants/Routes';
import ImageUploader from '../ImageUploader';
import PfpItem from '../modals/UploadProfilePicModal/PfpItem';
import { Flex } from '../styled-components/Flex';
import { TabItem } from '../styled-components/Tabs';
import { IGiverPFPToken } from '@/apollo/types/types';
import { gqlRequest } from '@/helpers/requests';
import { buildUsersPfpInfoQuery } from '@/lib/subgraph/pfpQueryBuilder';
import Spinner from '../Spinner';
import { NoPFP } from './NoPFP';
import { useAvatar } from '@/hooks/useAvatar';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';
import NFTButtons from '../modals/UploadProfilePicModal/NFTButtons';
import { useAppSelector } from '@/features/hooks';
import OnboardButtons from '../modals/UploadProfilePicModal/OnboardButtons';
import AttributeItems from './AttributeItems';

enum EProfilePicTab {
	LOADING,
	UPLOAD,
	PFP,
}

const tabs = [
	{ id: EProfilePicTab.UPLOAD, title: 'Upload Image' },
	{ id: EProfilePicTab.PFP, title: 'My Givers' },
];

interface ISetProfilePic {
	isOnboarding?: boolean;
	callback?: () => void;
	closeModal?: () => void;
}

export const SetProfilePic = ({
	isOnboarding = false,
	callback = () => {},
	closeModal = () => {},
}: ISetProfilePic) => {
	const { loading, activeTab, setActiveTab, onSaveAvatar } = useAvatar();
	const useUploadProps = useUpload();
	const { url, onDelete } = useUploadProps;
	const { userData: user, isLoading } = useAppSelector(state => state.user);
	const { formatMessage } = useIntl();
	const [selectedPFP, setSelectedPFP] = useState<IGiverPFPToken>();
	const [pfpData, setPfpData] = useState<IGiverPFPToken[]>();
	const attributeSectionRef = useRef<HTMLDivElement>(null);
	const [sectionHeight, setSectionHeight] = useState<number>(0);
	const [counter, setCounter] = useState(1);

	const nftUrl = () => {
		if (!selectedPFP) return undefined;
		return convertIPFSToHTTPS(selectedPFP?.imageIpfs);
	};

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
					setPfpData(data[`user_${walletAddress}`]);
					setActiveTab(EProfilePicTab.PFP);
				} else {
					setActiveTab(EProfilePicTab.PFP);
				}
			} catch (error) {
				setActiveTab(EProfilePicTab.PFP);
			}
		};
		if (user?.walletAddress) {
			fetchPFPInfo(user.walletAddress);
		}
	}, [user]);

	useEffect(() => {
		const compareHashes = () => {
			const regex = /(\d+)\.\w+$/;
			const selectedAvatarHash = user?.avatar?.match(regex)?.[0] ?? null;
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
	}, [pfpData, user?.avatar]);

	useEffect(() => {
		const handleResize = () => {
			if (attributeSectionRef.current) {
				const element =
					attributeSectionRef.current.querySelector('div');
				if (element) setSectionHeight(element.offsetHeight);
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
			setCounter(counter + 1);
		}, 100);

		return () => window.removeEventListener('resize', handleResize);
	}, [selectedPFP, counter]);

	return activeTab === EProfilePicTab.LOADING || isLoading === true ? (
		<Wrapper>
			<Spinner />
		</Wrapper>
	) : (
		<>
			<CustomWrapper isOnboarding={isOnboarding}>
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
				{activeTab === EProfilePicTab.UPLOAD && (
					<Flex flexDirection='column' gap='36px'>
						<ImageUploader {...useUploadProps} />
						{isOnboarding ? (
							<OnboardButtons
								nftUrl={nftUrl}
								saveAvatar={() =>
									onSaveAvatar(onDelete, nftUrl(), url).then(
										() => {
											callback && callback();
										},
									)
								}
								setSelectedPFP={setSelectedPFP}
								callback={callback}
								isSaveDisabled={!url}
								loading={loading}
							/>
						) : (
							<Flex
								flexDirection='row'
								justifyContent='space-between'
							>
								<Button
									buttonType='secondary'
									label='SAVE'
									disabled={!url}
									loading={loading}
									onClick={() =>
										onSaveAvatar(onDelete, nftUrl(), url)
									}
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
						)}
					</Flex>
				)}
				{activeTab === EProfilePicTab.PFP && (
					<>
						{pfpData && pfpData.length > 0 ? (
							<Flex flexDirection='column' gap='30px'>
								<CustomH5>Your Givers PFP NFTs</CustomH5>
								<PFPItemsContainer gap='25px'>
									{pfpData?.map(pfp => (
										<PfpItem
											onClick={() => setSelectedPFP(pfp)}
											image={pfp.imageIpfs}
											key={pfp.tokenId}
											isSelected={
												pfp.tokenId ===
												selectedPFP?.tokenId
											}
											id={pfp.tokenId}
										/>
									))}
								</PFPItemsContainer>
								<SelectedPFPContainerWrapper
									isOpen={!!selectedPFP}
									divheight={sectionHeight}
									ref={attributeSectionRef}
								>
									{selectedPFP && (
										<AttributesWrapper
											flexDirection='column'
											gap='16px'
										>
											<H6>
												The Givers Collection #
												{selectedPFP.tokenId}
											</H6>
											<SelectedPFPContainer
												gap='16px'
												flexWrap
											>
												<AttributeItems
													id={selectedPFP.tokenId}
												/>
											</SelectedPFPContainer>
											<Flex
												flexDirection='column'
												gap='8px'
											>
												<CustomLink
													href={
														config.RARIBLE_ADDRESS +
														'token/' +
														selectedPFP.id.replace(
															'-',
															':',
														)
													}
													target='_blank'
												>
													View on Rarible{' '}
													<IconExternalLink16 />
												</CustomLink>
											</Flex>
										</AttributesWrapper>
									)}
								</SelectedPFPContainerWrapper>
								{isOnboarding ? (
									<OnboardButtons
										nftUrl={nftUrl}
										saveAvatar={() =>
											onSaveAvatar(
												onDelete,
												nftUrl(),
												url,
											).then(() => {
												callback && callback();
											})
										}
										setSelectedPFP={setSelectedPFP}
										callback={callback}
										isSaveDisabled={!nftUrl()}
										loading={loading}
									/>
								) : (
									<HideInDesktop>
										<NFTButtons
											saveAvatar={() =>
												onSaveAvatar(
													onDelete,
													nftUrl(),
													url,
												)
											}
											setSelectedPFP={setSelectedPFP}
											nftUrl={nftUrl}
											loading={loading}
										/>
									</HideInDesktop>
								)}
							</Flex>
						) : (
							<Flex flexDirection='column' alignItems='stretch'>
								<NoPFP />
								<br />
								<Flex justifyContent='space-between'>
									<Link
										href={Routes.NFT}
										style={{
											width: isOnboarding ? '100%' : '',
										}}
									>
										{isOnboarding ? (
											<OnboardingMintNowButton
												buttonType='secondary'
												label='MINT NOW'
												type='submit'
											/>
										) : (
											<Button
												buttonType='secondary'
												label='MINT NOW'
												type='submit'
											/>
										)}
									</Link>
									<TextButton
										buttonType='texty'
										label='DO IT LATER'
										onClick={() => {
											if (isOnboarding) {
												callback && callback();
											} else {
												closeModal();
											}
										}}
									/>
								</Flex>
							</Flex>
						)}
					</>
				)}
			</CustomWrapper>
			{activeTab === EProfilePicTab.PFP &&
				!isOnboarding &&
				pfpData &&
				pfpData?.length > 0 && (
					<HideInMobile>
						<NFTButtons
							saveAvatar={() =>
								onSaveAvatar(onDelete, nftUrl(), url)
							}
							setSelectedPFP={setSelectedPFP}
							nftUrl={nftUrl}
							loading={loading}
						/>
					</HideInMobile>
				)}
		</>
	);
};

const Wrapper = styled.div`
	padding: 24px;
	width: 100%;
	${mediaQueries.laptopL} {
		width: 1400px;
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

export const CustomH5 = styled(H5)`
	text-align: left;
	margin-top: 16px;
`;

const SelectedPFPContainer = styled(Flex)`
	border-left: 6px solid ${brandColors.pinky[500]};
	margin-top: 8px;
	padding: 16px 24px;
	text-align: left;
`;

const CustomLink = styled.a`
	color: ${brandColors.pinky[500]};
	display: flex;
	align-items: center;
	gap: 8px;
	max-width: fit-content;
`;

const AttributesWrapper = styled(Flex)`
	text-align: left;
`;

const SelectedPFPContainerWrapper = styled.div<{
	isOpen: boolean;
	divheight: number;
}>`
	height: ${props => (props.isOpen ? props.divheight + 'px' : '0px')};
	transition: height 0.3s ease-in-out;
`;

const OnboardingMintNowButton = styled(Button)`
	width: 70%;
`;

const PFPItemsContainer = styled(Flex)`
	overflow-x: auto;
	padding: 16px 0;
`;

const HideInMobile = styled.div`
	display: none;
	${mediaQueries.tablet} {
		display: inline-block;
		width: 100%;
	}
`;

const HideInDesktop = styled.div`
	display: block;
	width: 100%;
	${mediaQueries.tablet} {
		display: none;
	}
`;

const CustomWrapper = styled(Wrapper)<{ isOnboarding: boolean }>`
	${mediaQueries.tablet} {
		max-height: ${props => (props.isOnboarding ? '' : '640px')};
		overflow-y: auto;
	}
`;
