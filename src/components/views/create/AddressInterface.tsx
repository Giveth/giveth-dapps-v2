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
import { useWeb3React } from '@web3-react/core';
import config from '@/configuration';
import { EInputs } from '@/components/views/create/CreateProject';
import { networksParams } from '@/helpers/blockchain';
import NetworkLogo from '@/components/NetworkLogo';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex } from '@/components/styled-components/Flex';

interface IAddressInterfaceProps {
	networkId: number;
	onButtonClick?: () => void;
}

const AddressInterface = ({
	networkId,
	onButtonClick,
}: IAddressInterfaceProps) => {
	const {
		formState: { errors },
		setValue,
		watch,
	} = useFormContext();

	const { chainId = 1 } = useWeb3React();

	const inputName = EInputs.addresses[chainId];

	const value = watch(inputName);

	const { formatMessage } = useIntl();

	const hasAddress = !!value && !errors[inputName]?.message;

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
								chainName: networksParams[networkId].chainName,
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
								chainName:
									config.NETWORKS_CONFIG[networkId].chainName,
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
						{hasAddress ? value : 'No address added yet!'}
					</AddressContainer>
					{hasAddress && (
						<IconContainer
							onClick={() => {
								setValue(inputName, '');
								console.log('clicked', inputName, value);
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

const IconContainer = styled.div`
	height: 50px;
	width: 50px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background-color 0.2s ease-in-out;
	:hover {
		background-color: ${neutralColors.gray[300]};
	}
`;

export default AddressInterface;
