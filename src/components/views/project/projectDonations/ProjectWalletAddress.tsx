import {
	mediaQueries,
	neutralColors,
	Subline,
	FlexCenter,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { getAddress } from 'viem';
import NetworkLogo from '@/components/NetworkLogo';
import { ChainType } from '@/types/config';

interface IProjectWalletAddressProps {
	address: string;
	networkId: number;
	chainType?: ChainType;
}

const ProjectWalletAddress = (props: IProjectWalletAddressProps) => {
	const { address, networkId, chainType } = props;
	let _address = address;
	if (chainType === ChainType.EVM) {
		_address = getAddress(address);
	}

	return (
		<AddressContainer>
			<Subline>{_address}</Subline>
			<NetworkLogo
				chainId={networkId}
				logoSize={24}
				chainType={chainType}
			/>
		</AddressContainer>
	);
};

const AddressContainer = styled(FlexCenter)`
	margin-top: 8px;
	background: ${neutralColors.gray[200]};
	border-radius: 16px;
	padding: 4px 8px;
	width: fit-content;
	gap: 16px;
	flex-wrap: wrap;
	${mediaQueries.mobileL} {
		flex-wrap: nowrap;
	}
`;

export default ProjectWalletAddress;
