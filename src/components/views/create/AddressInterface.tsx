import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	Button,
	GLink,
	IconArrowRight16,
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
		getValues,
	} = useFormContext();

	const { chainId = 1 } = useWeb3React();

	const inputName = EInputs.addresses[chainId];

	const address = getValues(inputName);

	const { formatMessage } = useIntl();

	const hasAddress = !!address && !errors[inputName]?.message;

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
				<AddressContainer hasAddress={hasAddress}>
					{hasAddress ? address : 'No address added yet!'}
				</AddressContainer>
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
	border: 2px solid ${neutralColors.gray[300]};
	background-color: ${props =>
		props.hasAddress ? neutralColors.gray[100] : neutralColors.gray[300]};
	border-radius: 8px;
	color: ${props =>
		props.hasAddress ? neutralColors.gray[900] : neutralColors.gray[500]};
	padding: 16px;
	overflow-x: auto;
`;

export default AddressInterface;
