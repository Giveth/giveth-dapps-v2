import toast from 'react-hot-toast';
import config from '@/configuration';
import { networksParams } from '@/helpers/blockchain';

export function showCorrectAnswer(): void {
	toast.success('Correct!', { duration: 2000 });
}

export function showPendingRequest(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.success(
		<span>
			Your NODEdrop is on the way! Check the status{' '}
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

export function showFailedRequest(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	toast.error(
		<span>
			Your{' '}
			<a
				target='_blank'
				href={transactionExplorer}
				rel='noreferrer'
				style={{ color: 'white' }}
			>
				transaction
			</a>{' '}
			failed!
		</span>,
	);
}

export function showConfirmedRequest(network: number, txHash: string): void {
	const transactionExplorer = `${networksParams[network].blockExplorerUrls[0]}tx/${txHash}`;

	if (network === config.MAINNET_NETWORK_NUMBER) {
		toast.success(
			<span>
				NODEdrop{' '}
				<a
					target='_blank'
					href={transactionExplorer}
					rel='noreferrer'
					style={{ color: 'white' }}
				>
					confirmed
				</a>
				. Go stake your NODE in the dashboard!
			</span>,
		);
	} else if (network === config.XDAI_NETWORK_NUMBER) {
		toast.success(
			<span>
				NODEdrop{' '}
				<a
					target='_blank'
					href={transactionExplorer}
					rel='noreferrer'
					style={{ color: 'white' }}
				>
					confirmed
				</a>
				! Check your NODEstream in the dashboard!
			</span>,
		);
	}
}
