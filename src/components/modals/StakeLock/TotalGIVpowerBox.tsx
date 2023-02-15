import {
	brandColors,
	H5,
	H6,
	IconRocketInSpace32,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Flex } from '@/components/styled-components/Flex';
import { formatWeiHelper } from '@/helpers/number';
import { getTotalGIVpower } from '@/lib/stakingPool';
import config from '@/configuration';
import LoadingAnimation from '@/animations/loading.json';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import LottieControl from '@/components/LottieControl';

const TotalGIVpowerBox = () => {
	const [totalGIVpower, setTotalGIVpower] = useState<BigNumber>();
	const { account, library, chainId } = useWeb3React();
	const xDaiValues = useAppSelector(state => state.subgraph.xDaiValues);

	useEffect(() => {
		async function fetchTotalGIVpower() {
			try {
				if (!account) return;
				if (chainId !== config.XDAI_NETWORK_NUMBER)
					throw new Error('Change Netowrk to fetchTotalGIVpower');
				const contractAddress = config.XDAI_CONFIG.GIV.LM_ADDRESS;
				const _totalGIVpower = await getTotalGIVpower(
					account,
					contractAddress,
					library,
				);
				if (_totalGIVpower) {
					setTotalGIVpower(_totalGIVpower);
				}
			} catch (err) {
				console.log({ err });
				const sdh = new SubgraphDataHelper(xDaiValues);
				const userGIVPowerBalance = sdh.getUserGIVPowerBalance();
				setTotalGIVpower(new BigNumber(userGIVPowerBalance.balance));
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
				<LottieControl animationData={LoadingAnimation} size={90} />
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
