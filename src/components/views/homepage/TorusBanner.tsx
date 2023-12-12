import styled from 'styled-components';
import {
	Caption,
	IconAlertTriangleFilled16,
	IconXCircle,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { Flex } from '@/components/styled-components/Flex';
import StorageLabel from '@/lib/localStorage';

const TorusBanner = () => {
	const { formatMessage } = useIntl();
	const [isViewed, setIsViewed] = useState(false);
	const handleClose = () => {
		localStorage.setItem(StorageLabel.TORUS_BANNER_VIEWED, 'true');
		setIsViewed(true);
	};
	if (isViewed) return null;
	return (
		<Wrapper>
			<Left>
				<IconAlertTriangleFilled16 color={semanticColors.golden[700]} />
				<div>
					<Caption medium>
						{formatMessage({ id: 'label.torus_banner_title' })}
					</Caption>
					<Caption>
						{formatMessage({ id: 'label.torus_banner_text_1' })}
						<ExternalLink href={links.Torus_MM_DOCS}>
							<Underline>
								{formatMessage({
									id: 'label.torus_banner_text_2',
								})}
							</Underline>
						</ExternalLink>
					</Caption>
				</div>
			</Left>
			<Right onClick={handleClose}>
				<IconXCircle />
			</Right>
		</Wrapper>
	);
};

const Underline = styled.span`
	text-decoration: underline;
`;

const Right = styled(Flex)`
	cursor: pointer;
`;

const Left = styled(Flex)`
	gap: 16px;
	> *:first-child {
		margin-top: 3px;
		flex-shrink: 0;
	}
`;

const Wrapper = styled.div`
	max-width: 1068px;
	width: 100%;
	z-index: 99;
	position: fixed;
	top: 95px;
	left: 50%;
	transform: translateX(-50%);
	padding: 16px;
	background: ${semanticColors.golden[200]};
	color: ${semanticColors.golden[700]};
	border-radius: 8px;
	border: 1px solid ${semanticColors.golden[700]};
	display: flex;
	justify-content: space-between;
	gap: 20px;
`;

export default TorusBanner;
