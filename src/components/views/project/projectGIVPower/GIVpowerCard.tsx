import {
	B,
	Caption,
	IconHelpFilled16,
	IconInfoOutline16,
	IconRocketInSpace24,
	Lead,
	P,
	Subline,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { CurrentRank } from '@/components/GIVpowerRank';
import { useProjectContext } from '@/context/project.context';
import { NextRank } from '@/components/GIVpowerRank';
import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { getNowUnixMS } from '@/helpers/time';
import { smallFormatDate } from '@/lib/helpers';

export const GIVpowerCard = () => {
	const [roundEndTime, setRoundEndTime] = useState(new Date());
	const { formatMessage, locale } = useIntl();
	const { givTokenDistroHelper, isLoaded } = useGIVTokenDistroHelper();
	const { projectData } = useProjectContext();
	const { projectPower, projectFuturePower } = projectData!;

	useEffect(() => {
		if (
			givTokenDistroHelper &&
			isLoaded &&
			givTokenDistroHelper.startTime.getTime() !== 0
		) {
			const now = getNowUnixMS();
			const ROUND_20_OFFSET = 4; // At round 20 we changed the rounds from Fridays to Tuesdays
			const startTime = new Date(givTokenDistroHelper.startTime);
			startTime.setDate(startTime.getDate() + ROUND_20_OFFSET);
			const deltaT = now - startTime.getTime();
			const TwoWeek = 1_209_600_000;
			const _round = Math.floor(deltaT / TwoWeek) + 1;
			const _roundEndTime = new Date(startTime);
			_roundEndTime.setDate(startTime.getDate() + _round * 14);
			_roundEndTime.setHours(startTime.getHours());
			_roundEndTime.setMinutes(startTime.getMinutes());
			setRoundEndTime(_roundEndTime);
		}
	}, [givTokenDistroHelper, isLoaded]);

	return (
		<GIVpowerCardWrapper>
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
			<CurrentRankSection>
				<Lead>{formatMessage({ id: 'label.current_rank' })}</Lead>
				<CurrentRank projectPower={projectPower} />
				<Flex gap='8px'>
					<IconInfoOutline16 />
					<div>
						<Caption>
							{formatMessage({
								id: 'label.the_rank_will_update_at_the_start',
							})}
							<b>
								{' '}
								{formatMessage({
									id: 'label.next_givbacks_round',
								})}
							</b>
							.
						</Caption>
						<NextRoundDate>
							{formatMessage({
								id: 'label.the_rank_will_be_updated_on',
							})}{' '}
							<b>
								{isLoaded
									? smallFormatDate(roundEndTime, locale)
									: '--'}
							</b>
							.
						</NextRoundDate>
					</div>
				</Flex>
			</CurrentRankSection>
			<NextRankSection>
				<Flex alignItems='center' justifyContent='space-between'>
					<P>
						{formatMessage({
							id: 'label.projected_rank',
						})}
					</P>
					<NextRank
						projectPower={projectPower}
						projectFuturePower={projectFuturePower}
					/>
				</Flex>
				<Separator />
				<Flex gap='8px'>
					<IconInfoOutline16 />
					<div>
						<Caption>
							{formatMessage({
								id: 'label.expected_rank_for_next_round',
							})}{' '}
							<b>
								{formatMessage({
									id: 'label.current_givpower',
								})}
							</b>
							.
						</Caption>
					</div>
				</Flex>
			</NextRankSection>
			<Separator />
			<Desc>
				{formatMessage({
					id: 'label.boost_this_project_with_givpower',
				})}
			</Desc>
		</GIVpowerCardWrapper>
	);
};

const GIVpowerCardWrapper = styled.div`
	padding: 24px;
	background: ${neutralColors.gray[100]};
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 16px;
`;

const CurrentRankSection = styled.div`
	margin: 32px 0 40px;
`;

const NextRankSection = styled.div`
	padding: 16px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 16px;
	margin-bottom: 40px;
`;

const Separator = styled.div`
	margin: 16px 0;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const Desc = styled(B)`
	text-align: center;
`;

const BoostTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	${mediaQueries.tablet} {
		width: 260px;
	}
`;

const NextRoundDate = styled(Subline)`
	margin-top: 8px;
	padding: 4px;
	text-align: center;
	background: ${neutralColors.gray[400]};
	border-radius: 4px;
`;
