import Link from 'next/link';
import { htmlToText } from '@/lib/helpers';
import { GLink, P, H5, brandColors, Button } from '@giveth/ui-design-system';
import styled from 'styled-components';

interface IHomeBlogPost {
	post: IBlogPost;
}

interface IBlogPost {
	title: string;
	author: string;
	description: string;
	link: string;
	pubDate: string;
}

const HomeBlogPost = (props: IHomeBlogPost) => {
	const { post } = props;
	const { title, description, link, pubDate, author } = post;
	return (
		<Wrapper>
			<Link href={link}>
				<a>
					<Title weight={700}>{title}</Title>
				</a>
			</Link>
			<Description>{htmlToText(description)}</Description>
			<AuthorContainer>
				<GLink size='Medium'>{author}</GLink>
				<GLink size='Medium'>{pubDate.split(' ')[0]}</GLink>
				<Link href={link}>
					<ReadMoreButton>READ MORE</ReadMoreButton>
				</Link>
			</AuthorContainer>
		</Wrapper>
	);
};

const Title = styled(H5)`
	margin: 16px 0;
`;

const Description = styled(P)`
	height: 68px;
	overflow: hidden;
	margin-bottom: 40px;
`;

const AuthorContainer = styled.div`
	margin-top: auto;

	a {
		display: block;
	}
`;

const ReadMoreButton = styled.a`
	font-size: 14px;
	font-weight: 700;
	line-height: 18px;
	color: ${brandColors.pinky[500]};
	background-color: transparent;
	align-self: start;
	padding-top: 8px;
`;

const Wrapper = styled.div`
	color: ${brandColors.deep[500]};
	max-width: 420px;
	min-height: 300px;
	display: flex;
	flex-direction: column;
`;

export default HomeBlogPost;
