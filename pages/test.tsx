import Head from 'next/head';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { gToast, ToastDirection, ToastType } from '@/components/toasts';

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
				<Toaster />
			</TestContainer>
		</>
	);
};

export default TestRoute;

const TestContainer = styled.div`
	padding: 200px;
`;
