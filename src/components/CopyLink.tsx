import {
	brandColors,
	Button,
	GLink,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC, useState } from 'react';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import { isSSRMode } from '@/lib/helpers';

interface ICopyLink {
	url: string;
}

const CopyLink: FC<ICopyLink> = ({ url }) => {
	const [isCopied, setIsCopied] = useState(false);

	if (isSSRMode) {
		return null;
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(url);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 5000);
	};

	return (
		<DashedWrapper>
			<ProjectLink size='Small'>{url}</ProjectLink>
			<VerticalLine />
			<CustomButton
				buttonType='texty'
				size='small'
				label={isCopied ? 'copied!' : 'copy link'}
				onClick={() => !isCopied && handleCopy()}
				isCopied={isCopied}
			/>
		</DashedWrapper>
	);
};

const CustomButton = styled(Button)<{ isCopied: boolean }>`
	text-transform: uppercase;
	font-weight: 700;
	margin: 3px auto;
	width: 113px;
	flex-shrink: 0;
	flex-grow: 0;
	color: ${props =>
		props.isCopied ? brandColors.pinky[300] : brandColors.pinky[500]};

	:hover {
		background: transparent;
		color: ${props =>
			props.isCopied ? brandColors.pinky[300] : brandColors.pinky[500]};
	}
`;

const DashedWrapper = styled(FlexCenter)`
	border: 1px dashed ${neutralColors.gray[400]};
	border-radius: 8px;
	margin: 0 auto;
	box-shadow: ${Shadow.Giv[400]};
	background: white;
	width: fit-content;
`;

const ProjectLink = styled(GLink)`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 24px;
	color: ${neutralColors.gray[700]};
	word-break: break-word;
`;

const VerticalLine = styled.div`
	border-left: 1px solid ${neutralColors.gray[400]};
	height: 16px;
`;

export default CopyLink;
