import toast from 'react-hot-toast';
import { networksParams } from '@/helpers/blockchain';

export function showPendingStake(
	amount: string,
	network: number,
	txHash: string,
): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.success(
		<span>
			You are staking {amount} tokens. Check the status of your
			transaction{' '}
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				here
			</a>
			.
		</span>,
	);
}

export function showPendingApproval(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.success(
		<span>
			You are approving tokens. Check the status of your transaction{' '}
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				here
			</a>
			.
		</span>,
	);
}

export function showFailedStake(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.error(
		<span>
			Your staking failed! Check your transaction{' '}
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				here
			</a>
			.
		</span>,
	);
}

export function showConfirmedStake(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.success(
		<span>
			Staking{' '}
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				confirmed
			</a>
			! You are generating rewards!
		</span>,
	);
}

export function showFailedApproval(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.error(
		<span>
			Your approval failed! Check your transaction{' '}
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				here
			</a>
			.
		</span>,
	);
}

export function showConfirmedApproval(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.success(
		<span>
			Approval{' '}
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				confirmed
			</a>
			! Let&apos;s stake!
		</span>,
	);
}
