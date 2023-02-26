import styled from 'styled-components';
import {
	H4,
	IconChevronRight32,
	neutralColors,
} from '@giveth/ui-design-system';
import { GhostButton } from '@/components/styled-components/Button';

const SupportUs = () => {
	return (
		<Wrapper>
			<H4 weight={700}>Become a Partner</H4>
			<H4>
				Are you an organization that wants to contribute to our Impact
				Quest prize pool?
			</H4>
			<GhostButton
				label='Learn more here'
				size='large'
				icon={<IconChevronRight32 />}
			/>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	max-width: 1200px;
	padding: 40px;
	margin: 60px auto;
	color: ${neutralColors.gray[900]};
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 16px;
`;

export default SupportUs;
