import toast from 'react-hot-toast';
import { networksParams } from '@/helpers/blockchain';

export function showPendingClaim(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.success(
		<span>
			Claim submitted! Check the status{' '}
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

export function wrongWallet(address: string): void {
	toast(
		<span>
			Please connect to the eligible wallet address on xDai:{' '}
			{address?.toLowerCase()}
		</span>,
		{
			duration: 3000,
			position: 'bottom-center',
			style: {
				minWidth: '450px',
				textAlign: 'center',
				color: 'white',
				backgroundColor: '#E1458D',
			},
		},
	);
}

export function showFailedClaim(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.error(
		<span>
			Your claim failed! Check your transaction{' '}
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

export function showConfirmedClaim(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.success(
		<span>
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				Claimed
			</a>
			Your GIV tokens are in your wallet.
		</span>,
	);
}
