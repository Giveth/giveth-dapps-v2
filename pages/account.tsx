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
	const { userData, isLoading } = useAppSelector(state => state.user);

	return (
		<>
			<Head>
				<title>Giveth | {userData?.name}</title>
			</Head>
			{isLoading ? (
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
					<H5>Please Sign In</H5>
				</NoUserContainer>
			)}
		</>
	);
};

export default UserRoute;
