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
	PoolStakingConfig,
	RegenFarmType,
	RegenPoolStakingConfig,
	SimplePoolStakingConfig,
	StakingType,
} from '@/types/config';
import config from '../configuration';
import { APR } from '@/types/poolInfo';
import { UnipoolHelper } from '@/lib/contractHelper/UnipoolHelper';
import { BN, Zero } from '@/helpers/number';
import { IBalances } from '@/types/subgraph';
import { getGasPreference } from '@/lib/helpers';

import LM_Json from '../artifacts/UnipoolTokenDistributor.json';
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

const { abi: LM_ABI } = LM_Json;
const { abi: UNI_ABI } = UNI_Json;
const { abi: BAL_WEIGHTED_POOL_ABI } = BAL_WEIGHTED_POOL_Json;
const { abi: BAL_VAULT_ABI } = BAL_VAULT_Json;
const { abi: TOKEN_MANAGER_ABI } = TOKEN_MANAGER_Json;
const { abi: ERC20_ABI } = ERC20_Json;

const toBigNumber = (eb: ethers.BigNumber): BigNumber =>
	new BigNumber(eb.toString());

export const getGivStakingAPR = async (
	lmAddress: string,
	network: number,
	unipool: UnipoolHelper | undefined,
): Promise<APR> => {
	let apr: BigNumber = Zero;

	if (unipool) {
		const totalSupply = unipool.totalSupply;
		const rewardRate = unipool.rewardRate;

		apr = totalSupply.isZero()
			? Zero
			: rewardRate.div(totalSupply).times('31536000').times('100');
	}

	return apr;
};

export const getLPStakingAPR = async (
	poolStakingConfig: PoolStakingConfig,
	network: number,
	provider: JsonRpcProvider | null,
	unipoolHelper: UnipoolHelper | undefined,
): Promise<APR> => {
	if (!provider) {
		return Zero;
	}
	if (poolStakingConfig.type === StakingType.BALANCER_ETH_GIV) {
		return getBalancerPoolStakingAPR(
			poolStakingConfig as BalancerPoolStakingConfig,
			network,
			provider,
			unipoolHelper,
		);
	} else {
		return getSimplePoolStakingAPR(
			poolStakingConfig,
			network,
			provider,
			unipoolHelper,
		);
	}
};

const getBalancerPoolStakingAPR = async (
	balancerPoolStakingConfig: BalancerPoolStakingConfig,
	network: number,
	provider: JsonRpcProvider,
	unipool: UnipoolHelper | undefined,
): Promise<APR> => {
	const { LM_ADDRESS, POOL_ADDRESS, VAULT_ADDRESS, POOL_ID } =
		balancerPoolStakingConfig;
	const tokenAddress = config.NETWORKS_CONFIG[network].TOKEN_ADDRESS;

	const lmContract = new Contract(
		LM_ADDRESS,
		LM_ABI,
		provider,
	) as UnipoolTokenDistributor;
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
	let apr = null;

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

		let totalSupply: BigNumber;
		let rewardRate: BigNumber;

		if (unipool) {
			totalSupply = unipool.totalSupply;
			rewardRate = unipool.rewardRate;
		} else {
			[totalSupply, rewardRate] = await Promise.all([
				lmContract.totalSupply(),
				lmContract.rewardRate(),
			]).then(([_totalSupply, _rewardRate]) => [
				toBigNumber(_totalSupply as ethers.BigNumber),
				toBigNumber(_rewardRate as ethers.BigNumber),
			]);
		}

		const weights = _poolNormalizedWeights.map(toBigNumber);
		const balances = _poolTokens.balances.map(toBigNumber);

		if (
			_poolTokens.tokens[0].toLowerCase() !== tokenAddress.toLowerCase()
		) {
			balances.reverse();
			weights.reverse();
		}

		const lp = toBigNumber(_poolTotalSupply)
			.div(BigNumber.sum(...weights).div(weights[0]))
			.div(balances[0]);

		apr = totalSupply.isZero()
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
	return apr;
};
const getSimplePoolStakingAPR = async (
	poolStakingConfig: SimplePoolStakingConfig | RegenPoolStakingConfig,
	network: number,
	provider: JsonRpcProvider,
	unipoolHelper: UnipoolHelper | undefined,
): Promise<APR> => {
	const { LM_ADDRESS, POOL_ADDRESS } = poolStakingConfig;
	const givTokenAddress = config.NETWORKS_CONFIG[network].TOKEN_ADDRESS;
	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;
	const streamConfig =
		regenStreamType &&
		config.NETWORKS_CONFIG[network].regenStreams.find(
			s => s.type === regenStreamType,
		);
	const tokenAddress = streamConfig
		? streamConfig.rewardTokenAddress
		: givTokenAddress;
	const lmContract = new Contract(
		LM_ADDRESS,
		LM_ABI,
		provider,
	) as UnipoolTokenDistributor;

	let totalSupply: BigNumber;
	let rewardRate: BigNumber;
	const poolContract = new Contract(
		POOL_ADDRESS,
		UNI_ABI,
		provider,
	) as IUniswapV2Pair;
	let apr = null;
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
		if (unipoolHelper) {
			totalSupply = unipoolHelper.totalSupply;
			rewardRate = unipoolHelper.rewardRate;
		} else {
			[totalSupply, rewardRate] = await Promise.all([
				lmContract.totalSupply(),
				lmContract.rewardRate(),
			]).then(([_totalSupply, _rewardRate]) => [
				toBigNumber(_totalSupply as ethers.BigNumber),
				toBigNumber(_rewardRate as ethers.BigNumber),
			]);
		}
		let tokenReseve = toBigNumber(
			_token0.toLowerCase() !== tokenAddress.toLowerCase()
				? _reserves[1]
				: _reserves[0],
		);

		const lp = toBigNumber(_poolTotalSupply)
			.times(10 ** 18)
			.div(2)
			.div(tokenReseve);
		apr = totalSupply.isZero()
			? null
			: rewardRate
					.div(totalSupply)
					.times('31536000')
					.times('100')
					.times(lp)
					.div(10 ** 18);
	} catch (e) {
		console.error('error on fetching apr:', e);
		captureException(e, {
			tags: {
				section: 'getSimplePoolStakingAPR',
			},
		});
	}

	return apr;
};

