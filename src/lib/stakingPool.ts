import { captureException } from '@sentry/nextjs';
import { signTypedData } from 'wagmi/actions';
import { Abi, erc20Abi, WriteContractReturnType, parseSignature } from 'viem';
import { type Address } from 'viem';
import BigNumber from 'bignumber.js';
import { readContract, readContracts, writeContract } from '@wagmi/core';
import {
	BalancerPoolStakingConfig,
	ICHIPoolStakingConfig,
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
	StakingPlatform,
	StakingType,
} from '@/types/config';
import config from '../configuration';
import { APR } from '@/types/poolInfo';
import { UnipoolHelper } from '@/lib/contractHelper/UnipoolHelper';
import { waitForTransaction } from '@/lib/transaction';

import LM_Json from '../artifacts/UnipoolTokenDistributor.json';
import GP_Json from '../artifacts/GivPower.json';
import UNI_Json from '../artifacts/UNI.json';
import BAL_WEIGHTED_POOL_Json from '../artifacts/BalancerWeightedPool.json';
import BAL_VAULT_Json from '../artifacts/BalancerVault.json';
import TOKEN_MANAGER_Json from '../artifacts/HookedTokenManager.json';
import UnipoolGIVpower from '../artifacts/UnipoolGIVpower.json';
import { ISubgraphState } from '@/features/subgraph/subgraph.types';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { E18, MaxUint256 } from './constants/constants';
import { Zero } from '@/helpers/number';
import { wagmiConfig } from '@/wagmiConfigs';
import { getReadContractResult } from './contracts';

const { abi: LM_ABI } = LM_Json;
const { abi: GP_ABI } = GP_Json;
const { abi: UNI_ABI } = UNI_Json;
const { abi: BAL_WEIGHTED_POOL_ABI } = BAL_WEIGHTED_POOL_Json;
const { abi: BAL_VAULT_ABI } = BAL_VAULT_Json;
const { abi: TOKEN_MANAGER_ABI } = TOKEN_MANAGER_Json;
const { abi: UNIPOOL_GIVPOWER_ABI } = UnipoolGIVpower;

const getUnipoolInfo = async (
	unipoolHelper: UnipoolHelper,
	lmAddress: Address,
	chainId: number,
): Promise<{ totalSupply: bigint; rewardRate: bigint }> => {
	let totalSupply = 0n;
	let rewardRate = 0n;
	// Isn't initialized with default values
	if (unipoolHelper.totalSupply !== 0n) {
		totalSupply = unipoolHelper.totalSupply;
		rewardRate = unipoolHelper.rewardRate;
	} else {
		try {
			const baseProps = {
				address: lmAddress,
				abi: LM_ABI as Abi,
				chainId,
			};
			const results = await readContracts(wagmiConfig, {
				contracts: [
					{
						...baseProps,
						functionName: 'totalSupply',
					},
					{
						...baseProps,
						functionName: 'rewardRate',
					},
				],
			});
			const [_totalSupply, _rewardRate] = results.map(res =>
				getReadContractResult(res),
			);
			totalSupply = _totalSupply as bigint;
			rewardRate = _rewardRate as bigint;
		} catch (error) {
			console.log('Error on fetching totalSupply,rewardRate  :', error);
			captureException(error, {
				tags: {
					section: 'getUnipoolInfo',
				},
			});
		}
	}
	return { totalSupply, rewardRate };
};

export const getGivStakingAPR = async (
	network: number,
	subgraphValue: ISubgraphState,
	chainId: number,
): Promise<APR> => {
	const networkConfig = config.EVM_NETWORKS_CONFIG[network];
	const lmAddress = networkConfig.GIVPOWER?.LM_ADDRESS;
	if (!lmAddress) return { effectiveAPR: Zero };
	const sdh = new SubgraphDataHelper(subgraphValue);
	const unipoolHelper = new UnipoolHelper(sdh.getUnipool(lmAddress));
	const { totalSupply, rewardRate } = await getUnipoolInfo(
		unipoolHelper,
		lmAddress,
		chainId,
	);
	const givStakingAPR =
		totalSupply === 0n
			? Zero
			: new BigNumber(rewardRate.toString())
					.div(totalSupply.toString())
					.multipliedBy(3153600000);

	return { effectiveAPR: givStakingAPR };
};

