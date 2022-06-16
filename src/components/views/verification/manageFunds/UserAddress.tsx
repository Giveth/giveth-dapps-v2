import styled from 'styled-components';
import { FC } from 'react';
import { IconTrash, neutralColors } from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';
import Input from '@/components/Input';
import { IAddress } from '@/components/views/verification/manageFunds/ManageFundsIndex';

interface IProps {
	address: IAddress;
	remove: () => void;
}

const UserAddress: FC<IProps> = ({ address, remove }) => {
	const { title, address: walletAddress } = address;
	return (
		<Container>
			<Input
				disabled
				value={walletAddress}
				label={title}
				name='walletAddress'
			/>
			<RemoveBtn onClick={remove}>
				<IconTrash color={neutralColors.gray[700]} />
			</RemoveBtn>
		</Container>
	);
};

const RemoveBtn = styled(FlexCenter)`
	background: white;
	border-radius: 50px;
	border: 2px solid ${neutralColors.gray[500]};
	height: 48px;
	width: 60px;
	cursor: pointer;
	margin-top: 15px;
`;

const Container = styled(FlexCenter)`
	gap: 20px;
`;

export default UserAddress;
