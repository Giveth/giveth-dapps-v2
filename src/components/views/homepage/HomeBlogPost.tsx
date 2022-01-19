import Link from 'next/link';
import { htmlToText } from '@/lib/helpers';
import {
	GLink,
	P,
	H5,
	brandColors,
	ButtonLink,
} from '@giveth/ui-design-system';
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
					<Title>{title}</Title>
				</a>
			</Link>
			<Description>{htmlToText(description)}</Description>
			<GLink size='Medium'>{author}</GLink>
			<GLink size='Medium'>{pubDate.split(' ')[0]}</GLink>
			<br />
			<Link href={link}>
				<ButtonLink label='READ MORE'></ButtonLink>
			</Link>
		</Wrapper>
	);
};

const Description = styled(P)`
	height: 68px;
	overflow: hidden;
	margin-bottom: 40px;
`;

const Title = styled(H5)`
	margin: 16px 0;
`;

const Wrapper = styled.div`
	color: ${brandColors.deep[500]};
	max-width: 420px;
`;

export default HomeBlogPost;
