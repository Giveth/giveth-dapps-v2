import styled from 'styled-components';
import { H5 } from '@giveth/ui-design-system';
import Head from 'next/head';
import { FC } from 'react';
import UserPublicProfileView from '@/components/views/userPublicProfile/UserPublicProfile.view';
import { useAppSelector } from '@/features/hooks';
import LottieControl from '@/components/animations/lottieControl';
import LoadingAnimation from '@/animations/loading_giv.json';

const NoUserContainer = styled.div`
	padding: 200px;
`;

const UserRoute: FC = () => {
	const { userData, isLoadingUser } = useAppSelector(state => state.user);
	return (
		<>
			<Head>
				<title>Giveth | {userData?.name}</title>
			</Head>
			{isLoadingUser ? (
				<NoUserContainer>
					<LottieControl
						animationData={LoadingAnimation}
						size={150}
					/>
				</NoUserContainer>
			) : userData ? (
				<UserPublicProfileView user={userData} myAccount />
			) : (
				<NoUserContainer>
					<H5>Not logged in or user not found</H5>
				</NoUserContainer>
			)}
		</>
	);
};

export default UserRoute;
