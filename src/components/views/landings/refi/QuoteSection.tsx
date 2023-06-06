import styled from 'styled-components';
import {
	Button,
	H4,
	H6,
	IconChevronRight32,
	Lead,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import links from '@/lib/constants/links';
import ExternalLink from '@/components/ExternalLink';

const QuoteSection = () => {
	const { formatMessage } = useIntl();
	return (
		<Wrapper>
			<H4 weight={700}>Quote section</H4>
			<Body size='large'>
				“Web-3 is not just about building new applications, it's about
				building a better future. Public goods are the foundation of
				this new world we're creating. They're the building blocks that
				allow us to create a more open, transparent, and equitable
				digital society. Without them, we're just building castles in
				the sand.”
			</Body>
			<Author>Samantha Nakamoto</Author>
			<ExternalLink href={links.DISCORD}>
				<Button
					label={
						formatMessage({ id: 'label.join_us_on' }) + ' Discord'
					}
					buttonType='texty-primary'
					icon={<IconChevronRight32 />}
				/>
			</ExternalLink>
		</Wrapper>
	);
};

const Author = styled(H6)`
	margin: 16px 0;
`;

const Body = styled(Lead)`
	margin: 16px 0;
`;

const Wrapper = styled.div`
	margin: 80px auto;
	max-width: 1280px;
	padding: 40px;
`;

export default QuoteSection;