export const getUserStakeInfo = (
	type: StakingType,
	regenFarmType: RegenFarmType | undefined,
	balance: IBalances,
	unipoolHelper: UnipoolHelper | undefined,
): {
	stakedAmount: ethers.BigNumber;
	notStakedAmount: ethers.BigNumber;
	earned: ethers.BigNumber;
} => {
	let rewards = ethers.constants.Zero;
	let rewardPerTokenPaid = ethers.constants.Zero;
	let stakedAmount = ethers.constants.Zero;
	let notStakedAmount = ethers.constants.Zero;
	let earned = ethers.constants.Zero;
	if (regenFarmType) {
		switch (regenFarmType) {
			case RegenFarmType.FOX_HNY:
				rewards = BN(balance.rewardsFoxHnyLm);
				rewardPerTokenPaid = BN(balance.rewardPerTokenPaidFoxHnyLm);
				stakedAmount = BN(balance.foxHnyLpStaked);
				notStakedAmount = BN(balance.foxHnyLp);
				break;
			case RegenFarmType.CULT_ETH:
				rewards = BN(balance.rewardsCultEthLm);
				rewardPerTokenPaid = BN(balance.rewardPerTokenPaidCultEthLm);
				stakedAmount = BN(balance.cultEthLpStaked);
				notStakedAmount = BN(balance.cultEthLp);
				break;
			default:
		}
	} else {
		switch (type) {
			case StakingType.SUSHISWAP_ETH_GIV:
				rewards = BN(balance.rewardsSushiSwap);
				rewardPerTokenPaid = BN(balance.rewardPerTokenPaidSushiSwap);
				stakedAmount = BN(balance.sushiSwapLpStaked);
				notStakedAmount = BN(balance.sushiswapLp);
				break;
			case StakingType.HONEYSWAP_GIV_HNY:
				rewards = BN(balance.rewardsHoneyswap);
				rewardPerTokenPaid = BN(balance.rewardPerTokenPaidHoneyswap);
				stakedAmount = BN(balance.honeyswapLpStaked);
				notStakedAmount = BN(balance.honeyswapLp);
				break;
			case StakingType.HONEYSWAP_GIV_DAI:
				rewards = BN(balance.rewardsHoneyswapGivDai);
				rewardPerTokenPaid = BN(
					balance.rewardPerTokenPaidHoneyswapGivDai,
				);
				stakedAmount = BN(balance.honeyswapGivDaiLpStaked);
				notStakedAmount = BN(balance.honeyswapGivDaiLp);
				break;
			case StakingType.BALANCER_ETH_GIV:
				rewards = BN(balance.rewardsBalancer);
				rewardPerTokenPaid = BN(balance.rewardPerTokenPaidBalancer);
				stakedAmount = BN(balance.balancerLpStaked);
				notStakedAmount = BN(balance.balancerLp);
				break;
			case StakingType.UNISWAPV2_GIV_DAI:
				rewards = BN(balance.rewardsUniswapV2GivDai);
				rewardPerTokenPaid = BN(
					balance.rewardPerTokenPaidUniswapV2GivDai,
				);
				stakedAmount = BN(balance.uniswapV2GivDaiLpStaked);
				notStakedAmount = BN(balance.uniswapV2GivDaiLp);
				break;
			case StakingType.GIV_LM:
				rewards = BN(balance.rewardsGivLm);
				rewardPerTokenPaid = BN(balance.rewardPerTokenPaidGivLm);
				stakedAmount = BN(balance.givStaked);
				notStakedAmount = BN(balance.balance);
				break;
			default:
		}
	}

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

	const gasPreference = getGasPreference(
		config.NETWORKS_CONFIG[provider.network.chainId],
	);

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

	const givpowerContract = new Contract(contractAddress, LM_ABI, signer);
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

	const givpowerContract = new Contract(contractAddress, LM_ABI, signer);
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
