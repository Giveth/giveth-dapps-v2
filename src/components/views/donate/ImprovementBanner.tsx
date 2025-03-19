import { FC, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import {
	H6,
	P,
	brandColors,
	neutralColors,
	Flex,
} from '@giveth/ui-design-system';

interface IImprovementBanner {
	onClose?: () => void;
}

const ImprovementBanner: FC<IImprovementBanner> = () => {
	const { formatMessage } = useIntl();
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(prev => !prev);
	};

	console.log('isExpanded', isExpanded);

	return (
		<>
			<BannerWrapper isExpanded={isExpanded}>
				<BannerHeader onClick={toggleExpand}>
					<ContentContainer>
						<TitleContainer>
							<IconContainer>
								<Image
									src='/images/icons/help-improve.svg'
									alt='help-improve'
									width={24}
									height={24}
								/>
							</IconContainer>
							<Title weight={700}>
								{formatMessage({
									id: 'help_improve',
								})}
							</Title>
						</TitleContainer>
						<Description>
							{formatMessage({
								id: 'help_improve_description',
							})}
						</Description>
					</ContentContainer>
					<ToggleIcon>
						{isExpanded ? (
							<Image
								src='/images/icons/show-hide-minus.svg'
								alt='show-hide-minus'
								width={40}
								height={40}
							/>
						) : (
							<Image
								src='/images/icons/show-hide-plus.svg'
								alt='show-hide-plus'
								width={40}
								height={40}
							/>
						)}
					</ToggleIcon>
				</BannerHeader>

				<ExpandableContent isExpanded={isExpanded}>
					<iframe
						src='https://giveth.typeform.com/donorsurvey2025'
						width='100%'
						height='795px'
						frameBorder='0'
					/>
				</ExpandableContent>
			</BannerWrapper>
			<Overlay isExpanded={isExpanded} onClick={toggleExpand} />
		</>
	);
};

const BannerWrapper = styled.div<{ isExpanded: boolean }>`
	overflow: hidden;
	width: 100%;
	margin: 40px 0 0 0;
	background: ${neutralColors.gray[100]};
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
	border-bottom-left-radius: ${props => (props.isExpanded ? '0' : '16px')};
	border-bottom-right-radius: ${props => (props.isExpanded ? '0' : '16px')};
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease-in-out;
	z-index: 10020;
`;

const BannerHeader = styled(Flex)`
	display: flex;
	align-items: center;
	padding: 24px;
	cursor: pointer;
	transition: background 0.3s ease;

	&:hover {
		background: ${neutralColors.gray[200]};
	}
`;

const IconContainer = styled(Flex)`
	padding-top: 4px;
	color: ${brandColors.pinky[500]};
	margin-right: 6px;
`;

const ContentContainer = styled(Flex)`
	flex-direction: column;
	gap: 8px;
	flex: 1;
`;

const TitleContainer = styled(Flex)`
	flex-direction: row;
	align-items: center;
	gap: 0;
	margin-bottom: 15px;
`;

const Title = styled(H6)`
	font-size: 24px;
	font-weight: 700;
	line-height: 32px;
	color: ${brandColors.deep[900]};
`;

const Description = styled(P)`
	font-size: 16px;
	font-weight: 400;
	line-height: 24px;
	text-align: left;
	color: ${brandColors.deep[800]};
`;

const ToggleIcon = styled.div`
	font-size: 18px;
	color: ${brandColors.deep[700]};
`;

const ExpandableContent = styled.div<{ isExpanded: boolean }>`
	width: 100%;
	position: ${props => (props.isExpanded ? 'absolute' : 'static')};
	max-height: ${props => (props.isExpanded ? '840px' : '0')};
	overflow: hidden;
	transition: all 0.3s ease-in-out;
	background: white;
	padding: ${props => (props.isExpanded ? '0 24px 24px 24px' : '0')};
	z-index: 10020;
	border-bottom-left-radius: 16px;
	border-bottom-right-radius: 16px;
`;

const Overlay = styled.div<{ isExpanded: boolean }>`
	position: ${props => (props.isExpanded ? 'fixed' : 'none')};
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.4);
	z-index: 10000;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default ImprovementBanner;
