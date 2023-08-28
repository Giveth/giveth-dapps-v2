import { Contract, ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import {
	JsonRpcProvider,
	TransactionResponse,
	Web3Provider,
} from '@ethersproject/providers';
import { captureException } from '@sentry/nextjs';
import { getContract, getWalletClient } from 'wagmi/actions';
import { erc20ABI } from 'wagmi';
import { WriteContractReturnType } from 'viem';
import {
	Address,
	BalancerPoolStakingConfig,
	GIVTokenConfig,
	GIVpowerConfig,
	ICHIPoolStakingConfig,
	MainnetNetworkConfig,
	RegenFarmConfig,
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
	StakingPlatform,
	StakingType,
} from '@/types/config';
import config from '../configuration';
import { APR } from '@/types/poolInfo';
import { UnipoolHelper } from '@/lib/contractHelper/UnipoolHelper';
import { getGasPreference } from '@/lib/helpers';

import LM_Json from '../artifacts/UnipoolTokenDistributor.json';
import GP_Json from '../artifacts/GivPower.json';
import UNI_Json from '../artifacts/UNI.json';
import BAL_WEIGHTED_POOL_Json from '../artifacts/BalancerWeightedPool.json';
import BAL_VAULT_Json from '../artifacts/BalancerVault.json';
import TOKEN_MANAGER_Json from '../artifacts/HookedTokenManager.json';
import UnipoolGIVpower from '../artifacts/UnipoolGIVpower.json';
import { IUniswapV2Pair, UnipoolTokenDistributor } from '@/types/contracts';
import { ISubgraphState } from '@/features/subgraph/subgraph.types';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { GIVpowerUniPoolConfig } from '@/types/config';

const { abi: LM_ABI } = LM_Json;
const { abi: GP_ABI } = GP_Json;
const { abi: UNI_ABI } = UNI_Json;
const { abi: BAL_WEIGHTED_POOL_ABI } = BAL_WEIGHTED_POOL_Json;
const { abi: BAL_VAULT_ABI } = BAL_VAULT_Json;
const { abi: TOKEN_MANAGER_ABI } = TOKEN_MANAGER_Json;
const { abi: UNIPOOL_GIVPOWER_ABI } = UnipoolGIVpower;

const toBigNumberJs = (eb: ethers.BigNumber | string | number): BigNumber =>
	new BigNumber(eb.toString());

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
			const lmContract = getContract({
				address: lmAddress,
				abi: LM_ABI,
				chainId,
			});
			const [_totalSupply, _rewardRate] = await Promise.all([
				lmContract.read.totalSupply(),
				lmContract.read.rewardRate(),
			]);
			totalSupply = _totalSupply as bigint;
			rewardRate = _rewardRate as bigint;
		} catch (error) {
			console.log('Error on wrapping token:', error);
			captureException(error, {
				tags: {
					section: 'wrapToken',
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
	const lmAddress = (config.NETWORKS_CONFIG[network] as GIVpowerConfig)
		.GIVPOWER.LM_ADDRESS;
	const sdh = new SubgraphDataHelper(subgraphValue);
	const unipoolHelper = new UnipoolHelper(sdh.getUnipool(lmAddress));
	let givStakingAPR = 0n;

	const { totalSupply, rewardRate } = await getUnipoolInfo(
		unipoolHelper,
		lmAddress,
		chainId,
	);
	givStakingAPR =
		totalSupply === 0n ? 0n : (rewardRate / totalSupply) * 3153600000n;

	return { effectiveAPR: givStakingAPR };
};

export const getLPStakingAPR = async (
	poolStakingConfig: SimplePoolStakingConfig,
	provider: JsonRpcProvider | null,
	subgraphValue: ISubgraphState,
): Promise<APR> => {
	const { network } = poolStakingConfig;
	const _provider = provider
		? provider
		: new JsonRpcProvider(config.NETWORKS_CONFIG[network].nodeUrl);
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
				_provider,
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

		if (!lpPrice || lpPrice === '0') return { effectiveAPR: 0n };

		const givTokenPrice = tokens?.find(t => t.name === 'giv')?.price || 0;
		const vaultIRR = BigInt(_vaultIRR);
		const totalAPR =
			(rewardRate * BigInt(givTokenPrice) * 3153600000n) /
				(totalSupply * BigInt(lpPrice)) +
			vaultIRR;

		return { effectiveAPR: totalAPR, vaultIRR: vaultIRR };
	} catch (e) {
		console.error('Error in fetching ICHI info', e);
	}
	return { effectiveAPR: 0n };
};

const getBalancerPoolStakingAPR = async (
	balancerPoolStakingConfig: BalancerPoolStakingConfig,
	chainId: number,
	unipool: UnipoolHelper,
): Promise<APR> => {
	const { LM_ADDRESS, POOL_ADDRESS, VAULT_ADDRESS, POOL_ID } =
		balancerPoolStakingConfig;
	const tokenAddress = (config.NETWORKS_CONFIG[chainId] as GIVTokenConfig)
		.GIV_TOKEN_ADDRESS;

	const weightedPoolContract = getContract({
		address: POOL_ADDRESS,
		abi: BAL_WEIGHTED_POOL_ABI,
		chainId,
	});

	const vaultContract = getContract({
		address: VAULT_ADDRESS,
		abi: BAL_VAULT_ABI,
		chainId,
	});

	interface PoolTokens {
		balances: Array<bigint>;
		tokens: Array<string>;
	}
	let farmAPR = null;

	try {
		const [_poolTokens, _poolTotalSupply, _poolNormalizedWeights] =
			(await Promise.all([
				vaultContract.read.getPoolTokens([POOL_ID]),
				weightedPoolContract.read.totalSupply(),
				weightedPoolContract.read.getNormalizedWeights(),
			])) as [PoolTokens, bigint, Array<bigint>];

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
				: (rewardRate * 3153600000n * lp) / totalSupply;
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
	network: number,
	provider: JsonRpcProvider,
	unipoolHelper: UnipoolHelper,
): Promise<APR> => {
	const { LM_ADDRESS, POOL_ADDRESS } = poolStakingConfig;
	const givTokenAddress = (
		config.NETWORKS_CONFIG[network] as MainnetNetworkConfig
	).GIV_TOKEN_ADDRESS;
	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;
	const streamConfig =
		regenStreamType &&
		(config.NETWORKS_CONFIG[network] as RegenFarmConfig).regenStreams.find(
			s => s.type === regenStreamType,
		);
	const tokenAddress = streamConfig
		? streamConfig.rewardTokenAddress
		: givTokenAddress;

	const poolContract = new Contract(
		POOL_ADDRESS,
		UNI_ABI,
		provider,
	) as IUniswapV2Pair;
	let farmAPR = null;
	try {
		const [_reserves, _token0, _poolTotalSupply]: [
			[ethers.BigNumber, ethers.BigNumber, number],
			string,
			ethers.BigNumber,
		] = await Promise.all([
			poolContract.getReserves(),
			poolContract.token0(),
			poolContract.totalSupply(),
		]);

		const { totalSupply, rewardRate } = await getUnipoolInfo(
			unipoolHelper,
			LM_ADDRESS,
			provider,
		);

		let tokenReseve = toBigNumberJs(
			_token0.toLowerCase() !== tokenAddress.toLowerCase()
				? _reserves[1]
				: _reserves[0],
		);

		const lp = toBigNumberJs(_poolTotalSupply)
			.times(10 ** 18)
			.div(2)
			.div(tokenReseve);
		farmAPR = totalSupply.isZero()
			? null
			: rewardRate
					.div(totalSupply)
					.times('31536000')
					.times('100')
					.times(lp)
					.div(10 ** 18);
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
	let stakedAmount = BigInt(unipoolBalance.balance);
	if (poolStakingConfig.type === StakingType.GIV_GARDEN_LM) {
		const gGIVBalance = sdh.getTokenBalance(
			config.GNOSIS_CONFIG.gGIV_TOKEN_ADDRESS,
		);
		stakedAmount = BigInt(gGIVBalance.balance);
	} else if (poolStakingConfig.type === StakingType.GIV_UNIPOOL_LM) {
		const gGIVBalance = sdh.getTokenBalance(
			(
				config.NETWORKS_CONFIG[
					poolStakingConfig.network
				] as GIVpowerUniPoolConfig
			).GIVPOWER.LM_ADDRESS,
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

const permitTokens = async (
	provider: Web3Provider,
	poolAddress: string,
	lmAddress: string,
	amount: string,
) => {
	const signer = provider.getSigner();
	const signerAddress = await signer.getAddress();

	const poolContract = new Contract(
		poolAddress,
		UNI_ABI,
		signer,
	) as IUniswapV2Pair;

	const domain = {
		name: await poolContract.name(),
		version: '1',
		chainId: provider.network.chainId,
		verifyingContract: poolAddress,
	};

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
	const value = {
		owner: signerAddress,
		spender: lmAddress,
		value: amount,
		nonce: await poolContract.nonces(signerAddress),
		deadline: ethers.constants.MaxUint256,
	};

	// eslint-disable-next-line no-underscore-dangle
	const rawSignature = await signer._signTypedData(domain, types, value);
	const signature = ethers.utils.splitSignature(rawSignature);

	return await poolContract.populateTransaction.permit(
		signerAddress,
		lmAddress,
		amount,
		ethers.constants.MaxUint256,
		signature.v,
		signature.r,
		signature.s,
	);
};

export const approveERC20tokenTransfer = async (
	amount: bigint,
	ownerAddress: Address,
	spenderAddress: Address,
	tokenAddress: Address,
	chainId: number,
): Promise<boolean> => {
	if (amount === 0n) return false;

	const tokenContract = getContract({
		address: tokenAddress,
		abi: erc20ABI,
	});

	const allowance = await tokenContract.read.allowance([
		ownerAddress,
		spenderAddress,
	]);

	if (amount <= allowance) return true;

	try {
		const walletClient = await getWalletClient({ chainId });

		if (allowance > 0n) {
			await walletClient?.writeContract({
				address: tokenAddress,
				abi: erc20ABI,
				functionName: 'approve',
				args: [spenderAddress, 0n],
			});
		}

		await walletClient?.writeContract({
			address: tokenAddress,
			abi: erc20ABI,
			functionName: 'approve',
			args: [spenderAddress, amount],
		});

		return true;
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
	const walletClient = await getWalletClient({ chainId });
	if (!walletClient) {
		console.error('Wallet client is null');
		return;
	}

	try {
		return await walletClient?.writeContract({
			address: gardenAddress,
			abi: TOKEN_MANAGER_ABI,
			functionName: 'wrap',
			args: [amount],
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
	const walletClient = await getWalletClient({ chainId });
	if (!walletClient) {
		console.error('Wallet client is null');
		return;
	}

	try {
		return await walletClient?.writeContract({
			address: lmAddress,
			abi: UNIPOOL_GIVPOWER_ABI,
			functionName: 'stake',
			args: [amount],
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

export const unwrapToken = async (
	amount: string,
	gardenAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (amount === '0') return;
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();

	const gardenContract = new Contract(
		gardenAddress,
		TOKEN_MANAGER_ABI,
		signer,
	);
	try {
		return await gardenContract
			.connect(signer.connectUnchecked())
			.unwrap(
				amount,
				getGasPreference(
					config.NETWORKS_CONFIG[provider.network.chainId],
				),
			);
	} catch (error) {
		console.log('Error on unwrapping token:', error);
		captureException(error, {
			tags: {
				section: 'unwrapToken',
			},
		});
		return;
	}
};

export const stakeTokens = async (
	amount: string,
	poolAddress: string,
	lmAddress: string,
	provider: Web3Provider | null,
	permit: boolean,
): Promise<TransactionResponse | undefined> => {
	if (amount === '0') return;
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();

	const lmContract = new Contract(
		lmAddress,
		LM_ABI,
		signer,
	) as UnipoolTokenDistributor;

	try {
		const gasPreference = getGasPreference(
			config.NETWORKS_CONFIG[provider.network.chainId],
		);

		if (permit) {
			const rawPermitCall = await permitTokens(
				provider,
				poolAddress,
				lmAddress,
				amount,
			);
			return await lmContract
				.connect(signer.connectUnchecked())
				.stakeWithPermit(
					ethers.BigNumber.from(amount),
					rawPermitCall.data as string,
					{
						gasLimit: 300_000,
						...gasPreference,
					},
				);
		} else {
			return await lmContract
				.connect(signer.connectUnchecked())
				.stake(ethers.BigNumber.from(amount), {
					gasLimit: 300_000,
					...gasPreference,
				});
		}
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
	lmAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();
	const lmContract = new Contract(
		lmAddress,
		LM_ABI,
		signer.connectUnchecked(),
	);

	try {
		return await lmContract.getReward(
			getGasPreference(config.NETWORKS_CONFIG[provider.network.chainId]),
		);
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
	amount: string,
	lmAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();

	const lmContract = new Contract(
		lmAddress,
		LM_ABI,
		signer.connectUnchecked(),
	);

	try {
		return await lmContract.withdraw(
			ethers.BigNumber.from(amount),
			getGasPreference(config.NETWORKS_CONFIG[provider.network.chainId]),
		);
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
	const walletClient = await getWalletClient({ chainId });
	if (!walletClient) {
		console.error('Wallet client is null');
		return;
	}
	try {
		return await walletClient?.writeContract({
			address: contractAddress,
			abi: GP_ABI,
			functionName: 'lock',
			args: [amount, round],
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
	account: string,
	chainId: number,
	provider: Web3Provider | null,
): Promise<ethers.BigNumber | undefined> => {
	if (!provider) {
		console.error('Provider is null');
		return;
	}
	if (!chainId) {
		console.error('chainId is null');
		return;
	}
	const contractAddress = (config.NETWORKS_CONFIG[chainId] as GIVpowerConfig)
		.GIVPOWER.LM_ADDRESS;
	const givpowerContract = new Contract(contractAddress, GP_ABI, provider);
	try {
		return await givpowerContract.balanceOf(account);
	} catch (error) {
		console.log('Error on get total GIVpower:', error);
		captureException(error, {
			tags: {
				section: 'getTotalGIVpower',
			},
		});
	}
};
