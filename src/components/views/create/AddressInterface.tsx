import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	B,
	Button,
	GLink,
	IconArrowRight16,
	IconTrash24,
	P,
	neutralColors,
} from '@giveth/ui-design-system';
import { EInputs } from '@/components/views/create/CreateProject';
import NetworkLogo from '@/components/NetworkLogo';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { chainNameById } from '@/lib/network';
import config from '@/configuration';
import ToggleSwitch from '@/components/ToggleSwitch';

interface IAddressInterfaceProps {
	networkId: number;
	onButtonClick?: () => void;
}

const AddressInterface = ({
	networkId,
	onButtonClick,
}: IAddressInterfaceProps) => {
	const { formState, setValue, watch } = useFormContext();
	const { formatMessage } = useIntl();

	const { errors } = formState;
	const inputName = EInputs.addresses;
	const alloProtocolRegistry = watch(EInputs.alloProtocolRegistry) as boolean;

	const value = watch(inputName);

	const hasAddress = !!value[networkId] && !errors[inputName]?.message;
	const isOptimism = networkId === config.OPTIMISM_NETWORK_NUMBER;
	return (
		<Container>
			<TopContainer>
				<Flex justifyContent='space-between'>
					<Flex gap='8px'>
						<ChainIconShadow>
							<NetworkLogo chainId={networkId} logoSize={24} />
						</ChainIconShadow>
						{formatMessage(
							{ id: 'label.chain_address' },
							{
								chainName: chainNameById(networkId),
							},
						)}
					</Flex>
					<Button
						buttonType='texty-secondary'
						label={hasAddress ? 'Edit Address' : 'Add Address'}
						icon={<IconArrowRight16 />}
						onClick={onButtonClick}
					/>
				</Flex>
			</TopContainer>
			<MiddleContainer>
				{hasAddress && (
					<GLink>
						{formatMessage(
							{
								id: 'label.receiving_address_on',
							},
							{
								chainName: chainNameById(networkId),
							},
						)}
					</GLink>
				)}
				<Flex
					justifyContent='space-between'
					alignItems='center'
					gap='8px'
				>
					<AddressContainer hasAddress={hasAddress}>
						{hasAddress
							? value[networkId]
							: 'No address added yet!'}
					</AddressContainer>
					{hasAddress && (
						<IconContainer
							onClick={() => {
								const newValue = { ...value };
								delete newValue[networkId];
								setValue(inputName, newValue);
							}}
						>
							<IconTrash24 />
						</IconContainer>
					)}
				</Flex>
				{isOptimism && (
					<AlloProtocolContainer>
						<Flex>
							<div>
								<B>
									Set up Profile on the Allo Protocol Registry
								</B>
								<P>
									Your project will be included in a shared
									registry of public goods projects with
									Gitcoin and others. You will also set up
									your project to receive recurring donations.
								</P>
							</div>
							<ToggleSwitch
								isOn={alloProtocolRegistry}
								toggleOnOff={() =>
									setValue(
										EInputs.alloProtocolRegistry,
										!alloProtocolRegistry,
									)
								}
								caption=''
							/>
						</Flex>
					</AlloProtocolContainer>
				)}
			</MiddleContainer>
		</Container>
	);
};

const Container = styled.div`
	margin-top: 25px;
	background: ${neutralColors.gray[100]};
	border-radius: 12px;
	padding: 16px;
`;

const ChainIconShadow = styled.div`
	height: 24px;
	width: fit-content;
	border-radius: 50%;
	box-shadow: ${Shadow.Giv[400]};
`;

const TopContainer = styled.div`
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const MiddleContainer = styled.div`
	padding: 24px 0;
`;

const AddressContainer = styled.div<{ hasAddress: boolean }>`
	width: 100%;
	border: 2px solid ${neutralColors.gray[300]};
	background-color: ${props =>
		props.hasAddress ? neutralColors.gray[100] : neutralColors.gray[300]};
	border-radius: 8px;
	color: ${props =>
		props.hasAddress ? neutralColors.gray[900] : neutralColors.gray[500]};
	padding: 16px;
	overflow-x: auto;
`;

const IconContainer = styled(FlexCenter)`
	height: 50px;
	width: 50px;
	border-radius: 50%;
	cursor: pointer;
	transition: background-color 0.2s ease-in-out;
	:hover {
		background-color: ${neutralColors.gray[300]};
	}
`;

const AlloProtocolContainer = styled.div`
	margin-top: 24px;
`;

export default AddressInterface;
