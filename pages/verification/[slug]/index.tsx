import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { useRouter } from 'next/router';
import VerificationIndex from '@/components/views/verification/VerificationIndex';
import { setShowFooter } from '@/features/general/general.slice';
import { VerificationProvider } from '@/context/verification.context';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { WrappedSpinner } from '@/components/Spinner';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import { compareAddresses, isUserRegistered } from '@/lib/helpers';
import CompleteProfile from '@/components/CompleteProfile';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import NotAvailableHandler from '@/components/NotAvailableHandler';

const VerificationRoute = () => {
	const dispatch = useAppDispatch();
	const [isProjectLoading, setIsProjectLoading] = useState(true);
	const [isCancelled, setIsCancelled] = useState(false);
	const [allowVerification, setAllowVerification] = useState(false);
	const [ownerAddress, setOwnerAddress] = useState<string>();

	const { isLoading, isEnabled, isSignedIn, userData } = useAppSelector(
		state => state.user,
	);
	const router = useRouter();
	const { slug } = router.query;

	useEffect(() => {
		dispatch(setShowFooter(false));
		return () => {
			dispatch(setShowFooter(true));
		};
	}, []);

	useEffect(() => {
		setIsProjectLoading(true);
		setAllowVerification(false);
		setOwnerAddress(undefined);
		setIsCancelled(false);
		client
			.query({
				query: FETCH_PROJECT_BY_SLUG,
				variables: {
					slug,
					connectedWalletUserId: Number(userData?.id),
				},
				fetchPolicy: 'network-only',
			})
			.then((res: { data: { projectBySlug: IProject } }) => {
				const _project = res.data.projectBySlug;
				const isOwner = compareAddresses(
					userData?.walletAddress,
					_project.adminUser.walletAddress,
				);
				setOwnerAddress(_project.adminUser.walletAddress);
				if (_project.status.name === EProjectStatus.ACTIVE && isOwner) {
					setAllowVerification(true);
				} else {
					setAllowVerification(false);
				}
				if (_project.status.name === EProjectStatus.CANCEL && isOwner) {
					setIsCancelled(true);
				}
				setIsProjectLoading(false);
			})
			.catch((error: unknown) => {
				console.log('fetchProjectBySlug error: ', error);
				captureException(error, {
					tags: {
						section: 'verificationFetchProjectBySlug',
					},
				});
				setIsProjectLoading(false);
			});
	}, [slug, userData?.id]);

	if (isLoading || isProjectLoading) {
		return <WrappedSpinner />;
	} else if (!isEnabled) {
		return <WalletNotConnected />;
	} else if (!isSignedIn) {
		return <UserNotSignedIn />;
	} else if (!isUserRegistered(userData)) {
		return <CompleteProfile />;
	} else if (!allowVerification) {
		return (
			<NotAvailableHandler
				ownerAddress={ownerAddress}
				isCancelled={isCancelled}
			/>
		);
	}

	return (
		<VerificationProvider>
			<Head>
				<title>Verify a Project | Giveth</title>
			</Head>
			<VerificationIndex />
		</VerificationProvider>
	);
};

export default VerificationRoute;
