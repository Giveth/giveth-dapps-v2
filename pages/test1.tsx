import Head from 'next/head';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { useWeb3React } from '@web3-react/core';
import { gToast, ToastType } from '@/components/toasts';
import { useAppDispatch } from '@/features/hooks';
import { fetchXDaiInfoAsync } from '@/features/subgraph/subgraph.thunks';

const TestRoute = () => {
	// const xDaiValues = useSelector(
	// 	(state: RootState) => state.subgraph.xDaiValues,
	// );
	const { account } = useWeb3React();
	const dispatch = useAppDispatch();

	// const { data, isLoading, error, refetch } = useGetSubgraphValuesQuery({
	// 	chain: chainId,
	// 	userAddress: account,
	// });

	const notify = () =>
		gToast('Testeeee', {
			type: ToastType.SUCCESS,
			// direction: ToastDirection.RIGHT,
			title: 'test',
			dismissLabel: 'OK :D',
			position: 'bottom-center',
		});

	// console.log('xDaiValues', xDaiValues);
	// useEffect(() => {
	// 	if (!library) return;
	// 	library.on('block', (evt: any) => {
	// 		console.log('evt', evt);
	// 		// dispatch(updateXDaiValues());
	// 	});
	// 	return () => {
	// 		library.removeAllListeners('block');
	// 	};
	// }, [library]);
	// console.log('****data', data);

	return (
		<>
			<Head>
				<Asghar />
			</Head>
			<TestContainer>
				<button
					onClick={() => {
						if (account) {
							dispatch(fetchXDaiInfoAsync(account));
						}
					}}
				>
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

const Asghar = () => <title>Asghar kopak</title>;