export const getLPStakingAPR = async (
	poolStakingConfig: SimplePoolStakingConfig,
	subgraphValue: ISubgraphState,
): Promise<APR> => {
	const { network } = poolStakingConfig;
	const sdh = new SubgraphDataHelper(subgraphValue);
	const unipoolHelper = new UnipoolHelper(
		sdh.getUnipool(poolStakingConfig.LM_ADDRESS),
	);
	switch (poolStakingConfig.platform) {
		case StakingPlatform.BALANCER:
			return getBalancerPoolStakingAPR(
				poolStakingConfig as BalancerPoolStakingConfig,
				network,
				unipoolHelper,
			);
		case StakingPlatform.ICHI:
			return getIchiPoolStakingAPR(
				poolStakingConfig as ICHIPoolStakingConfig,
				network,
				unipoolHelper,
			);
		default:
			return getSimplePoolStakingAPR(
				poolStakingConfig,
				network,
				unipoolHelper,
			);
	}
};

const getIchiPoolStakingAPR = async (
	ichiPoolStakingConfig: ICHIPoolStakingConfig,
	chainId: number,
	unipoolHelper: UnipoolHelper,
): Promise<APR> => {
	try {
		const { ichiApi, LM_ADDRESS } = ichiPoolStakingConfig;
		const response = await fetch(ichiApi);
		const apiResult = await response.json();

		const { totalSupply, rewardRate } = await getUnipoolInfo(
			unipoolHelper,
			LM_ADDRESS,
			chainId,
		);

		const {
			lpPrice = '0',
			_vaultIRR = 0,
			tokens = [],
		}: {
			lpPrice: string;
			_vaultIRR: number;
			tokens: { name: string; price: number }[];
		} = apiResult;

		if (!lpPrice || lpPrice === '0') return { effectiveAPR: Zero };

		const givTokenPrice = tokens?.find(t => t.name === 'giv')?.price || 0;
		const vaultIRR = new BigNumber(_vaultIRR);
		const totalAPR = new BigNumber(rewardRate.toString())
			.multipliedBy(givTokenPrice)
			.multipliedBy(3153600000)
			.div(totalSupply.toString())
			.div(lpPrice)
			.plus(vaultIRR);

		return { effectiveAPR: totalAPR, vaultIRR: vaultIRR };
	} catch (e) {
		console.error('Error in fetching ICHI info', e);
	}
	return { effectiveAPR: Zero };
};

