import { Contract, ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import {
	JsonRpcProvider,
	TransactionResponse,
	Web3Provider,
} from '@ethersproject/providers';
import { captureException } from '@sentry/nextjs';
import {
	BalancerPoolStakingConfig,
	ICHIPoolStakingConfig,
	RegenPoolStakingConfig,
	SimpleNetworkConfig,
	SimplePoolStakingConfig,
	StakingPlatform,
	StakingType,
} from '@/types/config';
import config from '../configuration';
import { APR } from '@/types/poolInfo';
import { UnipoolHelper } from '@/lib/contractHelper/UnipoolHelper';
import { BN, Zero } from '@/helpers/number';
import { getGasPreference } from '@/lib/helpers';

import LM_Json from '../artifacts/UnipoolTokenDistributor.json';
import GP_Json from '../artifacts/GivPower.json';
import UNI_Json from '../artifacts/UNI.json';
import BAL_WEIGHTED_POOL_Json from '../artifacts/BalancerWeightedPool.json';
import BAL_VAULT_Json from '../artifacts/BalancerVault.json';
import TOKEN_MANAGER_Json from '../artifacts/HookedTokenManager.json';
import ERC20_Json from '../artifacts/ERC20.json';
import {
	ERC20,
	IUniswapV2Pair,
	IVault,
	UnipoolTokenDistributor,
	WeightedPool,
} from '@/types/contracts';
import { ISubgraphState } from '@/features/subgraph/subgraph.types';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

const { abi: LM_ABI } = LM_Json;
const { abi: GP_ABI } = GP_Json;
const { abi: UNI_ABI } = UNI_Json;
const { abi: BAL_WEIGHTED_POOL_ABI } = BAL_WEIGHTED_POOL_Json;
const { abi: BAL_VAULT_ABI } = BAL_VAULT_Json;
const { abi: TOKEN_MANAGER_ABI } = TOKEN_MANAGER_Json;
const { abi: ERC20_ABI } = ERC20_Json;

const toBigNumberJs = (eb: ethers.BigNumber | string | number): BigNumber =>
	new BigNumber(eb.toString());

const getUnipoolInfo = async (
	unipoolHelper: UnipoolHelper,
	lmAddress: string,
	provider: JsonRpcProvider,
): Promise<{ totalSupply: BigNumber; rewardRate: BigNumber }> => {
	let totalSupply: BigNumber;
	let rewardRate: BigNumber;
	// Isn't initialized with default values
	if (!unipoolHelper.totalSupply.isZero()) {
		totalSupply = unipoolHelper.totalSupply;
		rewardRate = unipoolHelper.rewardRate;
	} else {
		const lmContract = new Contract(
			lmAddress,
			LM_ABI,
			provider,
		) as UnipoolTokenDistributor;
		[totalSupply, rewardRate] = await Promise.all([
			lmContract.totalSupply(),
			lmContract.rewardRate(),
		]).then(([_totalSupply, _rewardRate]) => [
			toBigNumberJs(_totalSupply as ethers.BigNumber),
			toBigNumberJs(_rewardRate as ethers.BigNumber),
		]);
	}
	return { totalSupply, rewardRate };
};

export const getGivStakingAPR = async (
	network: number,
	subgraphValue: ISubgraphState,
	provider: JsonRpcProvider | null,
): Promise<APR> => {
	const lmAddress = (config.NETWORKS_CONFIG[network] as SimpleNetworkConfig)
		.GIV.LM_ADDRESS;
	const sdh = new SubgraphDataHelper(subgraphValue);
	const unipoolHelper = new UnipoolHelper(sdh.getUnipool(lmAddress));
	let givStakingAPR: BigNumber = Zero;
	const _provider =
		provider && provider._network.chainId === network
			? provider
			: new JsonRpcProvider(config.NETWORKS_CONFIG[network].nodeUrl);

	const { totalSupply, rewardRate } = await getUnipoolInfo(
		unipoolHelper,
		lmAddress,
		_provider,
	);
	givStakingAPR = totalSupply.isZero()
		? Zero
		: rewardRate.div(totalSupply).times('31536000').times('100');

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
				_provider,
				unipoolHelper,
			);
		case StakingPlatform.ICHI:
			return getIchiPoolStakingAPR(
				poolStakingConfig as ICHIPoolStakingConfig,
				network,
				_provider,
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
	network: number,
	provider: JsonRpcProvider,
	unipoolHelper: UnipoolHelper,
): Promise<APR> => {
	try {
		const { ichiApi, LM_ADDRESS } = ichiPoolStakingConfig;
		const response = await fetch(ichiApi);
		const apiResult = await response.json();

		const { totalSupply, rewardRate } = await getUnipoolInfo(
			unipoolHelper,
			LM_ADDRESS,
			provider,
		);

		const {
			lpPrice = '0',
			vaultIRR = 0,
			tokens = [],
		}: {
			lpPrice: string;
			vaultIRR: number;
			tokens: { name: string; price: number }[];
		} = apiResult;

		if (!lpPrice || lpPrice === '0') return { effectiveAPR: Zero };

		const givTokenPrice = tokens?.find(t => t.name === 'giv')?.price || 0;
		const totalAPR = rewardRate
			.div(totalSupply)
			.times(givTokenPrice)
			.div(lpPrice)
			.times('31536000')
			.times('100')
			.plus(vaultIRR);

		return { effectiveAPR: totalAPR, vaultIRR: toBigNumberJs(vaultIRR) };
	} catch (e) {
		console.error('Error in fetching ICHI info', e);
	}
	return { effectiveAPR: Zero };
};

const getBalancerPoolStakingAPR = async (
	balancerPoolStakingConfig: BalancerPoolStakingConfig,
	network: number,
	provider: JsonRpcProvider,
	unipool: UnipoolHelper,
): Promise<APR> => {
	const { LM_ADDRESS, POOL_ADDRESS, VAULT_ADDRESS, POOL_ID } =
		balancerPoolStakingConfig;
	const tokenAddress = (
		config.NETWORKS_CONFIG[network] as SimpleNetworkConfig
	).TOKEN_ADDRESS;

	const weightedPoolContract = new Contract(
		POOL_ADDRESS,
		BAL_WEIGHTED_POOL_ABI,
		provider,
	) as WeightedPool;
	const vaultContract = new Contract(
		VAULT_ADDRESS,
		BAL_VAULT_ABI,
		provider,
	) as IVault;

	interface PoolTokens {
		balances: Array<ethers.BigNumber>;
		tokens: Array<string>;
	}
	let farmAPR = null;

	try {
		const [_poolTokens, _poolTotalSupply, _poolNormalizedWeights]: [
			PoolTokens,
			ethers.BigNumber,
			Array<ethers.BigNumber>,
		] = await Promise.all([
			vaultContract.getPoolTokens(POOL_ID),
			weightedPoolContract.totalSupply(),
			weightedPoolContract.getNormalizedWeights(),
		]);

		const { totalSupply, rewardRate } = await getUnipoolInfo(
			unipool,
			LM_ADDRESS,
			provider,
		);

		const weights = _poolNormalizedWeights.map(toBigNumberJs);
		const balances = _poolTokens.balances.map(toBigNumberJs);

		if (
			_poolTokens.tokens[0].toLowerCase() !== tokenAddress.toLowerCase()
		) {
			balances.reverse();
			weights.reverse();
		}

		const lp = toBigNumberJs(_poolTotalSupply)
			.div(BigNumber.sum(...weights).div(weights[0]))
			.div(balances[0]);

		farmAPR = totalSupply.isZero()
			? null
			: rewardRate
					.div(totalSupply)
					.times('31536000')
					.times('100')
					.times(lp);
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
		config.NETWORKS_CONFIG[network] as SimpleNetworkConfig
	).TOKEN_ADDRESS;
	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;
	const streamConfig =
		regenStreamType &&
		(
			config.NETWORKS_CONFIG[network] as SimpleNetworkConfig
		).regenStreams.find(s => s.type === regenStreamType);
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
	stakedAmount: ethers.BigNumber;
	notStakedAmount: ethers.BigNumber;
	earned: ethers.BigNumber;
} => {
	let earned = ethers.constants.Zero;
	const sdh = new SubgraphDataHelper(currentValues);
	const unipoolBalance = sdh.getUnipoolBalance(poolStakingConfig.LM_ADDRESS);
	const lpTokenBalance = sdh.getTokenBalance(poolStakingConfig.POOL_ADDRESS);
	const unipoolHelper = new UnipoolHelper(
		sdh.getUnipool(poolStakingConfig.LM_ADDRESS),
	);
	const rewards = BN(unipoolBalance.rewards);
	const rewardPerTokenPaid = BN(unipoolBalance.rewardPerTokenPaid);
	let stakedAmount = BN(unipoolBalance.balance);
	if (
		config.XDAI_CONFIG.gGIV_ADDRESS &&
		currentValues.networkNumber === config.XDAI_NETWORK_NUMBER &&
		poolStakingConfig.type === StakingType.GIV_LM
	) {
		const gGIVBalance = sdh.getTokenBalance(
			config.XDAI_CONFIG.gGIV_ADDRESS,
		);
		stakedAmount = BN(gGIVBalance.balance);
	} else {
		stakedAmount = BN(unipoolBalance.balance);
	}
	const notStakedAmount = BN(lpTokenBalance.balance);

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
	amount: string,
	ownerAddress: string,
	spenderAddress: string,
	poolAddress: string,
	provider: Web3Provider | null,
): Promise<boolean> => {
	if (amount === '0') return false;
	if (!provider) {
		console.error('Provider is null');
		return false;
	}

	const signer = provider.getSigner();
	const tokenContract = new Contract(poolAddress, ERC20_ABI, signer) as ERC20;
	const allowance: ethers.BigNumber = await tokenContract.allowance(
		ownerAddress,
		spenderAddress,
	);

	const amountNumber = ethers.BigNumber.from(amount);

	if (amountNumber.lte(allowance)) return true;

	const gasPreference = {
		...getGasPreference(config.NETWORKS_CONFIG[provider.network.chainId]),
		gasLimit: 70000,
	};

	if (!allowance.isZero()) {
		try {
			const approveZero: TransactionResponse = await tokenContract
				.connect(signer.connectUnchecked())
				.approve(spenderAddress, ethers.constants.Zero, gasPreference);

			const { status } = await approveZero.wait();
			if (!status) return false;
		} catch (error) {
			console.log('Error on Zero Approve', error);
			captureException(error, {
				tags: {
					section: 'approveERC20tokenTransfer',
				},
			});
			return false;
		}
	}

	try {
		const approve = await tokenContract
			.connect(signer.connectUnchecked())
			.approve(spenderAddress, amountNumber, gasPreference);

		const { status } = await approve.wait();
		if (!status) return false;
	} catch (error) {
		console.log('Error on Amount Approve:', error);
		captureException(error, {
			tags: {
				section: 'approveERC20tokenTransfer',
			},
		});
		return false;
	}
	return true;
};

export const wrapToken = async (
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
			.wrap(
				amount,
				getGasPreference(
					config.NETWORKS_CONFIG[provider.network.chainId],
				),
			);
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
	amount: string,
	round: number,
	contractAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (amount === '0') return;
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();

	const givpowerContract = new Contract(contractAddress, GP_ABI, signer);
	try {
		return await givpowerContract
			.connect(signer.connectUnchecked())
			.lock(
				amount,
				round,
				getGasPreference(
					config.NETWORKS_CONFIG[provider.network.chainId],
				),
			);
	} catch (error) {
		console.log('Error on locking token:', error);
		captureException(error, {
			tags: {
				section: 'lockToken',
			},
		});
	}
};

export const getTotalGIVpower = async (
	account: string,
	contractAddress: string,
	provider: Web3Provider | null,
): Promise<BigNumber | undefined> => {
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();

	const givpowerContract = new Contract(contractAddress, GP_ABI, signer);
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
