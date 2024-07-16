import Head from 'next/head';
import { useIntl } from 'react-intl';
import { QFEligibilityView } from '@/components/views/qfEligibility/QFEligibility.view';

const QFEligibilityRoute = () => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Head>
				<title>
					{formatMessage({ id: 'page.qf_eligibility.head' })} | Giveth
				</title>
			</Head>
			<QFEligibilityView />
		</>
	);
};

export default QFEligibilityRoute;
