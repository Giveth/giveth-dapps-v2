import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';

import { ISuccessDonation } from './CryptoDonation';
import { IProjectBySlug } from '@/apollo/types/types';
import { BigArc } from '@/components/styled-components/Arc';
import useDeviceDetect from '@/hooks/useDeviceDetect';
import { mediaQueries } from '@/lib/constants/constants';
import SocialBox from './SocialBox';
import { formatTxLink } from '@/lib/helpers';
import SuccessView from '@/components/views/donate/SuccessView';
import ProjectCardSelector from '@/components/views/donate/ProjectCardSelector';
import DonationTypes from '@/components/views/donate/DonationTypes';
import NiceBanner from './NiceBanner';

const DonateIndex = (props: IProjectBySlug) => {
	const { project } = props;
	const [isSuccess, setSuccess] = useState<ISuccessDonation>();
	const { isMobile } = useDeviceDetect();

	const { chainId } = useWeb3React();

	const { givBackEligible, txHash } = isSuccess || {};

	return (
		<>
			<BigArc />
			<Wrapper>
				<NiceBanner project={project} />
				<Sections>
					<ProjectCardSelector project={project} />
					<Right isMobile={isMobile}>
						{isSuccess ? (
							<SuccessView
								txLink={formatTxLink(chainId, txHash)}
								project={project}
								givBackEligible={givBackEligible!}
							/>
						) : (
							<DonationTypes
								project={project}
								setSuccess={setSuccess}
							/>
						)}
					</Right>
				</Sections>
				{!isSuccess && !isMobile && <SocialBox project={project} />}
			</Wrapper>
		</>
	);
};

const Wrapper = styled.div`
	max-width: 1052px;
	text-align: center;
	padding: 137px 0;
	margin: 0 auto;
	position: relative;
`;

const Sections = styled.div`
	height: 100%;
	${mediaQueries.tablet} {
		display: grid;
		grid-template-columns: repeat(2, minmax(500px, 1fr));
		grid-auto-rows: minmax(100px, auto);
	}
	${mediaQueries.mobileL} {
		grid-template-columns: repeat(2, minmax(100px, 1fr));
		padding: 0 40px;
	}
`;

const Right = styled.div<{ isMobile: boolean }>`
	z-index: 1;
	background: white;
	text-align: left;
	padding: 65px 32px 32px;
	border-radius: ${props => (props.isMobile ? '16px' : '0 16px 16px 0')};
	min-height: 620px;
`;

export default DonateIndex;
