import { brandColors, H4, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';
import Routes from '@/lib/constants/Routes';

const OfTheDonors = () => {
	return (
		<Wrapper>
			<H4 weight={700}>Of the donors, by the donors, for the donors</H4>
			<H4>
				Giveth places donors at the heart of its mission. With GIVbacks,
				your generosity is reciprocated.{' '}
				<b>The more you donate, the more GIV tokens you earn.</b> These
				tokens aren’t just rewards; they're your voice in the{' '}
				<ExternalLink
					color={brandColors.pinky[500]}
					href={Routes.GIVeconomy}
					title='GIVgarden'
				/>
				, allowing you to influence which proposals get funded, thereby
				shaping the GIVeconomy's future. Through GIVbacks, GIV empowers
				donors with governance rights via the GIVgarden.
			</H4>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	max-width: 1180px;
	padding: 120px 30px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
	> *:first-child {
		margin-bottom: 16px;
	}
`;

export default OfTheDonors;
