import { neutralColors } from '@giveth/ui-design-system';
import { createGlobalStyle } from 'styled-components';
import { ETheme } from '@/features/general/general.slice';
import { useAppSelector } from '@/features/hooks';

const GeneralController = () => {
	const theme = useAppSelector(state => state.general.theme);
	return <GlobalStyle theme={theme} />;
};

const GlobalStyle = createGlobalStyle<{ theme: ETheme }>`
  body {
    background-color: ${props =>
		props.theme === ETheme.Dark ? '#090446' : neutralColors.gray[200]};
	color: ${props => (props.theme === ETheme.Dark ? 'white' : '#212529')};
  }
`;

export default GeneralController;
