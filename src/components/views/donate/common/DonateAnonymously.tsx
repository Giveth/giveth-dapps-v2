import React, { FC } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import ToggleSwitch, {
	EToggleSwitchSizes,
	EToggleSwitchThemes,
} from '@/components/ToggleSwitch';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { ISelectTokenWithBalance } from '@/context/donate.context';

interface IDonateAnonymously {
	anonymous: boolean;
	setAnonymous: (anonymous: boolean) => void;
	selectedToken?: IProjectAcceptedToken | ISelectTokenWithBalance;
}

const DonateAnonymously: FC<IDonateAnonymously> = props => {
	const { anonymous, setAnonymous, selectedToken } = props;
	const { formatMessage } = useIntl();
	const { isConnected } = useGeneralWallet();
	return (
		<CheckBoxContainer>
			<ToggleSwitch
				isOn={anonymous}
				toggleOnOff={setAnonymous}
				size={EToggleSwitchSizes.SMALL}
				theme={EToggleSwitchThemes.PURPLE_GRAY}
				label={formatMessage({
					id: 'label.make_it_anonymous',
				})}
				disabled={!isConnected || !selectedToken}
				style={{ marginLeft: '-14px' }}
			/>
			<Caption disabled={!isConnected || !selectedToken}>
				{formatMessage({
					id: 'component.tooltip.donate_anonymously',
				})}
			</Caption>
		</CheckBoxContainer>
	);
};

const CheckBoxContainer = styled.div`
	margin-top: 24px;
	border-radius: 8px;
	border: 1px solid ${neutralColors.gray[300]};
	padding: 16px;
	> div:nth-child(2) {
		color: ${neutralColors.gray[900]};
		font-size: 12px;
		margin-top: 9px;
	}
`;

const Caption = styled.div<{ disabled: boolean }>`
	color: ${props =>
		props.disabled ? neutralColors.gray[600] + ' !important' : 'inherit'};
`;

export default DonateAnonymously;
