import { type FC } from 'react';
import { Flex, deviceSize } from '@giveth/ui-design-system';
import styled from 'styled-components';
import useMediaQuery from '@/hooks/useMediaQuery';
import CauseTip, {
	ICauseTipProps,
} from '@/components/views/causes/create/causeProGuide/CauseTip';
import { ECreateCauseSections } from '@/components/views/causes/create/types';

interface ICauseProGuideProps extends ICauseTipProps {}

export const CauseProGuide: FC<ICauseProGuideProps> = ({ activeSection }) => {
	const isLaptopL = useMediaQuery(`(min-width: ${deviceSize.laptopL}px)`);
	return isLaptopL ? (
		<Wrapper>
			<CauseTip activeSection={activeSection as ECreateCauseSections} />
		</Wrapper>
	) : null;
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	position: sticky;
	top: 100px;
	margin-top: 80px;
	gap: 24px;
	max-height: calc(100vh - 100px);
	overflow-y: auto;
`;
