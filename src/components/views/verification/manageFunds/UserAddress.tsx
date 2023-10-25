import styled from 'styled-components';
import { FC } from 'react';
import { FlexCenter } from '@/components/styled-components/Flex';
import Input from '@/components/Input';
import { IAddress } from '@/components/views/verification/manageFunds/ManageFundsIndex';
import { RemoveIcon } from '@/components/views/verification/Common';
import { chainNameById } from '@/lib/network';

interface IProps {
	address: IAddress;
	remove: () => void;
}

const UserAddress: FC<IProps> = ({ address, remove }) => {
	const { title, address: walletAddress, networkId } = address;
	return (
		<Container>
			<Input
				disabled
				value={walletAddress?.toLowerCase()}
				label={title + ' - ' + chainNameById(networkId)}
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
