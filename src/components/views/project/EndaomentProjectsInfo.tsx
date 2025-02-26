import React, { FC } from 'react';
import { neutralColors, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import ExternalLink from '@/components/ExternalLink';
import { ORGANIZATION } from '@/lib/constants/organizations';
import links from '@/lib/constants/links';

interface EndaomentProjectsInfo {
	orgLabel?: string;
}

export const EndaomentProjectsInfo: FC<EndaomentProjectsInfo> = ({
	orgLabel,
}) => {
	if (orgLabel === ORGANIZATION.endaoment) {
		return (
			<EndaomentInfo>
				<TitleWithLogo>
					This project is delivered by&nbsp;
					<StyledExternalLink
						href={links.ENDAOMENT}
						title='Endaoment'
						color={brandColors.pinky[500]} // Explicitly set the color here
					/>
					&nbsp;
					<Image
						src='/images/logo/endaoment-logo.png'
						width={18}
						height={18}
						alt='Endaoment logo'
					/>
				</TitleWithLogo>
				<DescriptionText>
					This project is delivered by Endaoment, which handles the
					conversion and delivery of fiat funding to this project.
					Endaoment charges a 1.5% fee on donations which is processed
					outside of the Giveth Dapp.
				</DescriptionText>
			</EndaomentInfo>
		);
	}

	return null;
};

// New styles for Endaoment Info
const EndaomentInfo = styled.div`
	padding: 18px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 8px;
	margin-top: 16px;
	margin-bottom: 16px;
`;

const TitleWithLogo = styled.div`
	display: flex;
	align-items: center;
	font-weight: 700;
	font-size: 16px; // Ensure the font size is explicitly set here
`;

const DescriptionText = styled.p`
	font-size: 14px;
	margin-top: 8px;
`;

const StyledExternalLink = styled(ExternalLink)`
	font-weight: bold;
`;

export default EndaomentProjectsInfo;
