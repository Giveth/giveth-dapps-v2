import React, { useEffect, useState } from 'react';
import {
	brandColors,
	ButtonText,
	IconChevronRight,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Col, Container, Row } from '@giveth/ui-design-system';
import { IMediumBlogPost } from '@/apollo/types/types';
import BlogCard from '@/components/BlogCard';
import { FlexCenter } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { BlockHeader, BlockTitle } from './common';

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
				<BlockHeader>
					<BlockTitle weight={700}>
						{formatMessage({
							id: 'page.home.section.recent_posts',
						})}
					</BlockTitle>
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
				</BlockHeader>
				<CardsRow>
					{mediumPosts?.map(post => (
						<ColStyled sm={12} lg={4} key={post.guid}>
							<BlogCard
								title={post.title}
								description={post.description}
								image={post.thumbnail}
								link={post.link}
								author={post.author}
								date={post.pubDate}
							/>
						</ColStyled>
					))}
				</CardsRow>
			</Container>
		</Wrapper>
	);
};

const ColStyled = styled(Col)`
	margin-top: 24px;
`;

const VisitBlog = styled(FlexCenter)`
	color: ${brandColors.giv[500]};
	text-transform: uppercase;
	gap: 5px;
`;

const CardsRow = styled(Row)`
	flex-direction: column;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

const Wrapper = styled.div`
	padding-top: 70px;
	padding-bottom: 110px;
	background: ${neutralColors.gray[200]};
`;

export default HomeFromBlog;
