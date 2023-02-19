import { FC } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	ButtonText,
	Caption,
	H5,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import ExternalLink from '@/components/ExternalLink';
import { htmlToText } from '@/lib/helpers';
import { Flex } from '@/components/styled-components/Flex';

interface IBlogCard {
	title: string;
	description: string;
	image: string;
	link: string;
	author: string;
	date: string;
}

const formatDate = (d: string) => {
	const date = new Date(d);
	const month = date.toLocaleString('default', { month: 'short' });
	const day = date.getDay();
	const year = date.getFullYear();
	return `${month} ${day}, ${year}`;
};

const BlogCard: FC<IBlogCard> = props => {
	const { title, description, image, link, author, date } = props;
	const wordsCount = htmlToText(description)?.split(' ').length;
	const readingTime = Math.ceil((wordsCount || 200) / 183);
	const { formatMessage } = useIntl();
	return (
		<Wrapper>
			<div>
				<ImageWrapper>
					<img width='100%' height={170} src={image} alt={title} />
				</ImageWrapper>
				<Title weight={700}>{htmlToText(title)}</Title>
				<Description>{htmlToText(description)}</Description>
			</div>
			<div>
				<AuthorDate>
					<div>{author}</div>
					<div>
						{formatDate(date)}
						<span> • {readingTime} min read</span>
					</div>
				</AuthorDate>
				<ExternalLink href={link}>
					<ReadMore>
						{formatMessage({ id: 'label.read_more' })}
					</ReadMore>
				</ExternalLink>
			</div>
		</Wrapper>
	);
};

const ReadMore = styled(ButtonText)`
	color: ${brandColors.pinky[500]};
	text-transform: uppercase;
`;

const AuthorDate = styled(Caption)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 24px;
`;

const Description = styled(P)`
	color: ${neutralColors.gray[900]};
	margin-bottom: 24px;
	height: 72px;
	overflow: hidden;
`;

const Title = styled(H5)`
	margin: 8px 0;
	color: ${neutralColors.gray[900]};
`;

const ImageWrapper = styled.div`
	border-radius: 16px;
	height: 170px;
	width: 100%;
	overflow: hidden;
	> img {
		object-fit: cover;
	}
`;

const Wrapper = styled(Flex)`
	flex-direction: column;
	justify-content: space-between;
	background: white;
	border-radius: 16px;
	padding: 24px;
	width: 100%;
	height: 100%;
`;

export default BlogCard;
