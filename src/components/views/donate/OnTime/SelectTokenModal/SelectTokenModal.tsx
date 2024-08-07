import styled from 'styled-components';
import {
	SublineBold,
	brandColors,
	mediaQueries,
	neutralColors,
	Flex,
	IconGIVBack24,
	IconSearch16,
} from '@giveth/ui-design-system';
import { useState, type FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { erc20Abi, isAddress } from 'viem'; // Assuming `isAddress` is a function from the `viem` library to validate Ethereum addresses
import { useAccount } from 'wagmi';
import { readContracts } from 'wagmi/actions';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { TokenInfo } from './TokenInfo';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import CheckBox from '@/components/Checkbox';
import { useDonateData } from '@/context/donate.context';
import { shortenAddress, showToastError } from '@/lib/helpers';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { wagmiConfig } from '@/wagmiConfigs';
import { ChainType } from '@/types/config';
import useFetchBalance from './useFetchBalanceHook';

export interface ISelectTokenModalProps extends IModal {
	tokens?: IProjectAcceptedToken[];
	acceptCustomToken?: boolean;
}

export const SelectTokenModal: FC<ISelectTokenModalProps> = props => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	const { formatMessage } = useIntl();
	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Select a Token'
			headerTitlePosition='left'
			footer={
				<GIVbackWrapper>
					<Flex gap='8px' $alignItems='center'>
						<IconGIVBack24 color={brandColors.giv[500]} />
						<SublineBold>
							{formatMessage({
								id: 'label.givbacks_eligible_tokens',
							})}
						</SublineBold>
					</Flex>
				</GIVbackWrapper>
			}
		>
			<SelectTokenInnerModal {...props} />
		</Modal>
	);
};

const SelectTokenInnerModal: FC<ISelectTokenModalProps> = ({
	tokens,
	acceptCustomToken,
	setShowModal,
}) => {
	const [hideZeroBalance, setHideZeroBalance] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredTokens, setFilteredTokens] = useState(tokens || []);
	const [customToken, setCustomToken] = useState<
		IProjectAcceptedToken | undefined
	>();
	const { setSelectedOneTimeToken } = useDonateData();
	const { isOnEVM } = useGeneralWallet();
	const { chain: evmChain } = useAccount();

	useEffect(() => {
		if (tokens) {
			if (isAddress(searchQuery)) {
				const existingToken = tokens.find(
					token =>
						token.address.toLowerCase() ===
						searchQuery.toLowerCase(),
				);
				if (existingToken) {
					setCustomToken(undefined);
					setFilteredTokens([existingToken]);
				} else if (isOnEVM && acceptCustomToken) {
					const initialToken = {
						address: searchQuery,
						decimals: 18,
						name: shortenAddress(searchQuery),
						symbol: shortenAddress(searchQuery),
						networkId: evmChain?.id || 1,
						chainType: ChainType.EVM,
						isGivbackEligible: false,
						order: 1,
					};
					setCustomToken(initialToken);

					// Fetch token data
					readContracts(wagmiConfig, {
						allowFailure: false,
						contracts: [
							{
								address: searchQuery,
								abi: erc20Abi,
								functionName: 'decimals',
							},
							{
								address: searchQuery,
								abi: erc20Abi,
								functionName: 'name',
							},
							{
								address: searchQuery,
								abi: erc20Abi,
								functionName: 'symbol',
							},
						],
					})
						.then(results => {
							console.log('results', results);
							const _customTokenData = {
								...initialToken,
								address: searchQuery,
								decimals: results[0],
								name: results[1],
								symbol: results[2],
							};
							setCustomToken(_customTokenData);
						})
						.catch(() => {
							showToastError('Failed to fetch token data');
						});
				}
			} else {
				setCustomToken(undefined);
				const filtered = tokens.filter(
					token =>
						token.symbol
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						token.name
							.toLowerCase()
							.includes(searchQuery.toLowerCase()),
				);
				setFilteredTokens(filtered);
			}
		}
	}, [searchQuery, tokens]);

	// Fetch balances for filtered tokens
	const fetchBalance = useFetchBalance;

	const tokenBalances = filteredTokens.map(token => ({
		token,
		balance: fetchBalance(token),
	}));

	const customTokenBalance = fetchBalance(customToken);

	// Sort tokens by balance
	const sortedTokens = tokenBalances.sort((a, b) => {
		if (a.balance === undefined) return 1;
		if (b.balance === undefined) return -1;
		return Number(b.balance) - Number(a.balance);
	});

	return (
		<>
			<Wrapper>
				<InputWrapper>
					<Input
						placeholder='Search name or paste an address'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
					<SearchIconWrapper>
						<IconSearch16 color={neutralColors.gray[400]} />
					</SearchIconWrapper>
				</InputWrapper>
				<CheckBox
					label='Hide 0 balance tokens'
					onChange={() => setHideZeroBalance(!hideZeroBalance)}
					checked={hideZeroBalance}
					size={14}
				/>
				{customToken ? (
					<TokenInfo
						token={customToken}
						hideZeroBalance={hideZeroBalance}
						balance={customTokenBalance}
						onClick={() => {
							setSelectedOneTimeToken(customToken);
							setShowModal(false);
						}}
					/>
				) : sortedTokens.length > 0 ? (
					sortedTokens.map(({ token, balance }) => (
						<TokenInfo
							key={token.symbol}
							token={token}
							hideZeroBalance={hideZeroBalance}
							balance={balance}
							onClick={() => {
								setSelectedOneTimeToken(token);
								setShowModal(false);
							}}
						/>
					))
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
