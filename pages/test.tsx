import Head from 'next/head';
import styled from 'styled-components';
import { gToast, ToastType } from '@/components/toasts';

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
			</TestContainer>
		</>
	);
};

export default TestRoute;

const TestContainer = styled.div`
	padding: 200px;
`;
