import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import ImpactQuests from '@/components/views/landings/EthDenver/impactQuest/ImpactQuests';
import ImpactDenver from '@/components/views/landings/EthDenver/impactQuest/ImpactDenver';
import Partners from '@/components/views/landings/EthDenver/impactQuest/Partners';
import ImpactTrackMentorship from '@/components/views/landings/EthDenver/impactQuest/ImpactTrackMentorship';

const ImpactQuest = () => {
	return (
		<Wrapper>
			<ImpactQuests />
			<ImpactTrackMentorship />
			<ImpactDenver />
			<Partners />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 40px 0;
	max-width: 1200px;
	margin: 0 auto;
	color: ${neutralColors.gray[900]};
`;

export default ImpactQuest;
