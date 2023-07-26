import styled from 'styled-components';
import { Lead, neutralColors } from '@giveth/ui-design-system';

const ReFiRepresents = () => {
	return (
		<Wrapper size='large'>
			ReFi represents a growing movement where technology is seen as a
			powerful tool to address urgent global challenges while fostering an
			evolved financial ecosystem.
			<br />
			<br />
			Giveth strengthens the ReFi movement by providing a platform that
			empowers individuals to support regenerative finance initiatives,
			through its innovative approach to fundraising and commitment to
			fostering positive change. With ReFi at its heart, Giveth is driving
			the transformation of the financial sector towards a more equitable,
			sustainable, and regenerative future.
		</Wrapper>
	);
};

const Wrapper = styled(Lead)`
	max-width: 1180px;
	padding: 120px 30px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
	> *:first-child {
		margin-bottom: 16px;
	}
`;

export default ReFiRepresents;
