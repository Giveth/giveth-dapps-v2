import { client } from '@/apollo/apolloClient';
import { FETCH_USER_PROJECTS } from '@/apollo/gql/gqlUser';
import { IProject } from '@/apollo/types/types';
import {
	brandColors,
	Container,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row } from '../../styled-components/Grid';
import { IUserPublicProfileView } from './UserPublicProfile.view';

const PublicProfileProjectsTab: FC<IUserPublicProfileView> = ({ user }) => {
	const [projects, setProjects] = useState<IProject[]>([]);
	useEffect(() => {
		if (!user) return;
		const fetchUserProjects = async () => {
			const { data: userProjects } = await client.query({
				query: FETCH_USER_PROJECTS,
				variables: {
					userId: parseFloat(user.id) || -1,
					take: 100,
					skip: 0,
				},
				fetchPolicy: 'network-only',
			});
			console.log('userProjects', userProjects);
		};
		fetchUserProjects();
	}, []);

	return <div>Projects</div>;
};

export default PublicProfileProjectsTab;
