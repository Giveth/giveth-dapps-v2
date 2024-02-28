import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
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
} from '@giveth/ui-design-system';
import NetworkLogo from '@/components/NetworkLogo';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import config, { isRecurringActive } from '@/configuration';
import ToggleSwitch from '@/components/ToggleSwitch';
import { getChainName } from '@/lib/network';
import { IChainType } from '@/types/config';
import { findAddressByChain } from '@/lib/helpers';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { IAnchorContractData } from '@/apollo/types/types';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { EInputs } from './types';
import links from '@/lib/constants/links';

interface IAddressInterfaceProps extends IChainType {
	networkId: number;
	onButtonClick?: () => void;
	anchorContractData?: IAnchorContractData;
	isEditMode?: boolean;
}

interface IconContainerProps {
	$disabled?: boolean;
}

const AddressInterface = ({
	networkId,
	onButtonClick,
	chainType,
	anchorContractData,
	isEditMode,
}: IAddressInterfaceProps) => {
	const { setValue, watch } = useFormContext();
	const { formatMessage } = useIntl();
	const { isOnEVM } = useGeneralWallet();

	const inputName = EInputs.addresses;
	const alloProtocolRegistry = watch(EInputs.alloProtocolRegistry) as boolean;

	const value = watch(inputName);

	const isOptimism = networkId === config.OPTIMISM_NETWORK_NUMBER;

	const addressObj = findAddressByChain(value, networkId, chainType);
	const walletAddress = addressObj?.address;

	const hasAddress = !!walletAddress;
	const hasAnchorContract = !!anchorContractData?.isActive;
	const hasOptimismAddress = !!findAddressByChain(
		value,
		config.OPTIMISM_NETWORK_NUMBER,
		chainType,
	);

	return (
		<Container>
			<TopContainer>
				<Flex justifyContent='space-between'>
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
					justifyContent='space-between'
					alignItems='center'
					gap='8px'
				>
					<AddressContainer hasAddress={hasAddress}>
						{hasAddress ? walletAddress : 'No address added yet!'}
					</AddressContainer>
					{hasAddress &&
						(hasAnchorContract && isOptimism ? (
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
									if (isOptimism) {
										setValue(
											EInputs.alloProtocolRegistry,
											false,
										);
									}
								}}
							>
								<IconTrash24 />
							</IconContainer>
						))}
				</Flex>
				{isOptimism && isRecurringActive && isOnEVM && (
					// Render this section only on Optimism
					<AlloProtocolContainer>
						<Flex>
							<div>
								<B>
									{hasAnchorContract && isEditMode
										? formatMessage({
												id: 'label.allo_protocol_registry_set_up',
											})
										: formatMessage({
												id: 'label.set_up_profile_on_the_allo_protocol_registry',
											})}
								</B>
								<div>
									<CustomP>
										{hasAnchorContract && isEditMode
											? formatMessage({
													id: 'label.your_project_is_set_up_to_receive_recurring_donations',
												})
											: formatMessage({
													id: 'label.do_you_want_this_project_to_be_setup_to_receive_recurring_donations',
												})}
									</CustomP>
									<CustomLink
										href={links.ALLO_PROTOCOL}
										target='_blank'
									>
										Allo Protocol
									</CustomLink>
									{hasAnchorContract && isEditMode
										? '.'
										: '?'}
								</div>
							</div>
							{hasAnchorContract && isEditMode ? (
								<IconCheckContainer>
									<IconCheck16 color={brandColors.giv[100]} />
								</IconCheckContainer>
							) : (
								<ToggleSwitch
									isOn={alloProtocolRegistry}
									toggleOnOff={() => {
										if (!hasOptimismAddress) return;
										setValue(
											EInputs.alloProtocolRegistry,
											!alloProtocolRegistry,
										);
									}}
									label=''
									disabled={!hasOptimismAddress}
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
	padding: 24px 0;
`;

const AddressContainer = styled.div<{ hasAddress: boolean }>`
	width: 100%;
	border: 2px solid ${neutralColors.gray[300]};
	background-color: ${props =>
		props.hasAddress ? neutralColors.gray[100] : neutralColors.gray[300]};
	border-radius: 8px;
	color: ${props =>
		props.hasAddress ? neutralColors.gray[900] : neutralColors.gray[500]};
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

export default AddressInterface;
