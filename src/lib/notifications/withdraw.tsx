import toast from 'react-hot-toast';
import { networksParams } from '@/helpers/blockchain';

export function showPendingWithdraw(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.success(
		<span>
			Withdrawal submitted! Check the status{' '}
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

export function showFailedWithdraw(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.error(
		<span>
			Withdrawal failed! Check your transaction{' '}
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

export function showConfirmedWithdraw(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.success(
		<span>
			Withdrawal{' '}
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				completed
			</a>
			! Your tokens are in your wallet.
		</span>,
	);
}
