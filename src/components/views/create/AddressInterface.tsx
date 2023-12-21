import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	Button,
	GLink,
	IconArrowRight16,
	IconTrash24,
	neutralColors,
} from '@giveth/ui-design-system';
import { EInputs } from '@/components/views/create/CreateProject';
import NetworkLogo from '@/components/NetworkLogo';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { chainNameById } from '@/lib/network';
import { IChainType } from '@/types/config';
import { findAddressByChain } from '@/lib/helpers';

interface IAddressInterfaceProps extends IChainType {
	networkId: number;
	onButtonClick?: () => void;
}

const AddressInterface = (props: IAddressInterfaceProps) => {
	const { networkId, onButtonClick, chainType } = props;
	const { setValue, getValues } = useFormContext();

	const inputName = EInputs.addresses;

	const addresses = getValues(inputName);
	const addressObj = findAddressByChain(addresses, networkId, chainType);
	const walletAddress = addressObj?.address;
	const { formatMessage } = useIntl();

	const hasAddress = !!walletAddress;

	return (
		<Container>
			<TopContainer>
				<Flex justifyContent='space-between'>
					<Flex gap='8px'>
						<ChainIconShadow>
							<NetworkLogo chainId={networkId} logoSize={24} />
						</ChainIconShadow>
						{formatMessage(
							{ id: 'label.chain_address' },
							{
								chainName: chainNameById(networkId),
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
								chainName: chainNameById(networkId),
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
					{hasAddress && (
						<IconContainer
							onClick={() => {
								const _addresses = [...addresses];
								_addresses.splice(
									_addresses.indexOf(addressObj),
									1,
								);
								setValue(inputName, _addresses);
							}}
						>
							<IconTrash24 />
						</IconContainer>
					)}
				</Flex>
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

const IconContainer = styled(FlexCenter)`
	height: 50px;
	width: 50px;
	border-radius: 50%;
	cursor: pointer;
	transition: background-color 0.2s ease-in-out;
	:hover {
		background-color: ${neutralColors.gray[300]};
	}
`;

export default AddressInterface;
