import React, { useEffect, useState } from 'react';
import { H4, mediaQueries, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { IMediumBlogPost } from '@/apollo/types/types';
import BlogCard from '@/components/BlogCard';
import { Flex } from '@/components/styled-components/Flex';

const HomeFromBlog = () => {
	const [mediumPosts, setMediumPosts] = useState<IMediumBlogPost[]>();
	const { formatMessage } = useIntl();

	useEffect(() => {
		const getPosts = async () => {
			const medium = await fetch(
				'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/giveth/',
			);
			const posts = await medium.json();
			setMediumPosts(posts?.items?.slice(0, 3));
		};
		getPosts().then();
	}, []);

	return (
		<Wrapper>
			<Container>
				<Title weight={700}>
					{formatMessage({ id: 'page.home.section.from_blog' })}
				</Title>
				<Cards>
					{mediumPosts?.map(post => (
						<BlogCard
							key={post.guid}
							title={post.title}
							description={post.description}
							image={post.thumbnail}
							link={post.link}
							author={post.author}
							date={post.pubDate}
						/>
					))}
				</Cards>
			</Container>
		</Wrapper>
	);
};

const Container = styled.div`
	margin: 0 auto;
	padding: 0 24px;
	${mediaQueries.tablet} {
		padding: 0 40px;
		width: fit-content;
	}
`;

const Cards = styled(Flex)`
	flex-direction: column;
	gap: 24px;
	max-width: 1200px;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

const Title = styled(H4)`
	color: ${neutralColors.gray[600]};
	margin-bottom: 24px;
`;

const Wrapper = styled.div`
	padding-top: 70px;
	padding-bottom: 110px;
	background: ${neutralColors.gray[200]};
`;

export default HomeFromBlog;
