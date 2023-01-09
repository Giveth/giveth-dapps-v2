import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { useWeb3React } from '@web3-react/core';
import { IconHelpFilled16 } from '@giveth/ui-design-system';
import { useRef, useState } from 'react';
import { gToast, ToastType } from '@/components/toasts';
import { useAppDispatch } from '@/features/hooks';
import { fetchXDaiInfoAsync } from '@/features/subgraph/subgraph.thunks';
import { FlowRateTooltip } from '@/components/homeTabs/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { zIndex } from '@/lib/constants/constants';

const TestRoute = () => {
	// const xDaiValues = useSelector(
	// 	(state: RootState) => state.subgraph.xDaiValues,
	// );
	const { account } = useWeb3React();
	const dispatch = useAppDispatch();
	const functionRef = useRef<Function>();
	const [state, setState] = useState(0);

	// const { data, isLoading, error, refetch } = useGetSubgraphValuesQuery({
	// 	chain: chainId,
	// 	userAddress: account,
	// });

	functionRef.current = () => {
		console.log(state);
	};

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
	// console.log('rect', rect);

	return (
		<>
			<TestContainer>
				this is test page.
				<IconWithTooltip
					icon={<IconHelpFilled16 />}
					direction='right'
					align='top'
				>
					<FlowRateTooltip>
						The rate at which you receive liquid GIV from your
						GIVstream.
					</FlowRateTooltip>
				</IconWithTooltip>
				{/* <Tooltip direction={direction} align={align} parentRef={elRef}>
					<div>Test</div>
				</Tooltip> */}
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
				<button
					type='button'
					onClick={() => functionRef.current && functionRef.current()}
				>
					check
				</button>
				<button
					type='button'
					onClick={() => setState(state => state + 1)}
				>
					increase
				</button>
				<div>
					--------------------------------------------
					<IconWithTooltip
						icon={<IconHelpFilled16 />}
						direction='right'
						align='bottom'
					>
						<FlowRateTooltip>
							The rate at which you receive liquid GIV from your
							GIVstream.
						</FlowRateTooltip>
					</IconWithTooltip>
				</div>
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
	padding: 200px 0;
`;

const TooltipContainer = styled.div`
	position: fixed;
	padding: 0;
	background-color: black;
	color: #fff;
	border-radius: 6px;
	padding: 8px;
	z-index: ${zIndex.TOOLTIP};
`;
