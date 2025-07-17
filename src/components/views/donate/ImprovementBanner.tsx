import { FC, useState, useEffect } from 'react';
import { Widget } from '@typeform/embed-react';
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
	isCauseDonation?: boolean;
}

const ImprovementBanner: FC<IImprovementBanner> = ({ isCauseDonation }) => {
	const { formatMessage } = useIntl();
	const [isExpanded, setIsExpanded] = useState(false);
	const [shouldShow, setShouldShow] = useState(false);

	// Check if user has already completed the form
	// If yes, show the form after 60 days
	useEffect(() => {
		const savedDate = localStorage.getItem('improvement_survey_date');
		if (!savedDate) {
			setShouldShow(true);
			return;
		}

		const savedTime = new Date(savedDate).getTime();
		const now = new Date().getTime();
		const diffInDays = (now - savedTime) / (1000 * 60 * 60 * 24);

		if (diffInDays > 60) {
			setShouldShow(true);
		} else {
			setShouldShow(false);
		}
	}, []);

	const toggleExpand = () => {
		setIsExpanded(prev => !prev);
	};

	const handleFormSubmit = () => {
		const today = new Date().toISOString();
		localStorage.setItem('improvement_survey_date', today);
		setShouldShow(false);
		setIsExpanded(false);
	};

	const handleFormClose = () => {
		setIsExpanded(false);
	};
	if (!shouldShow) return null;

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
					{isCauseDonation ? (
						<Widget
							id='e68DoSqk'
							style={{ width: '100%', height: '750px' }}
							className='my-form'
							onSubmit={handleFormSubmit}
							onClose={handleFormClose}
						/>
					) : (
						<Widget
							id='pujGt0tC'
							style={{ width: '100%', height: '750px' }}
							className='my-form'
							onSubmit={handleFormSubmit}
							onClose={handleFormClose}
						/>
					)}
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
	z-index: 20;
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
	position: relative;
	max-height: ${props => (props.isExpanded ? '840px' : '0')};
	overflow: hidden;
	transition: all 0.3s ease-in-out;
	background: white;
	padding: ${props => (props.isExpanded ? '0 24px 24px 24px' : '0')};
	z-index: 10;
	border-bottom-left-radius: 16px;
	border-bottom-right-radius: 16px;

	@media (max-width: 768px) {
		max-height: ${props => (props.isExpanded ? '100vh' : '0')};
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}
`;

const Overlay = styled.div<{ isExpanded: boolean }>`
	position: ${props => (props.isExpanded ? 'fixed' : 'none')};
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.4);
	z-index: 9;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default ImprovementBanner;
