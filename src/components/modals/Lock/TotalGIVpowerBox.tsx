import {
	brandColors,
	H5,
	H6,
	IconRocketInSpace32,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Lottie from 'react-lottie';
import { Flex } from '@/components/styled-components/Flex';
import { formatWeiHelper } from '@/helpers/number';
import { getTotalGIVpower } from '@/lib/stakingPool';
import config from '@/configuration';
import LoadingAnimation from '@/animations/loading.json';
import type BigNumber from 'bignumber.js';

const loadingAnimationOptions = {
	loop: true,
	autoplay: true,
	animationData: LoadingAnimation,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const TotalGIVpowerBox = () => {
	const [totalGIVpower, setTotalGIVpower] = useState<BigNumber>();
	const { account, library } = useWeb3React();

	const contractAddress = config.XDAI_CONFIG.GIV.LM_ADDRESS;
	useEffect(() => {
		async function fetchTotalGIVpower() {
			if (!account) return;
			const _totalGIVpower = await getTotalGIVpower(
				account,
				contractAddress,
				library,
			);
			if (_totalGIVpower) {
				setTotalGIVpower(_totalGIVpower);
			}
		}

		fetchTotalGIVpower();
	}, []);

	return (
		<BoxContainer>
			{totalGIVpower ? (
				<>
					<H6>You Have</H6>
					<BoxRow
						alignItems='baseline'
						gap='8px'
						justifyContent='center'
					>
						<IconWrapper>
							<IconRocketInSpace32 />
						</IconWrapper>
						<H5 weight={700}>
							{formatWeiHelper(totalGIVpower, 2)}
						</H5>
						<H6>GIVpower</H6>
					</BoxRow>
				</>
			) : (
				<Lottie
					options={loadingAnimationOptions}
					height={40}
					width={40}
				/>
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
`;

const IconWrapper = styled.div`
	color: ${brandColors.mustard[500]};
`;

const BoxRow = styled(Flex)`
	margin-top: 18px;
`;

export default TotalGIVpowerBox;
