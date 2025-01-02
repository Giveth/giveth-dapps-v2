import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useAccount, useSwitchChain } from 'wagmi';
import styled, { css } from 'styled-components';
import {
	B,
	Button,
	GLink,
	IconArrowRight16,
	IconCheck16,
	IconTrash24,
	P,
	brandColors,
	neutralColors,
	semanticColors,
	Flex,
	FlexCenter,
} from '@giveth/ui-design-system';
import NetworkLogo from '@/components/NetworkLogo';
import { Shadow } from '@/components/styled-components/Shadow';
import config from '@/configuration';
import ToggleSwitch from '@/components/ToggleSwitch';
import { getChainName } from '@/lib/network';
import { IChainType } from '@/types/config';
import { findAddressByChain } from '@/lib/helpers';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import {
	IAnchorContractBasicData,
	IAnchorContractData,
	IProject,
} from '@/apollo/types/types';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { EInputs } from './types';
import links from '@/lib/constants/links';
import { saveAnchorContract } from './AlloProtocol/AlloProtocolModal';
import { useAppSelector } from '@/features/hooks';

interface IAddressInterfaceProps extends IChainType {
	networkId: number;
	project?: IProject;
	onButtonClick?: () => void;
	anchorContractData?: IAnchorContractData;
	isEditMode?: boolean;
}

interface IconContainerProps {
	$disabled?: boolean;
}

const AddressInterface = ({
	networkId,
	project,
	onButtonClick,
	chainType,
	anchorContractData,
	isEditMode,
}: IAddressInterfaceProps) => {
	const { chain } = useAccount();
	const { userData } = useAppSelector(state => state.user);
	const { switchChain } = useSwitchChain();
	const { setValue, watch } = useFormContext();
	const { formatMessage } = useIntl();
	const { isOnEVM } = useGeneralWallet();

	const DO_RECURRING_SETUP_ON_ENABLE = true;

	const [hasAnchorContract, setHasAnchorContract] = useState(
		anchorContractData?.isActive || false,
	);

	const isOnOptimism = chain
		? chain.id === config.OPTIMISM_NETWORK_NUMBER
		: false;
	const isOnBase = chain ? chain.id === config.BASE_NETWORK_NUMBER : false;

	const inputName = EInputs.addresses;
	const value = watch(inputName);

	const isOptimism = networkId === config.OPTIMISM_NETWORK_NUMBER;
	const isBase = networkId === config.BASE_NETWORK_NUMBER;

	const alloContract = isBase
		? EInputs.baseAnchorContract
		: EInputs.opAnchorContract;
	const alloProtocolRegistry = watch(
		alloContract,
	) as IAnchorContractBasicData;

	const addressObj = findAddressByChain(value, networkId, chainType);
	const walletAddress = addressObj?.address;

	const hasAddress = !!walletAddress;

	const hasOptimismAddress = !!findAddressByChain(
		value,
		config.OPTIMISM_NETWORK_NUMBER,
		chainType,
	);
	const hasBaseAddress = !!findAddressByChain(
		value,
		config.BASE_NETWORK_NUMBER,
		chainType,
	);
	const isRecurringOnOptimismReady = isOptimism && hasOptimismAddress;
	const isRecurringOnBaseReady = isBase && hasBaseAddress;
	const isRecurringDonationsReady =
		isRecurringOnBaseReady || isRecurringOnOptimismReady;

	return (
		<Container>
			<TopContainer>
				<Flex $justifyContent='space-between'>
					<Flex gap='8px'>
						<ChainIconShadow>
							<NetworkLogo
								chainType={chainType}
								chainId={networkId}
								logoSize={24}
							/>
						</ChainIconShadow>
						{formatMessage(
							{ id: 'label.chain_address' },
							{
								chainName: getChainName(networkId, chainType),
							},
						)}
					</Flex>
					<Button
						buttonType='texty-secondary'
						label={hasAddress ? 'Edit Address' : 'Add Address'}
						icon={<IconArrowRight16 />}
						onClick={onButtonClick}
					/>
				</Flex>
			</TopContainer>
			<MiddleContainer>
				{hasAddress && (
					<GLink>
						{formatMessage(
							{
								id: 'label.receiving_address_on',
							},
							{
								chainName: getChainName(networkId, chainType),
							},
						)}
					</GLink>
				)}
				<Flex
					$justifyContent='space-between'
					$alignItems='center'
					gap='8px'
				>
					<AddressContainer $hasAddress={hasAddress}>
						{hasAddress ? walletAddress : 'No address added yet!'}
					</AddressContainer>
					{hasAddress &&
						(hasAnchorContract && (isOptimism || isBase) ? (
							<IconWithTooltip
								direction='top'
								icon={
									<IconContainer $disabled>
										<IconTrash24
											color={neutralColors.gray[600]}
										/>
									</IconContainer>
								}
							>
								{formatMessage({
									id: 'label.you_cannot_remove_your_optimism_recipient_address',
								})}
							</IconWithTooltip>
						) : (
							<IconContainer
								onClick={() => {
									const _addresses = [...value];
									_addresses.splice(
										_addresses.indexOf(addressObj),
										1,
									);
									setValue(inputName, _addresses);
									setValue(alloContract, false);
								}}
							>
								<IconTrash24 />
							</IconContainer>
						))}
				</Flex>
				{(isOptimism || isBase) && isOnEVM && (
					// Render this section only on Optimism and Base
					<AlloProtocolContainer>
						<Flex $flexDirection='column' $alignItems='end'>
							<div>
								<B>
									{hasAnchorContract && isEditMode
										? formatMessage({
												id: 'label.allo_protocol_registry_set_up',
											})
										: formatMessage({
												id: 'label.enable_recurring_donations',
											})}
								</B>
								<div>
									<CustomP>
										{hasAnchorContract && isEditMode
											? formatMessage({
													id: 'label.your_project_is_set_up_to_receive_recurring_donations',
												})
											: hasAnchorContract
												? formatMessage(
														{
															id: 'label.this_project_is_now_set_up_publish_and_finalize_it',
														},
														{
															network: isOptimism
																? 'Optimism'
																: 'Base',
														},
													)
												: formatMessage({
														id: 'label.do_you_want_this_project_to_be_setup_to_receive_recurring_donations',
													})}
									</CustomP>
									<CustomLink
										href={links.RECURRING_DONATION_DOCS}
										target='_blank'
									>
										{formatMessage({
											id: 'label.learn_more_recurring_donations',
										})}
									</CustomLink>
									.
								</div>
							</div>
							{hasAnchorContract ? (
								<IconCheckContainer>
									<IconCheck16 color={brandColors.giv[100]} />
								</IconCheckContainer>
							) : DO_RECURRING_SETUP_ON_ENABLE ? (
								<EnableBtn>
									<Button
										buttonType={
											isRecurringDonationsReady
												? 'secondary'
												: 'texty-secondary'
										}
										label={'Enable'}
										disabled={
											!isRecurringDonationsReady ||
											hasAnchorContract
										}
										onClick={async () => {
											if (
												isRecurringOnOptimismReady &&
												!isOnOptimism
											) {
												switchChain?.({
													chainId:
														config.OPTIMISM_NETWORK_NUMBER,
												});
											} else if (
												isRecurringOnBaseReady &&
												!isOnBase
											) {
												switchChain?.({
													chainId:
														config.BASE_NETWORK_NUMBER,
												});
											}

											if (project) {
												await saveAnchorContract({
													addedProjectState: project,
													chainId: networkId,
													recipientAddress:
														walletAddress || value,
												});
												setHasAnchorContract(true);
											} else {
												const alloContract =
													(await saveAnchorContract({
														chainId: networkId,
														recipientAddress:
															walletAddress ||
															value,
														isDraft: true,
														userId: userData?.id,
														ownerAddres:
															userData?.walletAddress,
													})) as IAnchorContractBasicData;

												setValue(
													isOptimism
														? EInputs.opAnchorContract
														: EInputs.baseAnchorContract,
													{
														recipientAddress:
															walletAddress ||
															value,
														enabled: true,
														contractAddress:
															alloContract.contractAddress,
														hash: alloContract.hash,
													},
												);
												setHasAnchorContract(true);
											}
										}}
									/>
								</EnableBtn>
							) : (
								<ToggleSwitch
									isOn={!!alloProtocolRegistry?.enabled}
									toggleOnOff={() => {
										if (!isRecurringDonationsReady) return;
										setValue(alloContract, {
											recipientAddress:
												walletAddress || value,
											enabled:
												!alloProtocolRegistry?.enabled,
										});
									}}
									label=''
									disabled={!isRecurringDonationsReady}
								/>
							)}
						</Flex>
					</AlloProtocolContainer>
				)}
			</MiddleContainer>
		</Container>
	);
};

