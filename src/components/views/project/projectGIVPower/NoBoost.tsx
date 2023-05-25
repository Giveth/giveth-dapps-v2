import styled from 'styled-components';
import { QuoteText, IconRocketInSpace24 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

const NoBoost = ({ isAdmin }: { isAdmin: boolean }) => {
	const { formatMessage } = useIntl();

	return (
		<Wrapper size='small'>
			{isAdmin ? (
				<div>
					{formatMessage({
						id: 'label.your_project_hasnt_received_any_boosts_yet',
					})}
					<br />
					{formatMessage({
						id: 'label.share_this_project_on_social_media_and_ask_friends_for_a_boost',
					})}
				</div>
			) : (
				<div>
					{formatMessage({
						id: 'label.this_project_doesnt_have_any_givpower_behind_it',
					})}
					<IconRocketInSpace24></IconRocketInSpace24>
				</div>
			)}
		</Wrapper>
	);
};

const Wrapper = styled(QuoteText)`
	margin-top: 100px;
	margin-bottom: 500px;
	text-align: center;
`;

export default NoBoost;
