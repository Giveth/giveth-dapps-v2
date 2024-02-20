import {
	brandColors,
	H5,
	H6,
	IconRocketInSpace32,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import { Flex } from '@/components/styled-components/Flex';
import { formatWeiHelper } from '@/helpers/number';
import { useAppSelector } from '@/features/hooks';
import { WrappedSpinner } from '@/components/Spinner';
import { getTotalGIVpower } from '@/helpers/givpower';
import { getGIVpowerOnChain } from '@/lib/stakingPool';

const TotalGIVpowerBox = () => {
	const [totalGIVpower, setTotalGIVpower] = useState<BigNumber>();
	const values = useAppSelector(state => state.subgraph);
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { address } = useAccount();

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
					const { total } = getTotalGIVpower(values, {
						chainId,
						balance: new BigNumber(_totalGIVpower.toString()),
					});
					return setTotalGIVpower(total);
				}
			} catch (err) {
				console.log('Error on getGIVpowerOnChain', { err });
			}
			// if we can't get the GIVpower from the contract, we calculate it from the subgraph
			const { total } = getTotalGIVpower(values);
			setTotalGIVpower(total);
		}

		fetchTotalGIVpower();
	}, [address, chainId, values]);

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
