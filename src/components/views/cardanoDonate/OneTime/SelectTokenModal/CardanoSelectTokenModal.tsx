import styled from 'styled-components';
import { mediaQueries, neutralColors, Flex } from '@giveth/ui-design-system';
import { useState, type FC, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { TokenInfo } from '@/components/views/donate/OneTime/SelectTokenModal/TokenInfo';
import CheckBox from '@/components/Checkbox';
import { WrappedSpinner } from '@/components/Spinner';
import { cardanoAcceptedTokens } from '../../data';
import { formatTokenQuantity, fetchTokenPriceInAdaMuesli } from '../../helpers';
import { ICardanoAcceptedToken } from '../../types';
import { useDonateData } from '@/context/donate.context';

export interface ISelectTokenModalProps extends IModal {
	tokens?: ICardanoAcceptedToken[];
	acceptCustomToken?: boolean;
}

export const CardanoSelectTokenModal: FC<ISelectTokenModalProps> = props => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Select a Token'
			headerTitlePosition='left'
		>
			<SelectTokenInnerModal {...props} />
		</Modal>
	);
};

const SelectTokenInnerModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
}) => {
	const { connected, wallet } = useWallet();
	const { setSelectedOneTimeToken } = useDonateData();

	const [hideZeroBalance, setHideZeroBalance] = useState<boolean>(false);
	const [tokenListForSelect, setTokenListForSelect] = useState<
		ICardanoAcceptedToken[]
	>([]);

	// Fetch user token list
	useEffect(() => {
		if (wallet && connected) {
			const getWalletBalance = async () => {
				const balance = await wallet.getBalance();

				if (balance) {
					// Check if have token on the list
					const tokenList = cardanoAcceptedTokens;

					// Update token price and populate token list
					if (tokenList) {
						const updatedTokenList: any[] = [];
						for (const token of tokenList) {
							// find token in wallet balance array
							const balEntry = balance.find(
								b => b.unit === token.cardano?.unit,
							);
							const quantity = balEntry ? balEntry.quantity : '0';
							const formattedQuantity = formatTokenQuantity(
								quantity,
								token.decimals,
							);

							if (token.cardano?.unit === 'lovelace') {
								updatedTokenList.push({
									id: token.id,
									name: token.name,
									symbol: token.symbol,
									decimals: token.decimals,
									networkId: 1,
									address: token.address,
									cardano: {
										quantity: formattedQuantity,
										rawQuantity: quantity,
										priceAda: 1,
									},
								});
							} else {
								const tokenData =
									await fetchTokenPriceInAdaMuesli(
										token?.cardano?.policyId || '',
										token?.cardano?.nameHex || '',
									);
								if (tokenData) {
									updatedTokenList.push({
										id: token.id,
										name: token.name,
										symbol: token.symbol,
										decimals: token.decimals,
										networkId: 1,
										address: token.address,
										cardano: {
											quantity: formattedQuantity,
											rawQuantity: quantity,
											priceAda: tokenData,
										},
									});
								} else {
									updatedTokenList.push({
										id: token.id,
										name: token.name,
										symbol: token.symbol,
										decimals: token.decimals,
										networkId: 1,
										address: token.address,
										cardano: {
											quantity: formattedQuantity,
											rawQuantity: quantity,
											priceAda: 0,
										},
									});
								}
							}
						}
						setTokenListForSelect(updatedTokenList);
					}
				}
			};
			getWalletBalance();
		}
	}, [wallet, connected]);

	return (
		<>
			<Wrapper>
				<CheckBox
					label='Hide 0 balance tokens'
					onChange={() => setHideZeroBalance(!hideZeroBalance)}
					checked={hideZeroBalance}
					size={14}
				/>
				{tokenListForSelect.length > 0 && connected ? (
					tokenListForSelect.map((token: ICardanoAcceptedToken) => {
						const balance = token.cardano?.rawQuantity || 0;

						return (
							<TokenInfo
								key={token.address}
								token={token}
								hideZeroBalance={hideZeroBalance}
								balance={BigInt(balance)}
								onClick={() => {
									setSelectedOneTimeToken(token);
									setShowModal(false);
								}}
							/>
						);
					})
				) : connected ? (
					<WrappedSpinner size={300} />
				) : (
					<div>No token supported on this chain</div>
				)}
			</Wrapper>
		</>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	padding: 12px 24px;
	gap: 12px;
	${mediaQueries.tablet} {
		width: 548px;
		max-height: 600px;
	}
`;

const GIVbackWrapper = styled.div`
	margin-top: 4px;
	padding: 12px 24px;
	background: ${neutralColors.gray[200]};
`;

const InputWrapper = styled.div`
	border-radius: 8px;
	border: 2px solid ${neutralColors.gray[300]};
	position: relative;
`;

const Input = styled.input`
	padding: 8px 16px;
	padding-right: 48px;
	width: 100%;
	border: none;
	outline: none;
	font-size: 16px;
	background: transparent;
	line-height: 24px;
`;

const SearchIconWrapper = styled.div`
	position: absolute;
	top: 8px;
	right: 12px;
	border-left: 1px solid ${neutralColors.gray[300]};
	padding: 2px;
	padding-left: 8px;
`;
