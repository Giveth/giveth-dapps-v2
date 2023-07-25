import { mediaQueries, neutralColors, Subline } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { utils } from 'ethers';
import { FlexCenter } from '@/components/styled-components/Flex';
import NetworkLogo from '@/components/NetworkLogo';

const ProjectWalletAddress = (props: {
	address: string;
	networkId: number;
}) => {
	const { address, networkId } = props;
	const checksumAddress = utils.getAddress(address);

	return (
		<AddressContainer>
			<Subline>{checksumAddress}</Subline>
			<NetworkLogo chainId={networkId} logoSize={24} />
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
