import {
	brandColors,
	Button,
	Caption,
	IconAlertTriangleFilled16,
	IconX,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { mediaQueries } from '@/lib/constants/constants';
import { useAppDispatch } from '@/features/hooks';
import { setShowCompleteProfile } from '@/features/modal/modal.slice';

interface IIncompleteToast {
	close: () => void;
}

const IncompleteProfileToast = ({ close }: IIncompleteToast) => {
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();

	return (
		<IncompleteToast>
			<CloseButton onClick={close}>
				<IconX size={16} color={brandColors.mustard[700]} />
			</CloseButton>
			<IncompleteProfile>
				<IconAlertTriangleFilled16 color={brandColors.mustard[700]} />
				<div>
					<Caption medium>
						{formatMessage({
							id: 'label.your_profile_is_incomplete',
						})}
					</Caption>
					<Caption>
						{formatMessage({
							id: 'label.you_cant_create_a_project_unless',
						})}
					</Caption>
				</div>
			</IncompleteProfile>
			<LetsDoIt
				size='small'
				label={formatMessage({ id: 'label.lets_do_it' })}
				buttonType='texty'
				onClick={() => dispatch(setShowCompleteProfile(true))}
			/>
		</IncompleteToast>
	);
};

const CloseButton = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	padding: 0.8rem;
	cursor: pointer;
`;

const IncompleteToast = styled.div`
	width: 100%;
	position: relative;
	background-color: ${brandColors.mustard[200]};
	border: 1px solid ${brandColors.mustard[800]};
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;

	${mediaQueries.mobileL} {
		flex-direction: row;
		align-items: unset;
	}
`;

const IncompleteProfile = styled.div`
	display: flex;
	padding: 17px;
	div {
		color: ${brandColors.mustard[700]};
		padding-left: 8px;
		margin-top: -2px;
	}
	> :first-child {
		flex-shrink: 0;
	}
`;

const LetsDoIt = styled(Button)`
	display: flex;
	align-items: flex-start;
	margin: 5px 10px 10px;
	font-weight: bold;
	color: ${brandColors.mustard[700]};
	:hover {
		background: transparent;
		color: ${brandColors.mustard[800]};
	}
`;

export default IncompleteProfileToast;
