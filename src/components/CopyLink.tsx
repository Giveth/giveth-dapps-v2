import {
	brandColors,
	Button,
	GLink,
	neutralColors,
	semanticColors,
	IconLink,
	mediaQueries,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { FC, useState } from 'react';
import { Flex } from '@/components/styled-components/Flex';
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
				leftIcon={
					<div style={{ padding: '3px 0 0 0' }}>
						<IconLink />
					</div>
				}
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
	margin-left: 16px;
	width: 123px;
	height: 48px;
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
	${mediaQueries.tablet} {
		margin: 3px auto;
		margin-right: 16px;
	}
`;

const DashedWrapper = styled(Flex)`
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	margin: 0;
	background: white;
	padding: 16px 0;
	width: 100%;
	height: 100%;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	${mediaQueries.tablet} {
		flex-direction: row;
		align-items: center;
		padding: 0;
	}
`;

const ProjectLink = styled(GLink)`
	display: flex;
	align-items: center;
	text-align: left;
	justify-content: center;
	padding: 16px;
	color: ${semanticColors.blueSky[700]};
	word-break: break-word;

	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
`;

export default CopyLink;
