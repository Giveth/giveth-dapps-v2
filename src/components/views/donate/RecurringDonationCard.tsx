import {
	B,
	Button,
	Caption,
	GLink,
	H6,
	IconCaretDown16,
	IconHelpFilled16,
	IconRefresh16,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { Framework } from '@superfluid-finance/sdk-core';
import { Flex } from '@/components/styled-components/Flex';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { SelectTokenModal } from './SelectTokenModal/SelectTokenModal';
import { ISuperfluidStream, IToken } from '@/types/superFluid';
import { TokenIcon } from './TokenIcon';
import { gqlRequest } from '@/helpers/requests';
import config from '@/configuration';
import { FETCH_USER_STREAMS } from '@/apollo/gql/gqlUser';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { approveERC20tokenTransfer } from '@/lib/stakingPool';

export interface ISelectTokenWithBalance {
	token: IToken;
	// stream: ISuperfluidStream;
	balance?: bigint;
	// isStream: boolean;
}

export interface ITokenStreams {
	[key: string]: ISuperfluidStream[];
}

export const RecurringDonationCard = () => {
	const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);
	const [tokenStreams, setTokenStreams] = useState<ITokenStreams>({});
	const [selectedToken, setSelectedToken] = useState<
		ISelectTokenWithBalance | undefined
	>();
	const { address } = useAccount();
	const { data: balance, refetch } = useBalance({
		address: address,
		enabled: false,
	});

	useEffect(() => {
		if (!address) return;

		// fetch user's streams
		const fetchData = async () => {
			const { data } = await gqlRequest(
				config.OPTIMISM_CONFIG.superFluidSubgraph,
				undefined,
				FETCH_USER_STREAMS,
				{ address: address.toLowerCase() },
			);
			const streams: ISuperfluidStream[] = data?.streams;
			console.log('streams', streams);

			//categorize streams by token
			const _tokenStreams: ITokenStreams = {};
			streams.forEach(stream => {
				if (!_tokenStreams[stream.token.id]) {
					_tokenStreams[stream.token.id] = [];
				}
				_tokenStreams[stream.token.id].push(stream);
			});
			setTokenStreams(_tokenStreams);
			console.log('tokenStreams', _tokenStreams);
		};
		fetchData();
	}, [address]);

	console.log('selectedToken', selectedToken);

	const onDonateEth = async () => {
		console.log('config.OPTIMISM_CONFIG.id', config.OPTIMISM_CONFIG.id);
		const _provider = getEthersProvider({
			chainId: config.OPTIMISM_CONFIG.id,
		});

		const signer = await getEthersSigner({
			chainId: config.OPTIMISM_CONFIG.id,
		});

		if (!_provider || !signer) return;

		const sf = await Framework.create({
			chainId: config.OPTIMISM_CONFIG.id,
			provider: _provider,
		});
		console.log('sf', sf);

		const ethx = await sf.loadNativeAssetSuperToken(
			'0xe01f8743677da897f4e7de9073b57bf034fc2433',
		);

		const upgradeOperation = await ethx.upgrade({
			amount: '1000000000000',
		});

		await upgradeOperation.exec(signer);
	};

	const onWrap = async () => {
		try {
			console.log('config.OPTIMISM_CONFIG.id', config.OPTIMISM_CONFIG.id);
			const _provider = getEthersProvider({
				chainId: config.OPTIMISM_CONFIG.id,
			});

			const signer = await getEthersSigner({
				chainId: config.OPTIMISM_CONFIG.id,
			});

			if (!_provider || !signer || !address) return;

			const approve = await approveERC20tokenTransfer(
				1000000000000000000n,
				address,
				'0x34cf77c14f39c81adbdad922af538f05633fa07e',
				'0xc916ce4025cb479d9ba9d798a80094a449667f5d',
				config.OPTIMISM_CONFIG.id,
			);

			console.log('approve', approve);
			if (!approve) return;

			const sf = await Framework.create({
				chainId: config.OPTIMISM_CONFIG.id,
				provider: _provider,
			});
			console.log('sf', sf);

			const givx = await sf.loadWrapperSuperToken(
				'0x34cf77c14f39c81adbdad922af538f05633fa07e',
			);

			// const approve = await givx.approve({
			// 	amount: '1000000000000000000',
			// 	receiver: '0x34cf77c14f39c81adbdad922af538f05633fa07e',
			// });

			// await approve.exec(signer);

			const upgradeOperation = await givx.upgrade({
				amount: '1000000000000000000',
			});

			// const res = await upgradeOperation.exec(signer);
			// console.log('res', res);

			let createFlowOp = givx.createFlow({
				sender: address, // Alice's address
				receiver: '0x871Cd6353B803CECeB090Bb827Ecb2F361Db81AB',
				flowRate: '380517503',
			});

			// await createFlowOp.exec(signer);
			const sfSigner = sf.createSigner({
				signer: signer,
			});
			const batchOp = sf.batchCall([upgradeOperation, createFlowOp]);
			const res = await batchOp.exec(signer);
			console.log('res', res);
		} catch (error) {
			console.log('error', error);
		}
	};

	return (
		<>
			<Title weight={700}>
				Make a recurring donation with{' '}
				<a href='https://www.superfluid.finance/' target='_blank'>
					SuperFluid
				</a>
			</Title>
			<Desc>
				Provide continuous funding by streaming your donations over
				time.
			</Desc>
			<RecurringSection>
				<RecurringSectionTitle>
					Creating a Monthly recurring donation
				</RecurringSectionTitle>
				<Flex flexDirection='column' gap='8px'>
					<Flex gap='8px' alignItems='center'>
						<Caption>Stream Balance</Caption>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction='right'
							align='bottom'
						>
							<FlowRateTooltip>
								The rate at which you receive liquid GIV from
								your GIVstream.here!
							</FlowRateTooltip>
						</IconWithTooltip>
					</Flex>
					<InputWrapper>
						<SelectTokenWrapper
							alignItems='center'
							justifyContent='space-between'
							onClick={() => setShowSelectTokenModal(true)}
						>
							{selectedToken ? (
								<Flex gap='8px' alignItems='center'>
									<TokenIcon
										symbol={selectedToken.token.symbol}
										size={24}
										isSuperToken={
											selectedToken.token.isSuperToken
										}
									/>
									<B>{selectedToken.token.symbol}</B>
								</Flex>
							) : (
								<B>Select Token</B>
							)}
							<IconCaretDown16 />
						</SelectTokenWrapper>
						<Input type='text' />
					</InputWrapper>
					{selectedToken !== undefined &&
						selectedToken.balance !== undefined && (
							<Flex gap='4px'>
								<GLink>
									Available:{' '}
									{balance?.formatted ||
										formatUnits(
											selectedToken?.balance,
											selectedToken?.token.decimals,
										)}
								</GLink>
								<IconWrapper onClick={() => refetch()}>
									<IconRefresh16 />
								</IconWrapper>
							</Flex>
						)}
				</Flex>
				<Button label='Donate' onClick={onWrap} />
			</RecurringSection>
			{showSelectTokenModal && (
				<SelectTokenModal
					tokenStreams={tokenStreams}
					setShowModal={setShowSelectTokenModal}
					setSelectedToken={setSelectedToken}
				/>
			)}
		</>
	);
};

const Title = styled(H6)`
	& > a {
		color: ${brandColors.pinky[500]};
	}
`;

const Desc = styled(Caption)`
	background-color: ${neutralColors.gray[200]};
	padding: 8px;
	width: 100%;
	text-align: left;
`;

const RecurringSection = styled(Flex)`
	flex-direction: column;
	gap: 24px;
	padding: 16px;
	border-radius: 12px;
	border: 1px solid ${neutralColors.gray[300]};
	width: 100%;
`;

const RecurringSectionTitle = styled(B)`
	width: 100%;
	padding-bottom: 8px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	text-align: left;
`;

const SelectTokenWrapper = styled(Flex)`
	cursor: pointer;
`;

const InputWrapper = styled(Flex)`
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	overflow: hidden;
	& > * {
		padding: 13px 16px;
	}
	align-items: center;
`;

const Input = styled.input`
	border: none;
	flex: 1;
	border-left: 2px solid ${neutralColors.gray[300]};
	font-family: Red Hat Text;
	font-size: 16px;
	font-style: normal;
	font-weight: 500;
	line-height: 150%; /* 24px */
`;

const IconWrapper = styled.div`
	cursor: pointer;
`;
