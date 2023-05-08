import {
	IconRocketInSpace24,
	IconHelpFilled16,
	Subline,
	neutralColors,
	Button,
	IconRocketInSpace16,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useState } from 'react';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Flex } from '@/components/styled-components/Flex';
import { CurrentRank, NextRank } from '@/components/GIVpowerRank';
import { useProjectContext } from '@/context/project.context';
import { useAppSelector } from '@/features/hooks';
import { useModalCallback, EModalEvents } from '@/hooks/useModalCallback';
import { isSSRMode } from '@/lib/helpers';
import BoostModal from '@/components/modals/Boost/BoostModal';

export const GIVPowerSection = () => {
	const [showBoost, setShowBoost] = useState(false);

	const { formatMessage } = useIntl();
	const { projectData } = useProjectContext();
	const { projectPower, projectFuturePower } = projectData!;

	const { isSignedIn, isEnabled } = useAppSelector(state => state.user);

	const showBoostModal = () => {
		setShowBoost(true);
	};

	const { modalCallback: signInThenBoost } = useModalCallback(showBoostModal);

	const { modalCallback: connectThenSign } = useModalCallback(
		signInThenBoost,
		EModalEvents.CONNECTED,
	);

	const handleBoostClick = () => {
		if (isSSRMode) return;
		if (!isEnabled) {
			connectThenSign();
		} else if (!isSignedIn) {
			signInThenBoost();
		} else {
			showBoostModal();
		}
	};

	return (
		<GIVPowerSectionWrapper
			flexDirection='column'
			justifyContent='space-between'
		>
			<Flex gap='8px' alignItems='center'>
				<IconRocketInSpace24 />
				<Subline>
					{formatMessage({
						id: 'label.givpower_rank',
					})}
				</Subline>
				<IconWithTooltip
					icon={<IconHelpFilled16 />}
					direction={'bottom'}
				>
					<BoostTooltip>
						{formatMessage({
							id: 'label.boost_this_project_with_givpower_to_improve_its_rank',
						})}
					</BoostTooltip>
				</IconWithTooltip>
			</Flex>
			{projectPower?.totalPower === 0 ? (
				<NoBoost>
					{formatMessage({
						id: 'label.be_the_first_booster',
					})}
				</NoBoost>
			) : (
				<div>
					<StyledCurrenRank projectPower={projectPower} />
					<NextRankRow
						justifyContent='space-between'
						alignItems='center'
					>
						<Subline>
							{formatMessage({
								id: 'label.projected_rank',
							})}
						</Subline>
						<NextRank
							projectPower={projectPower}
							projectFuturePower={projectFuturePower}
						/>
					</NextRankRow>
				</div>
			)}
			<BoostButton
				label={formatMessage({
					id: 'label.boost',
				})}
				buttonType='texty-gray'
				icon={<IconRocketInSpace16 />}
				onClick={handleBoostClick}
			/>
			{showBoost && projectData?.id && (
				<BoostModal
					projectId={projectData.id}
					setShowModal={setShowBoost}
				/>
			)}
		</GIVPowerSectionWrapper>
	);
};

const GIVPowerSectionWrapper = styled(Flex)`
	border-top: 1px solid ${neutralColors.gray[500]};
	padding-top: 16px;
	height: 210px;
`;

const NoBoost = styled.div``;

const StyledCurrenRank = styled(CurrentRank)`
	margin: 8px 0;
`;

const NextRankRow = styled(Flex)`
	margin-bottom: 32px;
`;

const BoostButton = styled(Button)`
	flex-direction: row-reverse;
	gap: 8px;
	box-shadow: 0px 3px 20px rgba(83, 38, 236, 0.13);
	width: 100%;
	padding: 16px;
	color: ${neutralColors.gray[900]};
`;

const BoostTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	${mediaQueries.tablet} {
		width: 260px;
	}
`;
