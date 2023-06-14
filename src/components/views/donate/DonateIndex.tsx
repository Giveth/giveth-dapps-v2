import React, { FC } from 'react';
import styled from 'styled-components';

import { BigArc } from '@/components/styled-components/Arc';
import { mediaQueries } from '@/lib/constants/constants';
import SocialBox from '../../SocialBox';
import SuccessView from '@/components/views/donate/SuccessView';
import ProjectCardSelector from '@/components/views/donate/ProjectCardSelector';
import DonationTypes from '@/components/views/donate/DonationTypes';
import NiceBanner from './NiceBanner';
// import PurchaseXDAI from './PurchaseXDAIBanner';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useDonateData } from '@/context/donate.context';
import { EContentType } from '@/lib/constants/shareContent';
import { PassportBanner } from '@/components/PassportBanner';

const DonateIndex: FC = () => {
	const { isMobile } = useDetectDevice();
	const { project, isSuccessDonation } = useDonateData();

	return (
		<>
			<BigArc />
			<PassportBanner />
			<Wrapper>
				{/* <PurchaseXDAI /> */}
				<NiceBanner />
				<Sections>
					<ProjectCardSelector />
					<Right>
						{isSuccessDonation ? (
							<SuccessView />
						) : (
							<DonationTypes />
						)}
					</Right>
				</Sections>
				{!isSuccessDonation && !isMobile && (
					<SocialBox
						contentType={EContentType.thisProject}
						project={project}
						isDonateFooter
					/>
				)}
			</Wrapper>
		</>
	);
};

const Wrapper = styled.div`
	max-width: 1052px;
	text-align: center;
	padding: 64px 0;
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

const Right = styled.div`
	z-index: 1;
	background: white;
	text-align: left;
	padding: 32px;
	min-height: 620px;
	border-radius: 16px;
	${mediaQueries.tablet} {
		border-radius: 0 16px 16px 0;
	}
`;

export default DonateIndex;
