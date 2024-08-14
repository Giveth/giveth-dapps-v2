import styled from 'styled-components';
import { FC } from 'react';
import { FlexCenter } from '@giveth/ui-design-system';
import Input from '@/components/Input';
import { IAddress } from '@/components/views/verification/manageFunds/ManageFundsIndex';
import { RemoveIcon } from '@/components/views/verification/Common';
import { getChainName } from '@/lib/network';
import { ChainType } from '@/types/config';

interface IProps {
	address: IAddress;
	remove: () => void;
}

const UserAddress: FC<IProps> = ({ address, remove }) => {
	const { title, address: walletAddress, networkId, chainType } = address;
	return (
		<Container>
			<Input
				disabled
				value={chainType === ChainType.STELLAR ? walletAddress?.toUpperCase() : walletAddress?.toLowerCase()}
				label={title + ' - ' + getChainName(networkId, chainType)}
				name='walletAddress'
			/>
			<RemoveIcon onClick={remove} />
		</Container>
	);
};

const Container = styled(FlexCenter)`
	gap: 20px;
`;

export default UserAddress;