const getBalancerPoolStakingAPR = async (
	balancerPoolStakingConfig: BalancerPoolStakingConfig,
	chainId: number,
	unipool: UnipoolHelper,
): Promise<APR> => {
	const { LM_ADDRESS, POOL_ADDRESS, VAULT_ADDRESS, POOL_ID } =
		balancerPoolStakingConfig;
	const tokenAddress = config.EVM_NETWORKS_CONFIG[chainId]?.GIV_TOKEN_ADDRESS;
	if (!tokenAddress) return { effectiveAPR: Zero };
	let farmAPR = null;

	try {
		const weightedPoolContract = {
			address: POOL_ADDRESS,
			abi: BAL_WEIGHTED_POOL_ABI as Abi,
			chainId,
		};

		const vaultContract = {
			address: VAULT_ADDRESS,
			abi: BAL_VAULT_ABI as Abi,
			chainId,
		};
		interface PoolTokens {
			balances: Array<bigint>;
			tokens: Array<string>;
		}
		const results = await readContracts(wagmiConfig, {
			contracts: [
				{
					...vaultContract,
					functionName: 'getPoolTokens',
					args: [POOL_ID],
				},
				{
					...weightedPoolContract,
					functionName: 'totalSupply',
				},
				{
					...weightedPoolContract,
					functionName: 'getNormalizedWeights',
				},
			],
		});
		const [_poolTokens, _poolTotalSupply, _poolNormalizedWeights] =
			results.map(res => getReadContractResult(res)) as [
				PoolTokens,
				bigint,
				Array<bigint>,
			];

		const { totalSupply, rewardRate } = await getUnipoolInfo(
			unipool,
			LM_ADDRESS,
			chainId,
		);

		const weights = _poolNormalizedWeights.map(BigInt);
		const balances = _poolTokens.balances.map(BigInt);

		if (
			_poolTokens.tokens[0].toLowerCase() !== tokenAddress.toLowerCase()
		) {
			balances.reverse();
			weights.reverse();
		}

		const totalWeight = weights.reduce((a, b) => a + b, 0n);

		const lp = _poolTotalSupply / (totalWeight / weights[0]) / balances[0];

		farmAPR =
			totalSupply === 0n
				? null
				: new BigNumber(rewardRate.toString())
						.multipliedBy(3153600000)
						.multipliedBy(lp.toString())
						.div(totalSupply.toString());
	} catch (e) {
		console.error('error on fetching balancer apr:', e);
		captureException(e, {
			tags: {
				section: 'getBalancerPoolStakingAPR',
			},
		});
	}
	return farmAPR ? { effectiveAPR: farmAPR } : null;
};
const getSimplePoolStakingAPR = async (
	poolStakingConfig: SimplePoolStakingConfig | RegenPoolStakingConfig,
	chainId: number,
	unipoolHelper: UnipoolHelper,
): Promise<APR> => {
	const { LM_ADDRESS, POOL_ADDRESS } = poolStakingConfig;
	const networkConfig = config.EVM_NETWORKS_CONFIG[chainId];

	const givTokenAddress = networkConfig?.GIV_TOKEN_ADDRESS;
	if (!givTokenAddress) return { effectiveAPR: Zero };

	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;
	const regenStreams = networkConfig.regenStreams;
	if (!regenStreams) return { effectiveAPR: Zero };
	const streamConfig =
		regenStreamType &&
		regenStreams &&
		regenStreams.find(s => s.type === regenStreamType);
	const tokenAddress = streamConfig
		? streamConfig.rewardTokenAddress
		: givTokenAddress;

	let farmAPR = null;
	try {
		const poolContractInfo = {
			address: POOL_ADDRESS,
			abi: UNI_ABI as Abi,
			chainId,
		};
		const results = await readContracts(wagmiConfig, {
			contracts: [
				{
					...poolContractInfo,
					functionName: 'getReserves',
				},
				{
					...poolContractInfo,
					functionName: 'token0',
				},
				{
					...poolContractInfo,
					functionName: 'totalSupply',
				},
			],
		});
		const [_reserves, _token0, _poolTotalSupply] = results.map(res =>
			getReadContractResult(res),
		) as [[bigint, bigint, number], Address, bigint];

		const { totalSupply, rewardRate } = await getUnipoolInfo(
			unipoolHelper,
			LM_ADDRESS,
			chainId,
		);

		let tokenReseve =
			_token0.toLowerCase() !== tokenAddress.toLowerCase()
				? _reserves[1]
				: _reserves[0];

		const lp = (_poolTotalSupply * E18) / tokenReseve / 2n;

		farmAPR =
			totalSupply === 0n
				? null
				: new BigNumber(rewardRate.toString())
						.multipliedBy(3153600000)
						.multipliedBy(lp.toString())
						.div(totalSupply.toString())
						.div(1e18);
	} catch (e) {
		console.error('error on fetching simple pool apr:', e);
		captureException(e, {
			tags: {
				section: 'getSimplePoolStakingAPR',
			},
		});
	}

	return farmAPR ? { effectiveAPR: farmAPR } : null;
};

export const getUserStakeInfo = (
	currentValues: ISubgraphState,
	poolStakingConfig: SimplePoolStakingConfig,
): {
	stakedAmount: bigint;
	notStakedAmount: bigint;
	earned: bigint;
} => {
	let earned = 0n;
	const sdh = new SubgraphDataHelper(currentValues);
	const unipoolBalance = sdh.getUnipoolBalance(poolStakingConfig.LM_ADDRESS);
	const lpTokenBalance = sdh.getTokenBalance(poolStakingConfig.POOL_ADDRESS);
	const unipoolHelper = new UnipoolHelper(
		sdh.getUnipool(poolStakingConfig.LM_ADDRESS),
	);
	const rewards = BigInt(unipoolBalance.rewards);
	const rewardPerTokenPaid = BigInt(unipoolBalance.rewardPerTokenPaid);
	let stakedAmount: bigint;
	const networkConfig = config.EVM_NETWORKS_CONFIG[poolStakingConfig.network];
	if (poolStakingConfig.type === StakingType.GIV_GARDEN_LM) {
		const gGIVBalance = sdh.getTokenBalance(
			networkConfig.gGIV_TOKEN_ADDRESS,
		);
		stakedAmount = BigInt(gGIVBalance.balance);
	} else if (poolStakingConfig.type === StakingType.GIV_UNIPOOL_LM) {
		const gGIVBalance = sdh.getTokenBalance(
			networkConfig.GIVPOWER?.LM_ADDRESS,
		);
		stakedAmount = BigInt(gGIVBalance.balance);
	} else {
		stakedAmount = BigInt(unipoolBalance.balance);
	}
	const notStakedAmount = BigInt(lpTokenBalance.balance);

	if (unipoolHelper) {
		earned = unipoolHelper.earned(
			rewards,
			rewardPerTokenPaid,
			stakedAmount,
		);
	}

	return {
		stakedAmount,
		notStakedAmount,
		earned,
	};
};

