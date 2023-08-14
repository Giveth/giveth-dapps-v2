import {
	brandColors,
	H5,
	H6,
	IconRocketInSpace32,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Flex } from '@/components/styled-components/Flex';
import { formatWeiHelper } from '@/helpers/number';
import { useAppSelector } from '@/features/hooks';
import { WrappedSpinner } from '@/components/Spinner';
import { getTotalGIVpower } from '@/helpers/givpower';

const TotalGIVpowerBox = () => {
	const [totalGIVpower, setTotalGIVpower] = useState<BigNumber>();
	const values = useAppSelector(state => state.subgraph);

	useEffect(() => {
		async function fetchTotalGIVpower() {
			try {
				const { total } = getTotalGIVpower(values);
				setTotalGIVpower(new BigNumber(total));
			} catch (err) {
				console.log({ err });
			}
		}

		fetchTotalGIVpower();
	}, []);

	return (
		<BoxContainer>
			{totalGIVpower ? (
				<>
					<H6>You have</H6>
					<BoxRow
						alignItems='baseline'
						gap='8px'
						justifyContent='center'
					>
						<IconWrapper>
							<IconRocketInSpace32 />
						</IconWrapper>
						<H5 weight={700}>{formatWeiHelper(totalGIVpower)}</H5>
						<H6>GIVpower</H6>
					</BoxRow>
				</>
			) : (
				<WrappedSpinner size={90} />
			)}
		</BoxContainer>
	);
};

const BoxContainer = styled.div`
	background: ${brandColors.giv[500]};
	border-radius: 16px;
	padding: 24px;
	margin: 24px 0;
	text-align: center;
	height: 132px;
`;

const IconWrapper = styled.div`
	color: ${brandColors.mustard[500]};
`;

const BoxRow = styled(Flex)`
	margin-top: 12px;
`;

export default TotalGIVpowerBox;
