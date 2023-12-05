import {
	B,
	Button,
	Caption,
	GLink,
	H6,
	IconCaretDown16,
	IconHelpFilled16,
	IconRefresh16,
	P,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { Framework } from '@superfluid-finance/sdk-core';
import Slider from 'rc-slider';
import Image from 'next/image';
import { Flex } from '@/components/styled-components/Flex';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { SelectTokenModal } from './SelectTokenModal/SelectTokenModal';
import { ISuperfluidStream } from '@/types/superFluid';
import { TokenIcon } from './TokenIcon/TokenIcon';
import { gqlRequest } from '@/helpers/requests';
import config from '@/configuration';
import { FETCH_USER_STREAMS } from '@/apollo/gql/gqlUser';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { approveERC20tokenTransfer } from '@/lib/stakingPool';
import { useDonateData } from '@/context/donate.context';
import { RecurringDonationModal } from './RecurringDonationModal/RecurringDonationModal';
import { AmountInput } from '@/components/AmountInput/AmountInput';
import 'rc-slider/assets/index.css';
import DonateToGiveth from './DonateToGiveth';
import { Spinner } from '@/components/Spinner';

export interface ITokenStreams {
	[key: string]: ISuperfluidStream[];
}

export const RecurringDonationCard = () => {
	const [amount, setAmount] = useState(0n);
	const [percentage, setPercentage] = useState(0);
	const [donationToGiveth, setDonationToGiveth] = useState(5);
	const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);
	const [showRecurringDonationModal, setShowRecurringDonationModal] =
		useState(false);
	const [tokenStreams, setTokenStreams] = useState<ITokenStreams>({});

	const { address } = useAccount();
	const { project, selectedToken } = useDonateData();
	const {
		data: balance,
		refetch,
		isRefetching,
	} = useBalance({
		token: selectedToken?.token.id,
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

	const underlyingToken = selectedToken?.token.underlyingToken;

	console.log('balance', balance);

	const totalPerMonth = ((amount || 0n) * BigInt(percentage)) / 100n;
	const projectPerMonth =
		(totalPerMonth * BigInt(100 - donationToGiveth)) / 100n;
	const givethPerMonth = totalPerMonth - projectPerMonth;
	const tokenBalance = balance?.value || selectedToken?.balance;

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
						<Caption medium>Stream Balance</Caption>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction='right'
							align='bottom'
						>
							<FlowRateTooltip>PlaceHolder</FlowRateTooltip>
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
										symbol={
											underlyingToken
												? underlyingToken.symbol
												: selectedToken.token.symbol
										}
										size={24}
									/>
									<B>{selectedToken.token.symbol}</B>
								</Flex>
							) : (
								<SelectTokenPlaceHolder>
									Select Token
								</SelectTokenPlaceHolder>
							)}
							<IconCaretDown16 />
						</SelectTokenWrapper>
						<Input
							setAmount={setAmount}
							disabled={selectedToken === undefined}
							decimals={selectedToken?.token.decimals}
						/>
					</InputWrapper>
					{selectedToken !== undefined &&
						selectedToken.balance !== undefined && (
							<Flex gap='4px'>
								<GLink size='Small'>
									Available:{' '}
									{balance?.formatted ||
										formatUnits(
											selectedToken?.balance,
											selectedToken?.token.underlyingToken
												?.decimals || 18,
										)}
								</GLink>
								<IconWrapper
									onClick={() => !isRefetching && refetch()}
								>
									{isRefetching ? (
										<Spinner size={16} />
									) : (
										<IconRefresh16 />
									)}
								</IconWrapper>
							</Flex>
						)}
				</Flex>
				<Flex flexDirection='column' gap='8px' alignItems='stretch'>
					<Caption>Amount to donate Monthly</Caption>
					<SliderWrapper>
						<StyledSlider
							min={0}
							max={100}
							step={1}
							railStyle={{
								backgroundColor: brandColors.giv[200],
							}}
							trackStyle={{
								backgroundColor: brandColors.giv[500],
							}}
							handleStyle={{
								backgroundColor: brandColors.giv[500],
								border: `3px solid ${brandColors.giv[200]}`,
								opacity: 1,
							}}
							onChange={(value: any) => {
								const _value = Array.isArray(value)
									? value[0]
									: value;
								setPercentage(_value);
							}}
							value={percentage}
							disabled={amount === 0n}
						/>
					</SliderWrapper>
					<Flex justifyContent='space-between'>
						<Caption>Donate to this project</Caption>
						<Flex gap='4px'>
							<B>
								{amount !== 0n && percentage !== 0
									? formatUnits(
											totalPerMonth,
											selectedToken?.token.decimals || 18,
									  )
									: 0}
							</B>
							<B>{selectedToken?.token.symbol}</B>
							<P>per Month</P>
						</Flex>
					</Flex>
					<Flex justifyContent='space-between'>
						<Caption>Stream balance runs out in</Caption>
						<Flex gap='4px'>
							<B>
								{percentage !== 0
									? Math.floor(100 / percentage)
									: 0}
							</B>
							<B>Months</B>
						</Flex>
					</Flex>
				</Flex>
			</RecurringSection>
			<GivethSection
				flexDirection='column'
				gap='8px'
				alignItems='stretch'
			>
				<DonateToGiveth
					setDonationToGiveth={e => {
						setDonationToGiveth(e);
					}}
					donationToGiveth={donationToGiveth}
					title='Add a recurring donation to Giveth'
				/>
			</GivethSection>
			<DonatesInfoSection>
				<Flex flexDirection='column' gap='8px'>
					<Flex justifyContent='space-between'>
						<Caption>
							Donating to <b>{project.title}</b>
						</Caption>
						<Flex gap='4px'>
							<Caption>
								{amount !== 0n && percentage !== 0
									? formatUnits(
											projectPerMonth,
											selectedToken?.token.decimals || 18,
									  )
									: 0}
							</Caption>
							<Caption>{selectedToken?.token.symbol}</Caption>
							<Caption>monthly</Caption>
						</Flex>
					</Flex>
					<Flex justifyContent='space-between'>
						<Caption>
							Donating <b>{donationToGiveth}%</b> to <b>Giveth</b>
						</Caption>
						<Flex gap='4px'>
							<Caption>
								{amount !== 0n && percentage !== 0
									? formatUnits(
											givethPerMonth,
											selectedToken?.token.decimals || 18,
									  )
									: 0}
							</Caption>
							<Caption>{selectedToken?.token.symbol}</Caption>
							<Caption>monthly</Caption>
						</Flex>
					</Flex>
					<Flex justifyContent='space-between'>
						<Caption medium>Your total donation</Caption>
						<Flex gap='4px'>
							<Caption medium>
								{amount !== 0n && percentage !== 0
									? formatUnits(
											totalPerMonth,
											selectedToken?.token.decimals || 18,
									  )
									: 0}
							</Caption>
							<Caption medium>
								{selectedToken?.token.symbol}
							</Caption>
							<Caption medium>monthly</Caption>
						</Flex>
					</Flex>
				</Flex>
			</DonatesInfoSection>
			<DonateButton
				label='Donate'
				onClick={() => setShowRecurringDonationModal(true)}
				disabled={
					selectedToken === undefined ||
					tokenBalance === undefined ||
					amount === 0n ||
					percentage === 0 ||
					amount > tokenBalance
				}
			/>
			<Flex gap='16px'>
				<P>Streams powered by</P>
				<Image
					src='/images/logo/superfluid-logo.svg'
					width={120}
					height={30}
					alt='Superfluid logo'
				/>
			</Flex>
			{showSelectTokenModal && (
				<SelectTokenModal
					tokenStreams={tokenStreams}
					setShowModal={setShowSelectTokenModal}
				/>
			)}
			{showRecurringDonationModal && (
				<RecurringDonationModal
					setShowModal={setShowRecurringDonationModal}
					tokenStreams={tokenStreams}
					donationToGiveth={donationToGiveth}
					amount={amount}
					percentage={percentage}
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
	align-items: stretch;
	gap: 24px;
	padding: 16px;
	border-radius: 12px;
	border: 1px solid ${neutralColors.gray[300]};
	width: 100%;
	text-align: left;
`;

const RecurringSectionTitle = styled(B)`
	width: 100%;
	padding-bottom: 8px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	text-align: left;
`;

const SelectTokenWrapper = styled(Flex)`
	cursor: pointer;
	gap: 16px;
`;

const SelectTokenPlaceHolder = styled(B)`
	white-space: nowrap;
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

const Input = styled(AmountInput)`
	width: 100%;
	border-left: 2px solid ${neutralColors.gray[300]};
	#amount-input {
		border: none;
		flex: 1;
		font-family: Red Hat Text;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: 150%; /* 24px */
		width: 100%;
	}
`;

const IconWrapper = styled.div`
	cursor: pointer;
	color: ${brandColors.giv[500]};
`;

const SliderWrapper = styled.div`
	width: 100%;
	position: relative;
`;

const StyledSlider = styled(Slider)``;

const GivethSection = styled(Flex)`
	flex-direction: column;
	gap: 24px;
	width: 100%;
	text-align: left;
`;

const DonatesInfoSection = styled(Flex)`
	flex-direction: column;
	gap: 24px;
	width: 100%;
	text-align: left;
`;

const DonateButton = styled(Button)`
	width: 100%;
`;
