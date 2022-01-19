import React, { useState, useEffect } from 'react';
import Select, { components, ControlProps } from 'react-select';
import InputBox from '@/components/InputBox';
import { useQuery } from '@apollo/client';
import { FETCH_LISTED_TOKENS } from '@/../../src/apollo/gql/gqlEnums';
import { IProject } from '@/apollo/types/types';
import {
	Caption,
	neutralColors,
	brandColors,
	Button,
	GLink,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

type SuccessFunction = (param: boolean) => void;

interface ISelectObj {
	value: string;
	label: string;
	chainId?: number;
	symbol?: string;
	icon?: string;
}

interface IToken {
	name: string;
	chainId: number;
	symbol: string;
	icon?: string;
}

const Control = ({ children, ...props }: ControlProps<ISelectObj, false>) => {
	const { value } = props.selectProps as any;
	return (
		<components.Control {...props}>
			<IconContainer>
				<Img
					key={value?.symbol}
					src={value?.icon ? value.icon : '/images/tokens/eth.png'}
					onError={e => {
						e.currentTarget.onerror = null;
						e.currentTarget.src = '/images/tokens/eth.png';
					}}
					width='24px'
					height='24px'
				/>
				{children}
			</IconContainer>
		</components.Control>
	);
};

const customStyles = {
	control: () => ({
		// match with the menu
		borderRadius: '0 !important',
		borderRightColor: 'transparent !important',
		padding: '8px 0 0 16px !important',
	}),
	menu: (base: any) => ({
		...base,
		// override border radius to match the box
		borderRadius: 0,
		// beautify the word cut by adding a dash see https://caniuse.com/#search=hyphens for the compatibility
		hyphens: 'auto',
		// kill the gap
		marginTop: 0,
		textAlign: 'left',
		// prevent menu to scroll y
		wordWrap: 'break-word',
	}),
	menuList: (base: any) => ({
		...base,
		borderRadius: 0,
		// kill the white space on first and last option
		padding: 0,
	}),
	singleValue: (base: any) => ({
		...base,
		padding: 0,
	}),
};

const CryptoDonation = (props: {
	setSuccessDonation: SuccessFunction;
	project: IProject;
}) => {
	const { setSuccessDonation } = props;
	const { data: tokensList } = useQuery(FETCH_LISTED_TOKENS);

	const [tokens, setTokensObject] = useState<ISelectObj[]>();
	const [currentChainId, setCurrentChainId] = useState<number>(1);
	const [selectedToken, setSelectedToken] = useState<ISelectObj[]>();

	const buildTokensObj = (array: IToken[], chain: number) => {
		const newArray = [tokensList];
		array.forEach(e => {
			if (e.chainId !== chain) return;
			const obj: ISelectObj = {
				label: e.symbol,
				value: e.symbol,
				chainId: e.chainId,
				icon: `/images/tokens/${e.symbol?.toLocaleLowerCase()}.png`,
			};
			newArray.push(obj);
		});
		newArray.sort((a, b) => a.label.localeCompare(b.label));
		// setSelectedToken(newArray && newArray[0])
		return newArray;
	};

	useEffect(() => {
		if (!tokensList) return;
		setTokensObject(buildTokensObj(tokensList?.tokens, currentChainId));
	}, [tokensList]);

	return (
		<>
			<SearchContainer>
				<DropdownContainer>
					<Select
						styles={customStyles}
						classNamePrefix='select'
						value={selectedToken}
						components={{ Control }}
						onChange={(e: any) => setSelectedToken(e)}
						options={tokens}
					/>
				</DropdownContainer>
				<SearchBarContainer>
					<InputBox onChange={() => null} placeholder='Amount' />
				</SearchBarContainer>
			</SearchContainer>
			<AvText>Available: 0.064208 ETH </AvText>
			<XDaiContainer>
				<div>
					<img src='/images/gas_station.svg' />
					<Caption color={neutralColors.gray[800]}>
						Save on gas fees, switch to xDAI network.
					</Caption>
				</div>
				<Caption color={brandColors.giv[500]}>Switch network</Caption>
			</XDaiContainer>
			<ButtonContainer>
				<Button
					label='CONNECT WALLET'
					onClick={() => setSuccessDonation(true)}
				></Button>
			</ButtonContainer>
		</>
	);
};

const Img = styled.img`
	margin-right: -10px;
	margin-top: 5px;
`;
const IconContainer = styled.div`
	display: flex;
	flex-direction: row;
`;
const AvText = styled(GLink)`
	padding: 4px 0 0 5px;
`;
const SearchContainer = styled.div`
	display: flex;
	flex-direction: row;
`;
const DropdownContainer = styled.div`
	width: 35%;
	height: 54px;
`;
const SearchBarContainer = styled.div`
	height: 54px;
	width: 65%;
	border: 2px solid ${neutralColors.gray[300]};
`;
const XDaiContainer = styled.div`
	display: flex;
	flex: row;
	justify-content: space-between;
	background-color: ${neutralColors.gray[200]};
	padding: 8px 16px;
	margin: 24px 0 0 0;
	cursor: pointer;
	border-radius: 8px;
	div:first-child {
		display: flex;
		flex-direction: row;
		img {
			padding-right: 12px;
		}
	}
`;
const ButtonContainer = styled.div`
	padding: 51px 0 0 0;
`;

export default CryptoDonation;
