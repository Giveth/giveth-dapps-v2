import styled from 'styled-components';
import {
	Caption,
	IconAlertTriangleFilled16,
	IconXCircle,
	mediaQueries,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { zIndex } from '@/lib/constants/constants';
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
							{formatMessage({
								id: 'label.torus_banner_text_2',
							})}
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
	max-width: 1268px;
	margin: 10px 10px 0;
	z-index: ${zIndex.FIXED};
	position: sticky;
	top: 10px;
	padding: 16px;
	background: ${semanticColors.golden[200]};
	color: ${semanticColors.golden[700]};
	border-radius: 8px;
	border: 1px solid ${semanticColors.golden[700]};
	display: flex;
	justify-content: space-between;
	gap: 20px;
	${mediaQueries.laptopL} {
		margin: 10px auto 0;
	}
`;

export default TorusBanner;
