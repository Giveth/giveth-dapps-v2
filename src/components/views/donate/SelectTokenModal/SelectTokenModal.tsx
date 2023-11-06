import styled from 'styled-components';
import { mediaQueries } from '@giveth/ui-design-system';
import {
	useState,
	type Dispatch,
	type FC,
	type SetStateAction,
	useEffect,
} from 'react';
import { useAccount } from 'wagmi';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Flex } from '@/components/styled-components/Flex';
import config from '@/configuration';
import { TokenInfo } from './TokenInfo';
import { fetchBalance } from '@/services/token';
import { IToken } from '@/types/config';
import type { ISelectTokenWithBalance } from '../RecurringDonationCard';

export interface ISelectTokenModalProps extends IModal {
	setSelectedToken: Dispatch<
		SetStateAction<ISelectTokenWithBalance | undefined>
	>;
}

export const SelectTokenModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
	setSelectedToken,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Select a Token'
			headerTitlePosition='left'
		>
			<SelectTokenInnerModal
				setShowModal={setShowModal}
				setSelectedToken={setSelectedToken}
			/>
		</Modal>
	);
};

export interface IBalances {
	[key: string]: bigint;
}

const allTokens = config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS;

const SelectTokenInnerModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
	setSelectedToken,
}) => {
	const [balances, setBalances] = useState<IBalances>({});
	const { address } = useAccount();

	useEffect(() => {
		// Ensure we have an address before proceeding
		if (!address) {
			console.log('No address found.');
			return;
		}

		// A helper function to fetch balance for a single token
		const fetchTokenBalance = async (token: IToken) => {
			try {
				const balance = await fetchBalance(token.address, address);
				return { symbol: token.symbol, balance };
			} catch (error) {
				console.error(
					`Error fetching balance for ${token.symbol}:`,
					error,
				);
				return { symbol: token.symbol, balance: undefined };
			}
		};

		// Initiate all balance fetches concurrently
		const fetchAllBalances = async () => {
			const _allTokens = allTokens.reduce((acc, token) => {
				acc.push(token);
				acc.push(token.underlyingToken);
				return acc;
			}, [] as IToken[]);

			// Create an array of promises for each token balance fetch
			const balancePromises = _allTokens.map(token =>
				fetchTokenBalance(token),
			);

			// Wait for all promises to settle
			const results = await Promise.all(balancePromises);

			// Process results into a new balances object
			const newBalances = results.reduce((acc, { symbol, balance }) => {
				if (balance !== undefined) {
					acc[symbol] = balance;
				}
				return acc;
			}, {} as IBalances);

			// Update the state with the new balances
			setBalances(newBalances);
		};

		// Call the function to fetch all balances
		fetchAllBalances();
	}, [address]); // Dependency array includes address to refetch if it changes

	return (
		<Wrapper>
			{allTokens.map(token => (
				<TokenInfo
					key={token.symbol}
					token={token}
					balance={balances[token.symbol]}
					disable={balances[token.symbol] === 0n}
					isSuperToken={true}
					onClick={() => {
						setSelectedToken({
							token,
							balance: balances[token.symbol],
						});
						setShowModal(false);
					}}
				/>
			))}
			{allTokens.map(token => (
				<TokenInfo
					key={token.underlyingToken.symbol}
					token={token.underlyingToken}
					balance={balances[token.underlyingToken.symbol]}
					disable={balances[token.symbol] === 0n}
					onClick={() => {
						setSelectedToken({
							token: token.underlyingToken,
							balance: balances[token.symbol],
						});
						setShowModal(false);
					}}
				/>
			))}
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	padding: 12px 24px;
	gap: 12px;
	${mediaQueries.tablet} {
		width: 548px;
	}
`;
