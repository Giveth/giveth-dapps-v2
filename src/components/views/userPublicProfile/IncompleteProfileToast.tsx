import {
	brandColors,
	Button,
	Caption,
	IconAlertTriangle,
	IconX,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import useModal from '@/context/ModalProvider';

interface IIncompleteToast {
	close: () => void;
}

const IncompleteProfileToast = ({ close }: IIncompleteToast) => {
	const {
		actions: { showCompleteProfile },
	} = useModal();

	return (
		<IncompleteToast>
			<IncompleteProfile>
				<IconAlertTriangle size={16} color={brandColors.mustard[700]} />
				<div>
					<Caption>Your profile is incomplete</Caption>
					<Caption>
						You can’t create project unless you complete your
						profile.
					</Caption>
				</div>
			</IncompleteProfile>
			<LetsDoIt>
				<Btn
					size='small'
					label="LET'S DO IT"
					buttonType='texty'
					onClick={showCompleteProfile}
				/>
				<div onClick={close}>
					<IconX size={16} color={brandColors.mustard[700]} />
				</div>
			</LetsDoIt>
		</IncompleteToast>
	);
};

const IncompleteToast = styled.div`
	width: 100%;
	max-width: 1214px;
	position: absolute;
	top: 90px;
	left: 0;
	right: 0;
	margin: 0 auto;
	background-color: ${brandColors.mustard[200]};
	border: 1px solid ${brandColors.mustard[700]};
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
`;

const IncompleteProfile = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 17px;
	align-items: flex-start;
	div {
		display: flex;
		flex-direction: column;
		color: ${brandColors.mustard[700]};
		padding-left: 8px;
		margin-top: -2px;
	}
	div:first-child {
		font-weight: bold;
	}
`;

const LetsDoIt = styled.div`
	display: flex;
	align-items: flex-start;
	padding-right: 16px;
	margin: 7px 0 0 0;
	button {
		border: none;
		font-weight: bold;
		color: ${brandColors.mustard[700]};
		:hover {
			border: none;
			background: transparent;
			color: ${brandColors.mustard[800]};
		}
	}
	> :last-child {
		cursor: pointer;
		margin: 7px 0 0 0;
	}
`;

const Btn = styled(Button)`
	background-color: ${props =>
		props.buttonType === 'secondary' && 'transparent'};
	color: ${props =>
		props.buttonType === 'secondary' && brandColors.pinky[500]};
	border: 2px solid
		${props => props.buttonType === 'secondary' && brandColors.pinky[500]};
	:hover {
		background-color: ${props =>
			props.buttonType === 'secondary' && 'transparent'};
		border: 2px solid
			${props =>
				props.buttonType === 'secondary' && brandColors.pinky[700]};
		color: ${props =>
			props.buttonType === 'secondary' && brandColors.pinky[700]};
	}
`;

export default IncompleteProfileToast;
