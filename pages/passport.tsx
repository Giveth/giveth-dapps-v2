import Head from 'next/head';
import { useIntl } from 'react-intl';
import { PassportView } from '@/components/views/passport/passport.view';

const PassportRoute = () => {
	const { formatMessage } = useIntl();

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