export const permitTokens = async (
	chainId: number,
	walletAddress: Address,
	poolAddress: Address,
	lmAddress: string,
	amount: bigint,
) => {
	const poolContractInfo = {
		address: poolAddress,
		abi: UNI_ABI as Abi,
		chainId,
	};

	const results = await readContracts(wagmiConfig, {
		contracts: [
			{ ...poolContractInfo, functionName: 'name' },
			{
				...poolContractInfo,
				functionName: 'nonces',
				args: [walletAddress],
			},
		],
	});

	const [name, nonce] = results.map(res => getReadContractResult(res));

	const domain = {
		name,
		version: '1',
		chainId: chainId,
		verifyingContract: poolAddress,
	} as const;

	// The named list of all type definitions
	const types = {
		Permit: [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'value', type: 'uint256' },
			{ name: 'nonce', type: 'uint256' },
			{ name: 'deadline', type: 'uint256' },
		],
	};

	// The data to sign
	const message = {
		owner: walletAddress,
		spender: lmAddress,
		value: amount,
		nonce,
		deadline: MaxUint256,
	} as const;

	const hexSignature = await signTypedData(wagmiConfig, {
		domain,
		message,
		primaryType: 'Permit',
		types,
	});
	const signature = parseSignature(hexSignature);
	const tx = await writeContract(wagmiConfig, {
		address: poolAddress,
		abi: UNI_ABI,
		functionName: 'permit',
		args: [
			walletAddress,
			lmAddress,
			amount,
			MaxUint256,
			signature.v,
			signature.r,
			signature.s,
		],
		value: 0n,
	});
	const res = await waitForTransaction(tx);
	return res;
};

