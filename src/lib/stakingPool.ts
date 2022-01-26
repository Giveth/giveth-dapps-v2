import { Contract, ethers } from 'ethers';

import { abi as LM_ABI } from '../artifacts/UnipoolTokenDistributor.json';
import { abi as UNI_ABI } from '../artifacts/UNI.json';
import { abi as BAL_WEIGHTED_POOL_ABI } from '../artifacts/BalancerWeightedPool.json';
import { abi as BAL_VAULT_ABI } from '../artifacts/BalancerVault.json';
import { abi as TOKEN_MANAGER_ABI } from '../artifacts/HookedTokenManager.json';
import { abi as ERC20_ABI } from '../artifacts/ERC20.json';

import { APR } from '@/types/poolInfo';
import BigNumber from 'bignumber.js';
import config from '../configuration';
import {
	BalancerPoolStakingConfig,
	PoolStakingConfig,
	SimplePoolStakingConfig,
	StakingType,
} from '@/types/config';

import {
	JsonRpcProvider,
	TransactionResponse,
	Web3Provider,
} from '@ethersproject/providers';
import { UnipoolHelper } from '@/lib/contractHelper/UnipoolHelper';
import { Zero } from '@/helpers/number';
import { IBalances, IUnipool } from '@/types/subgraph';
import { getGasPreference } from '@/lib/helpers';

const toBigNumber = (eb: ethers.BigNumber): BigNumber =>
	new BigNumber(eb.toString());

export const getGivStakingAPR = async (
	lmAddress: string,
	network: number,
	unipool: IUnipool | undefined,
): Promise<APR> => {
	let apr: BigNumber = Zero;

	if (unipool) {
		const totalSupply = unipool.totalSupply;
		const rewardRate = unipool.rewardRate;

		apr = totalSupply.isZero()
			? Zero
			: toBigNumber(rewardRate)
					.div(totalSupply.toString())
					.times('31536000')
					.times('100');
	}

	return apr;
};

export const getLPStakingAPR = async (
	poolStakingConfig: PoolStakingConfig,
	network: number,
	provider: JsonRpcProvider | null,
	unipool: IUnipool | undefined,
): Promise<APR> => {
	if (!provider) {
		return Zero;
	}
	if (poolStakingConfig.type === StakingType.BALANCER) {
		return getBalancerPoolStakingAPR(
			poolStakingConfig as BalancerPoolStakingConfig,
			network,
			provider,
			unipool,
		);
	} else {
		return getSimplePoolStakingAPR(
			poolStakingConfig,
			network,
			provider,
			unipool,
		);
	}
};

