import Head from 'next/head';
import styled from 'styled-components';
import { gToast, ToastType } from '@/components/toasts';
import { GetServerSideProps } from 'next';
import { countReset } from 'console';

const TestRoute = () => {
	const notify = () =>
		gToast('Testeeee', {
			type: ToastType.SUCCESS,
			// direction: ToastDirection.RIGHT,
			title: 'test',
			dismissLabel: 'OK :D',
			position: 'bottom-center',
		});
	return (
		<>
			<Head>
				<title>Terms of use | Giveth</title>
			</Head>
			<TestContainer>
				<button onClick={notify}>Test</button>
				<button
					type='button'
					onClick={() => {
						throw new Error('Sentry Frontend Error');
					}}
				>
					Throw error
				</button>
			</TestContainer>
		</>
	);
};

export default TestRoute;

export const getServerSideProps: GetServerSideProps = async context => {
	// let { statusCode } = context.res;
	// statusCode = 500;
	context.res.statusCode = 500;
	return {
		props: {
			name: 'test',
		},
	};
};

const TestContainer = styled.div`
	padding: 200px;
`;