export const approveERC20tokenTransfer = async (
	amount: bigint,
	ownerAddress: Address,
	spenderAddress: Address,
	tokenAddress: Address,
	chainId: number,
	isSafeEnv: boolean,
): Promise<boolean> => {
	if (amount === 0n) return false;

	const allowance = await readContract(wagmiConfig, {
		address: tokenAddress,
		abi: erc20Abi,
		functionName: 'allowance',
		args: [ownerAddress, spenderAddress],
	});

	if (amount <= allowance) return true;

	try {
		if (allowance > 0n) {
			const tx = await writeContract(wagmiConfig, {
				address: tokenAddress,
				abi: erc20Abi,
				chainId,
				functionName: 'approve',
				args: [spenderAddress, 0n],
				// @ts-ignore -- needed for safe txs
				value: 0n,
			});
			if (tx) {
				await waitForTransaction(tx, isSafeEnv);
			} else {
				return false;
			}
		}

		const txResponse = await writeContract(wagmiConfig, {
			address: tokenAddress,
			abi: erc20Abi,
			chainId,
			functionName: 'approve',
			args: [spenderAddress, amount],
			// @ts-ignore -- needed for safe txs
			value: 0n,
		});

		if (txResponse) {
			await waitForTransaction(txResponse, isSafeEnv);
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.log('Error on Approve', error);
		return false;
	}
};

export const wrapToken = async (
	amount: bigint,
	gardenAddress: Address,
	chainId: number,
): Promise<WriteContractReturnType | undefined> => {
	if (amount === 0n) return;
	try {
		return await writeContract(wagmiConfig, {
			address: gardenAddress,
			abi: TOKEN_MANAGER_ABI,
			chainId,
			functionName: 'wrap',
			args: [amount],
			value: 0n,
		});
	} catch (error) {
		console.log('Error on wrapping token:', error);
		captureException(error, {
			tags: {
				section: 'wrapToken',
			},
		});
	}
};

export const stakeGIV = async (
	amount: bigint,
	lmAddress: Address,
	chainId: number,
): Promise<WriteContractReturnType | undefined> => {
	if (amount === 0n) return;
	try {
		return await writeContract(wagmiConfig, {
			address: lmAddress,
			abi: UNIPOOL_GIVPOWER_ABI,
			chainId,
			functionName: 'stake',
			args: [amount],
			value: 0n,
		});
	} catch (error) {
		console.log('Error on stake token:', error);
		captureException(error, {
			tags: {
				section: 'stakeToken',
			},
		});
	}
};

export const unwrapToken = async (
	amount: bigint,
	gardenAddress: Address,
	chainId: number,
): Promise<WriteContractReturnType | undefined> => {
	if (amount === 0n) return;
	try {
		return await writeContract(wagmiConfig, {
			address: gardenAddress,
			abi: TOKEN_MANAGER_ABI,
			chainId,
			functionName: 'unwrap',
			args: [amount],
			// @ts-ignore -- needed for safe txs
			value: 0n,
		});
	} catch (error) {
		console.log('Error on unwrapping token:', error);
		captureException(error, {
			tags: {
				section: 'unwrapToken',
			},
		});
	}
};

export const stakeTokens = async (
	amount: bigint,
	lmAddress: Address,
	chainId: number,
): Promise<WriteContractReturnType | undefined> => {
	if (amount === 0n) return;

	try {
		return await writeContract(wagmiConfig, {
			address: lmAddress,
			chainId,
			abi: LM_ABI,
			functionName: 'stake',
			args: [amount],
			value: 0n,
		});
	} catch (e) {
		console.error('Error on staking:', e);
		captureException(e, {
			tags: {
				section: 'stakeTokens',
			},
		});
		return;
	}
};

export const harvestTokens = async (
	lmAddress: Address,
	chainId: number,
): Promise<WriteContractReturnType | undefined> => {
	try {
		return await writeContract(wagmiConfig, {
			address: lmAddress,
			abi: LM_ABI,
			chainId,
			functionName: 'getReward',
			value: 0n,
		});
	} catch (error) {
		console.error('Error on harvesting:', Error);
		captureException(error, {
			tags: {
				section: 'harvestTokens',
			},
		});
	}
};

export const withdrawTokens = async (
	amount: bigint,
	lmAddress: Address,
	chainId: number,
): Promise<WriteContractReturnType | undefined> => {
	if (amount === 0n) return;
	try {
		return await writeContract(wagmiConfig, {
			address: lmAddress,
			abi: LM_ABI,
			chainId,
			functionName: 'withdraw',
			args: [amount],
			value: 0n,
		});
	} catch (e) {
		console.error('Error on withdrawing:', e);
		captureException(e, {
			tags: {
				section: 'withdrawTokens',
			},
		});
	}
};

export const lockToken = async (
	amount: bigint,
	round: number,
	contractAddress: Address,
	chainId: number,
): Promise<WriteContractReturnType | undefined> => {
	if (amount === 0n) return;
	try {
		return await writeContract(wagmiConfig, {
			address: contractAddress,
			abi: GP_ABI,
			chainId,
			functionName: 'lock',
			args: [amount, round],
			value: 0n,
		});
	} catch (error) {
		console.log('Error on locking token:', error);
		captureException(error, {
			tags: {
				section: 'lockToken',
			},
		});
	}
};

export const getGIVpowerOnChain = async (
	account: Address,
	chainId: number,
): Promise<bigint | undefined> => {
	if (!chainId) {
		console.error('chainId is null');
		return;
	}
	try {
		const contractAddress =
			config.EVM_NETWORKS_CONFIG[chainId].GIVPOWER?.LM_ADDRESS;
		if (!contractAddress) {
			console.error('GIVpower contract address is null');
			return;
		}
		return (await readContract(wagmiConfig, {
			address: contractAddress,
			abi: GP_ABI,
			chainId,
			functionName: 'balanceOf',
			args: [account],
		})) as bigint;
	} catch (error) {
		console.log('Error on get total GIVpower:', error);
		captureException(error, {
			tags: {
				section: 'getTotalGIVpower',
			},
		});
	}
};
