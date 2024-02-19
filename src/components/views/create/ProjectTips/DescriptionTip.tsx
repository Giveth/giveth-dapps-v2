import { P } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import { TipLine, TipListItem } from './common.styles';
import { Flex } from '@/components/styled-components/Flex';

const DescriptionTip = () => {
	const { formatMessage } = useIntl();
	return (
		<div>
			<Flex flexDirection='column' gap='16px'>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.tell_an_engaging_story_about_your_project',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.be_specific_about_your_projects_progress',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.add_links_to_your_website_portfolio_and_any',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.include_media_such_as_videos_and_photos_to_show_off_the_work',
						})}
					</P>
				</TipListItem>

				<TipLine />
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.make_sure_your_description_aligns_with_our',
						})}
					</P>
				</TipListItem>
			</Flex>
		</div>
	);
};

export default DescriptionTip;
