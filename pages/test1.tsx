import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { useWeb3React } from '@web3-react/core';
import { IconHelpFilled16 } from '@giveth/ui-design-system';
import { FC, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Container } from '@giveth/ui-design-system';
import { gToast, ToastType } from '@/components/toasts';
import { useAppDispatch } from '@/features/hooks';
import { fetchXDaiInfoAsync } from '@/features/subgraph/subgraph.thunks';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { removeQueryParamAndRedirect } from '@/helpers/url';
import { TestProvider, useTestData } from '@/context/test.context';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';

const RichTextInput = dynamic(() => import('@/components/RichTextInput'), {
	ssr: false,
});

const TestRoute = () => {
	return (
		<TestProvider>
			<TestIndex />
		</TestProvider>
	);
};

//This comment is for testing1

const TestIndex = () => {
	// const xDaiValues = useSelector(
	// 	(state: RootState) => state.subgraph.xDaiValues,
	// );
	const [showModal, setShowModal] = useState(false);
	const { account } = useWeb3React();
	const dispatch = useAppDispatch();
	const functionRef = useRef<Function>();
	const [state, setState] = useState(0);
	const [description, setDescription] = useState('');
	const router = useRouter();
	const { setTest } = useTestData();
	console.log('Index rerender');

	useEffect(() => {
		setInterval(() => {
			setTest(test => !test);
		}, 1000);
	}, [setTest]);

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

	const fetchProjects = async () => {
		const res = await client.query({
			query: FETCH_ALL_PROJECTS,
			fetchPolicy: 'network-only',
		});
		console.log('res', res);
	};

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
				<button
					type='button'
					onClick={() => {
						removeQueryParamAndRedirect(router, [
							'filter',
							'campaign',
						]);
					}}
				>
					remove search
				</button>
				<button type='button' onClick={() => setShowModal(true)}>
					show Modal
				</button>
				<button type='button' onClick={fetchProjects}>
					Fetch Projects
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
							GIVstream.here!
						</FlowRateTooltip>
					</IconWithTooltip>
				</div>
				redeploy!
				<RichTextInput
					setValue={setDescription}
					value={description}
					limit={200}
				/>
			</TestContainer>
			{showModal && <TestModal setShowModal={setShowModal} />}
		</>
	);
};
interface ITestInnerModalProps {}

interface ITestModalProps extends IModal, ITestInnerModalProps {}

const TestModal: FC<ITestModalProps> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	console.log('Modal rerender');
	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='APR'
		>
			<TestInnerModal />
		</Modal>
	);
};

const TestInnerModal: FC<ITestInnerModalProps> = () => {
	const { test } = useTestData();
	console.log('Inner Modal rerender');
	return (
		<div>
			<div>Hiii there this is test:</div>
			<div>{test.toString()}</div>
		</div>
	);
};

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

const TestContainer = styled(Container)`
	padding-top: 200px;
	padding-bottom: 200px;
`;

export default TestRoute;
