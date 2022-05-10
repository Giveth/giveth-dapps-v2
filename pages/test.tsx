import Head from 'next/head';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { useSelector, useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { gToast, ToastType } from '@/components/toasts';
import { RootState } from '@/stores/store';
import { updateXDaiValues } from '@/stores/subgraph.store';

const TestRoute = () => {
	const xDaiValues = useSelector(
		(state: RootState) => state.subgraph.xDaiValues,
	);
	const dispatch = useDispatch();
	const { library } = useWeb3React();

	const notify = () =>
		gToast('Testeeee', {
			type: ToastType.SUCCESS,
			// direction: ToastDirection.RIGHT,
			title: 'test',
			dismissLabel: 'OK :D',
			position: 'bottom-center',
		});

	console.log('xDaiValues', xDaiValues);
	useEffect(() => {
		if (!library) return;
		library.on('block', (evt: any) => {
			console.log('evt', evt);
			// dispatch(updateXDaiValues());
		});
		return () => {
			library.removeAllListeners('block');
		};
	}, [library]);

	return (
		<>
			<Head>
				<title>Terms of use | Giveth</title>
			</Head>
			<TestContainer>
				<button onClick={() => dispatch(updateXDaiValues())}>
					Dispatch
				</button>
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