const Container = styled.div`
	margin-top: 25px;
	background: ${neutralColors.gray[100]};
	border-radius: 12px;
	padding: 16px;
`;

const ChainIconShadow = styled.div`
	height: 24px;
	width: fit-content;
	border-radius: 50%;
	box-shadow: ${Shadow.Giv[400]};
`;

const TopContainer = styled.div`
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const MiddleContainer = styled.div`
	padding: 24px 0 0 0;
`;

const AddressContainer = styled.div<{ $hasAddress: boolean }>`
	width: 100%;
	border: 2px solid ${neutralColors.gray[300]};
	background-color: ${props =>
		props.$hasAddress ? neutralColors.gray[100] : neutralColors.gray[300]};
	border-radius: 8px;
	color: ${props =>
		props.$hasAddress ? neutralColors.gray[900] : neutralColors.gray[500]};
	padding: 16px;
	overflow-x: auto;
`;

const IconContainer = styled(FlexCenter)<IconContainerProps>`
	height: 50px;
	width: 50px;
	border-radius: 50%;
	cursor: pointer;
	transition: background-color 0.2s ease-in-out;

	${props =>
		!props.$disabled &&
		css`
			&:hover {
				background-color: ${neutralColors.gray[300]};
			}
		`}
`;

const AlloProtocolContainer = styled.div`
	margin-top: 24px;
`;

const IconCheckContainer = styled(FlexCenter)`
	width: 24px;
	height: 24px;
	border-radius: 50px;
	background-color: ${semanticColors.jade[500]};
	padding: 5px;
`;

const CustomP = styled(P)`
	display: inline;
`;

const CustomLink = styled.a`
	color: ${brandColors.giv[500]};
	text-decoration: none;
	cursor: pointer;
`;

const EnableBtn = styled.div`
	width: 100px;
	margin: 12px 0 0 0;
`;

export default AddressInterface;
