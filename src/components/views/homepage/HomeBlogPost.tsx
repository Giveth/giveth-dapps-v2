import { GLink, P, H5, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { htmlToText } from '@/lib/helpers';

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

const HomeBlogPost = ({ post }: IHomeBlogPost) => {
	const { title, description, link, pubDate, author } = post;
	return (
		<Wrapper>
			<a href={link}>
				<Title weight={700}>{htmlToText(title)}</Title>
			</a>
			<Description>{htmlToText(description)}</Description>
			<AuthorContainer>
				<GLink size='Medium'>{author}</GLink>
				<GLink size='Medium'>{pubDate.split(' ')[0]}</GLink>
				<ReadMoreButton href={link}>READ MORE</ReadMoreButton>
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
	padding-right: 50px;
	padding-bottom: 50px;
`;

export default HomeBlogPost;
