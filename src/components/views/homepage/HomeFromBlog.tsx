import React, { useEffect, useState } from 'react';
import { brandColors, SemiTitle } from '@giveth/ui-design-system';
import styled from 'styled-components';

import HomeBlogPost from './HomeBlogPost';
import { IMediumBlogPost } from '@/apollo/types/types';
import { HomeContainer } from '@/components/views/homepage/Home.sc';
import { Col, Row } from '@/components/Grid';
import { deviceSize } from '@/lib/constants/constants';

const HomeFromBlog = () => {
	const [mediumPosts, setMediumPosts] = useState<IMediumBlogPost[]>();

	useEffect(() => {
		const getPosts = async () => {
			const medium = await fetch(
				'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/giveth/',
			);
			const posts = await medium.json();
			setMediumPosts(posts?.items?.slice(0, 2));
		};
		getPosts().then();
	}, []);

	return (
		<Wrapper>
			<Container>
				<Title>FROM OUR BLOG</Title>
				{mediumPosts && (
					<Row>
						{mediumPosts.map((post: IMediumBlogPost) => (
							<Col md={6} key={post.guid}>
								<HomeBlogPost post={post} />
							</Col>
						))}
					</Row>
				)}
			</Container>
		</Wrapper>
	);
};

const Title = styled(SemiTitle)`
	color: ${brandColors.giv[500]};
`;

const Container = styled.div`
	margin: 0 auto;
	max-width: ${deviceSize.desktop + 'px'};
`;

const Wrapper = styled(HomeContainer)`
	background: url('/images/curves_homepage.svg');
	padding-top: 90px;
	padding-bottom: 40px;
`;

export default HomeFromBlog;