const getBalancerPoolStakingAPR = async (
	balancerPoolStakingConfig: BalancerPoolStakingConfig,
	network: number,
	provider: JsonRpcProvider,
	unipool: IUnipool | undefined,
): Promise<APR> => {
	const { LM_ADDRESS, POOL_ADDRESS, VAULT_ADDRESS, POOL_ID } =
		balancerPoolStakingConfig;
	const tokenAddress = config.NETWORKS_CONFIG[network].TOKEN_ADDRESS;

	const lmContract = new Contract(LM_ADDRESS, LM_ABI, provider);
	const poolContract = new Contract(
		POOL_ADDRESS,
		BAL_WEIGHTED_POOL_ABI,
		provider,
	);
	const vaultContract = new Contract(VAULT_ADDRESS, BAL_VAULT_ABI, provider);

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
			poolContract.totalSupply(),
			poolContract.getNormalizedWeights(),
		]);

		let totalSupply: ethers.BigNumber;
		let rewardRate: ethers.BigNumber;

		if (unipool) {
			totalSupply = unipool.totalSupply;
			rewardRate = unipool.rewardRate;
		} else {
			[totalSupply, rewardRate] = await Promise.all([
				lmContract.totalSupply(),
				lmContract.rewardRate(),
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
			: toBigNumber(rewardRate)
					.div(totalSupply.toString())
					.times('31536000')
					.times('100')
					.times(lp);
	} catch (e) {
		console.error('error on fetching balancer apr:', e);
	}
	return apr;
};
const getSimplePoolStakingAPR = async (
	simplePoolStakingConfig: SimplePoolStakingConfig,
	network: number,
	provider: JsonRpcProvider,
	unipool: IUnipool | undefined,
): Promise<APR> => {
	const { LM_ADDRESS, POOL_ADDRESS } = simplePoolStakingConfig;
	const tokenAddress = config.NETWORKS_CONFIG[network].TOKEN_ADDRESS;
	const lmContract = new Contract(LM_ADDRESS, LM_ABI, provider);

	let reserves;
	let totalSupply: ethers.BigNumber;
	let rewardRate: ethers.BigNumber;

	const poolContract = new Contract(POOL_ADDRESS, UNI_ABI, provider);
	let apr = null;
	try {
		const [_reserves, _token0, _poolTotalSupply]: [
			Array<ethers.BigNumber>,
			string,
			ethers.BigNumber,
		] = await Promise.all([
			poolContract.getReserves(),
			poolContract.token0(),
			poolContract.totalSupply(),
		]);
		if (unipool) {
			totalSupply = unipool.totalSupply;
			rewardRate = unipool.rewardRate;
		} else {
			[totalSupply, rewardRate] = await Promise.all([
				lmContract.totalSupply(),
				lmContract.rewardRate(),
			]);
		}
		reserves = _reserves.map(toBigNumber);
		if (_token0.toLowerCase() !== tokenAddress.toLowerCase())
			reserves.reverse();
		const lp = toBigNumber(_poolTotalSupply)
			.times(10 ** 18)
			.div(2)
			.div(reserves[0]);
		apr = totalSupply.isZero()
			? null
			: toBigNumber(rewardRate)
					.div(totalSupply.toString())
					.times('31536000')
					.times('100')
					.times(lp)
					.div(10 ** 18);
	} catch (e) {
		console.error('error on fetching apr:', e);
	}

	return apr;
};

export const getUserStakeInfo = (
	type: StakingType,
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

	switch (type) {
		case StakingType.SUSHISWAP:
			rewards = balance.rewardsSushiSwap;
			rewardPerTokenPaid = balance.rewardPerTokenPaidSushiSwap;
			stakedAmount = balance.sushiSwapLpStaked;
			notStakedAmount = balance.sushiswapLp;
			break;
		case StakingType.HONEYSWAP:
			rewards = balance.rewardsHoneyswap;
			rewardPerTokenPaid = balance.rewardPerTokenPaidHoneyswap;
			stakedAmount = balance.honeyswapLpStaked;
			notStakedAmount = balance.honeyswapLp;
			break;
		case StakingType.BALANCER:
			rewards = balance.rewardsBalancer;
			rewardPerTokenPaid = balance.rewardPerTokenPaidBalancer;
			stakedAmount = balance.balancerLpStaked;
			notStakedAmount = balance.balancerLp;
			break;
		case StakingType.GIV_LM:
			rewards = balance.rewardsGivLm;
			rewardPerTokenPaid = balance.rewardPerTokenPaidGivLm;
			stakedAmount = balance.givStaked;
			notStakedAmount = balance.balance;
			break;
		default:
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

	const poolContract = new Contract(poolAddress, UNI_ABI, signer);

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
	owenerAddress: string,
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

	const tokenContract = new Contract(poolAddress, ERC20_ABI, signer);
	const allowance: BigNumber = await tokenContract.allowance(
		owenerAddress,
		spenderAddress,
	);

	const amountNumber = ethers.BigNumber.from(amount);
	const allowanceNumber = ethers.BigNumber.from(allowance.toString());

	if (amountNumber.lte(allowanceNumber)) return true;

	const gasPreference = getGasPreference(
		config.NETWORKS_CONFIG[provider.network.chainId],
	);

	if (!allowance.isZero()) {
		try {
			const approveZero: TransactionResponse = await tokenContract
				.connect(signer.connectUnchecked())
				.approve(spenderAddress, ethers.constants.Zero, gasPreference);

			const { status } = await approveZero.wait();
		} catch (error) {
			console.log('Error on Zero Approve', error);
			return false;
		}
	}

	try {
		const approve = await tokenContract
			.connect(signer.connectUnchecked())
			.approve(spenderAddress, amountNumber, gasPreference);

		const { status } = await approve.wait();
	} catch (error) {
		console.log('Error on Amount Approve:', error);
		return false;
	}
	return true;
};

export const wrapToken = async (
	amount: string,
	poolAddress: string,
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
		return;
	}
};

export const stakeTokens = async (
	amount: string,
	poolAddress: string,
	lmAddress: string,
	provider: Web3Provider | null,
): Promise<TransactionResponse | undefined> => {
	if (amount === '0') return;
	if (!provider) {
		console.error('Provider is null');
		return;
	}

	const signer = provider.getSigner();

	const lmContract = new Contract(lmAddress, LM_ABI, signer);

	const rawPermitCall = await permitTokens(
		provider,
		poolAddress,
		lmAddress,
		amount,
	);

	try {
		const gasPreference = getGasPreference(
			config.NETWORKS_CONFIG[provider.network.chainId],
		);
		// const { status } = await txResponse.wait();
		return await lmContract
			.connect(signer.connectUnchecked())
			.stakeWithPermit(
				ethers.BigNumber.from(amount),
				rawPermitCall.data,
				{
					gasLimit: 300_000,
					...gasPreference,
				},
			);
	} catch (e) {
		console.error('Error on staking:', e);
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
	}
};
