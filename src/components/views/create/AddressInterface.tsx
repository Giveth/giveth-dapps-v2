import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	Button,
	IconArrowRight16,
	neutralColors,
} from '@giveth/ui-design-system';
import config from '@/configuration';
import { EInputs } from '@/components/views/create/CreateProject';
import { networksParams } from '@/helpers/blockchain';
import { IconEthereum } from '@/components/Icons/Eth';
import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import NetworkLogo from '@/components/NetworkLogo';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex } from '@/components/styled-components/Flex';

interface IAddressInterfaceProps {
	networkId: number;
	address: string;
}

const AddressInterface = ({ networkId, address }: IAddressInterfaceProps) => {
	const {
		register,
		formState: { errors },
		getValues,
		clearErrors,
	} = useFormContext();

	const isMainnet = networkId === config.MAINNET_NETWORK_NUMBER;
	const isGnosis = networkId === config.XDAI_NETWORK_NUMBER;
	const isPolygon = networkId === config.POLYGON_NETWORK_NUMBER;
	const isCelo = networkId === config.CELO_NETWORK_NUMBER;
	const isOptimism = networkId === config.OPTIMISM_NETWORK_NUMBER;
	const inputName = isGnosis
		? EInputs.gnosisAddress
		: isPolygon
		? EInputs.polygonAddress
		: isCelo
		? EInputs.celoAddress
		: isOptimism
		? EInputs.optimismAddress
		: EInputs.mainAddress;
	const value = getValues(inputName);
	console.log('Value', value);
	console.log('inputName', inputName);
	const { formatMessage } = useIntl();

	let caption: string = '';
	if (!value) {
		caption = `${formatMessage({
			id: 'label.you_can_enter_a_new_address',
		})} ${
			isGnosis
				? 'Gnosis Chain'
				: isPolygon
				? 'Polygon Mainnet'
				: isCelo
				? 'Celo Mainnet'
				: isOptimism
				? 'Optimism'
				: 'Mainnet'
		}.`;
	}

	const NetworkIcon = isGnosis ? (
		<GnosisIcon />
	) : isPolygon ? (
		<PolygonIcon />
	) : isCelo ? (
		<CeloIcon />
	) : isOptimism ? (
		<OptimismIcon />
	) : (
		<MainnetIcon />
	);

	return (
		<Container>
			<TopContainer>
				<Flex justifyContent='space-between'>
					<Flex gap='8px'>
						{NetworkIcon}
						{formatMessage(
							{ id: 'label.chain_address' },
							{
								chainName: networksParams[networkId].chainName,
							},
						)}
					</Flex>
					<Button
						buttonType='texty-secondary'
						label='Add Address'
						icon={<IconArrowRight16 />}
					/>
				</Flex>
			</TopContainer>
			<MiddleContainer></MiddleContainer>
		</Container>
	);
};

const OptimismIcon = () => (
	<ChainIconShadow>
		<NetworkLogo logoSize={24} chainId={config.OPTIMISM_NETWORK_NUMBER} />
	</ChainIconShadow>
);

const CeloIcon = () => (
	<ChainIconShadow>
		<NetworkLogo logoSize={24} chainId={config.CELO_NETWORK_NUMBER} />
	</ChainIconShadow>
);

const PolygonIcon = () => (
	<ChainIconShadow>
		<NetworkLogo logoSize={24} chainId={config.POLYGON_NETWORK_NUMBER} />
	</ChainIconShadow>
);

const GnosisIcon = () => (
	<ChainIconShadow>
		<IconGnosisChain size={24} />
	</ChainIconShadow>
);

const MainnetIcon = () => (
	<ChainIconShadow>
		<IconEthereum size={24} />
	</ChainIconShadow>
);

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
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

export default AddressInterface;
