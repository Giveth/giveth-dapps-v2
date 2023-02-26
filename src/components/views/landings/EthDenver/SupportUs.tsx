import styled from 'styled-components';
import {
	H4,
	IconChevronRight32,
	neutralColors,
} from '@giveth/ui-design-system';
import { GhostButton } from '@/components/styled-components/Button';
import { Container } from '@/components/Grid';
import ExternalLink from '@/components/ExternalLink';

const SupportUs = () => {
	return (
		<Wrapper>
			<H4 weight={700}>Become a Partner</H4>
			<H4>
				Are you an organization that wants to contribute to our Impact
				Quest prize pool?
			</H4>
			<ExternalLink href='https://giveth.notion.site/Become-an-Impact-Quest-Partner-f3c29ec6685a4a75b46a0f6a0a3ea917'>
				<GhostButton
					label='Learn more here'
					size='large'
					icon={<IconChevronRight32 />}
				/>
			</ExternalLink>
		</Wrapper>
	);
};

const Wrapper = styled(Container)`
	padding-top: 40px;
	padding-bottom: 40px;
	color: ${neutralColors.gray[900]};
	& > h4 {
		margin-bottom: 16px;
	}
`;

export default SupportUs;
