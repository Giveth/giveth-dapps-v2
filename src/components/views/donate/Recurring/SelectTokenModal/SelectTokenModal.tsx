import styled from 'styled-components';
import {
	Caption,
	SublineBold,
	brandColors,
	mediaQueries,
	neutralColors,
	Flex,
	P,
	IconGIVBack24,
} from '@giveth/ui-design-system';
import { useState, type FC, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useIntl } from 'react-intl';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';
import { TokenInfo } from './TokenInfo';
import { fetchEVMTokenBalances } from '@/services/token';
import { ISuperToken, IToken } from '@/types/superFluid';
import { StreamInfo } from './StreamInfo';
import { useDonateData } from '@/context/donate.context';

export interface ISelectTokenModalProps extends IModal {}

export const SelectTokenModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Select a Token'
			headerTitlePosition='left'
		>
			<SelectTokenInnerModal setShowModal={setShowModal} />
		</Modal>
	);
};

export interface IBalances {
	[key: string]: bigint;
}

const superTokens = config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS;

const SelectTokenInnerModal: FC<ISelectTokenModalProps> = ({
	setShowModal,
}) => {
	const [tokens, setTokens] = useState<ISuperToken[]>([]);
	const [balances, setBalances] = useState<IBalances>({});

	const { formatMessage } = useIntl();
	const { address } = useAccount();
	const { tokenStreams, setSelectedRecurringToken, project } =
		useDonateData();

	useEffect(() => {
		// Ensure we have an address before proceeding
		if (!address) {
			console.log('No address found.');
			return;
		}

		// Initiate all balance fetches concurrently
		const fetchAllBalances = async () => {
			const _allTokens = superTokens.reduce((acc, token) => {
				acc.push(token);
				acc.push(token.underlyingToken);
				return acc;
			}, [] as IToken[]);

			// Wait for all promises to settle
			const results = await fetchEVMTokenBalances(_allTokens, address);

			// Process results into a new balances object
			const newBalances = results.reduce((acc, { token, balance }) => {
				if (balance !== undefined) {
					acc[token.symbol] = balance;
				}
				return acc;
			}, {} as IBalances);

			const filteredTokens = superTokens.filter(
				token => !(newBalances[token.symbol] > 0n),
			);

			setTokens(filteredTokens);

			// Update the state with the new balances
			setBalances(newBalances);
		};

		// Call the function to fetch all balances
		fetchAllBalances();
	}, [address, project.addresses, tokenStreams]); // Dependency array includes address to refetch if it changes

	const isAllSuperTokenBalancesAreZero = superTokens.every(({ symbol }) => {
		return balances[symbol] === 0n;
	});

	const isAllSuperTokenBalancesAreZeroAndNoTokenStreams =
		isAllSuperTokenBalancesAreZero &&
		Object.keys(tokenStreams).length === 0;

	const isUserHasBalanceForAllSuperTokens = superTokens.every(
		({ symbol }) => {
			return balances[symbol] !== undefined && balances[symbol] > 0n;
		},
	);

	return (
		<>
			<Wrapper>
				{!isAllSuperTokenBalancesAreZeroAndNoTokenStreams && (
					<>
						<Title $medium>
							{formatMessage({ id: 'label.stream_balances' })}
						</Title>
						<TitleSubheader>
							{formatMessage({
								id: 'label.stream_balances_description',
							})}
						</TitleSubheader>
						{Object.keys(tokenStreams).map(tokenId => {
							const token = superTokens.find(
								token => token.id === tokenId,
							) as IToken;
							return (
								<StreamInfo
									key={tokenId}
									stream={tokenStreams[tokenId]}
									balance={balances[token.symbol]}
									disable={
										!balances[token.symbol] ||
										balances[token.symbol] === 0n
									}
									onClick={() => {
										setSelectedRecurringToken({
											token,
											balance: balances[token.symbol],
										});
										setShowModal(false);
									}}
									isSuperToken={!!token.isSuperToken}
								/>
							);
						})}
						{superTokens.map(token =>
							tokenStreams[token.id] ||
							balances[token.symbol] === 0n ? null : (
								<TokenInfo
									key={token.symbol}
									token={token}
									balance={balances[token.symbol]}
									disable={
										!balances[token.symbol] ||
										balances[token.symbol] === 0n
									}
									onClick={() => {
										setSelectedRecurringToken({
											token,
											balance: balances[token.symbol],
										});
										setShowModal(false);
									}}
								/>
							),
						)}
					</>
				)}

				{!isUserHasBalanceForAllSuperTokens && (
					<>
						<Title $medium>
							{formatMessage({
								id: 'label.superfluid_eligible_tokens',
							})}
						</Title>
						<TitleSubheader>
							{formatMessage({
								id: 'label.superfluid_eligible_tokens_description',
							})}
						</TitleSubheader>
						{tokens.length > 0 ? (
							tokens.map(token => (
								<TokenInfo
									key={token.underlyingToken.symbol}
									token={token.underlyingToken}
									balance={
										balances[token.underlyingToken.symbol]
									}
									disable={
										balances[
											token.underlyingToken.symbol
										] === undefined ||
										balances[
											token.underlyingToken.symbol
										] === 0n
									}
									onClick={() => {
										setSelectedRecurringToken({
											token: token.underlyingToken,
											balance:
												balances[
													token.underlyingToken.symbol
												],
										});
										setShowModal(false);
									}}
								/>
							))
						) : (
							<Caption>
								{formatMessage({
									id: 'label.you_have_super_token_for_all_tokens',
								})}
							</Caption>
						)}
					</>
				)}
			</Wrapper>
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
		</>
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

const Title = styled(Caption)`
	text-align: left;
	padding-bottom: 1px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	color: ${neutralColors.gray[700]};
`;

const TitleSubheader = styled(P)`
	text-align: left;
	font-size: 0.75rem;
	font-style: italic;
	color: ${neutralColors.gray[800]};
`;

const GIVbackWrapper = styled.div`
	padding: 12px 24px;
	background: ${neutralColors.gray[200]};
`;
