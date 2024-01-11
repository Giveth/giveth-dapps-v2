import Head from 'next/head';
import { useIntl } from 'react-intl';
import { PassportView } from '@/components/views/passport/passport.view';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';
import ErrorsIndex from '@/components/views/Errors/ErrorsIndex';

const PassportRoute = () => {
	const { formatMessage } = useIntl();
	const { walletChainType } = useGeneralWallet();

	if (walletChainType === ChainType.SOLANA) {
		return <ErrorsIndex statusCode='404' />;
	}

	return (
		<>
			<Head>
				<title>
					{formatMessage({ id: 'label.passport_score' })} | Giveth
				</title>
			</Head>
			<PassportView />
		</>
	);
};

export default PassportRoute;
