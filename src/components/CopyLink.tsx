import {
	brandColors,
	Button,
	GLink,
	neutralColors,
	semanticColors,
	IconLink,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { FC, useState } from 'react';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import { isSSRMode } from '@/lib/helpers';

interface ICopyLink {
	url: string;
}

const CopyLink: FC<ICopyLink> = ({ url }) => {
	const [isCopied, setIsCopied] = useState(false);
	const { formatMessage } = useIntl();

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
			<CustomButton
				buttonType='texty-gray'
				size='small'
				icon={<IconLink />}
				label={
					isCopied
						? `${formatMessage({ id: 'label.copied' })}`
						: formatMessage({ id: 'label.copy_link' })
				}
				onClick={() => !isCopied && handleCopy()}
				isCopied={isCopied}
			/>
		</DashedWrapper>
	);
};

const CustomButton = styled(Button)<{ isCopied: boolean }>`
	font-weight: 700;
	margin: 3px auto;
	margin-right: 16px;
	width: 123px;
	flex-shrink: 0;
	flex-grow: 0;
	box-shadow: ${Shadow.Giv[400]};
	color: ${props =>
		props.isCopied ? brandColors.pinky[300] : brandColors.pinky[500]};

	:hover {
		background: transparent;
		color: ${props =>
			props.isCopied ? brandColors.pinky[300] : brandColors.pinky[500]};
	}
	* {
		text-transform: capitalize !important;
	}
`;

const DashedWrapper = styled(FlexCenter)`
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	margin: 0 auto;
	background: white;
	width: fit-content;
`;

const ProjectLink = styled(GLink)`
	display: flex;
	align-items: center;
	text-align: left;
	justify-content: center;
	padding: 17px 24px;
	color: ${semanticColors.blueSky[700]};
	word-break: break-word;
`;

const VerticalLine = styled.div`
	border-left: 1px solid ${neutralColors.gray[400]};
	height: 16px;
`;

export default CopyLink;
