import React, { useEffect, useState } from 'react';
import {
	brandColors,
	ButtonText,
	H4,
	IconChevronRight,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { IMediumBlogPost } from '@/apollo/types/types';
import BlogCard from '@/components/BlogCard';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const HomeFromBlog = () => {
	const [mediumPosts, setMediumPosts] = useState<IMediumBlogPost[]>();
	const { formatMessage } = useIntl();

	useEffect(() => {
		const getPosts = async () => {
			try {
				const medium = await fetch(
					'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/giveth/',
				);
				const posts = await medium.json();
				setMediumPosts(posts?.items?.slice(0, 3));
			} catch (error) {
				console.log('error', error);
			}
		};
		getPosts();
	}, []);

	return (
		<Wrapper>
			<Container>
				<Header>
					<Title weight={700}>
						{formatMessage({
							id: 'page.home.section.recent_posts',
						})}
					</Title>
					<ExternalLink href={links.MEDIUM}>
						<VisitBlog>
							<ButtonText size='large'>
								{formatMessage({
									id: 'page.home.section.visit_blog',
								})}
							</ButtonText>
							<IconChevronRight size={28} />
						</VisitBlog>
					</ExternalLink>
				</Header>
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

const VisitBlog = styled(FlexCenter)`
	color: ${brandColors.giv[500]};
	text-transform: uppercase;
	gap: 5px;
`;

const Header = styled(Flex)`
	margin-bottom: 24px;
	justify-content: space-between;
	align-items: center;
	gap: 35px;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

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
`;

const Wrapper = styled.div`
	padding-top: 70px;
	padding-bottom: 110px;
	background: ${neutralColors.gray[200]};
`;

export default HomeFromBlog;
