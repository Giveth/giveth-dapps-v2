import {
	brandColors,
	H5,
	H6,
	IconRocketInSpace32,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import { formatWeiHelper } from '@/helpers/number';
import { WrappedSpinner } from '@/components/Spinner';
import { getTotalGIVpower } from '@/helpers/givpower';
import { getGIVpowerOnChain } from '@/lib/stakingPool';
import { useFetchSubgraphDataForAllChains } from '@/hooks/useFetchSubgraphDataForAllChains';

const TotalGIVpowerBox = () => {
	const [totalGIVpower, setTotalGIVpower] = useState<BigNumber>();
	const { address, chain } = useAccount();
	const chainId = chain?.id;
	const subgraphValues = useFetchSubgraphDataForAllChains();

	useEffect(() => {
		async function fetchTotalGIVpower() {
			try {
				if (!address || !chainId) return;
				// try to get the GIVpower from the contract
				const _totalGIVpower = await getGIVpowerOnChain(
					address,
					chainId,
				);
				// if we can get the GIVpower from the contract, we use that
				if (_totalGIVpower) {
					const { total } = getTotalGIVpower(
						subgraphValues,
						address,
						{
							chainId,
							balance: new BigNumber(_totalGIVpower.toString()),
						},
					);
					return setTotalGIVpower(total);
				}
			} catch (err) {
				console.error('Error on getGIVpowerOnChain', { err });
			}
			// if we can't get the GIVpower from the contract, we calculate it from the subgraph
			const { total } = getTotalGIVpower(subgraphValues, address);
			setTotalGIVpower(total);
		}

		fetchTotalGIVpower();
	}, [address, chainId, subgraphValues]); // TODO: Cause re-render?!! Should check

	return (
		<BoxContainer>
			{totalGIVpower ? (
				<>
					<H6>You have</H6>
					<BoxRow
						$alignItems='baseline'
						gap='8px'
						$justifyContent='center'
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
