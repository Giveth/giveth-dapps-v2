import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import Select, { StylesConfig } from 'react-select';
import styled from 'styled-components';
import {
	brandColors,
	Button,
	GLink,
	Lead,
	neutralColors,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import { client } from '@/apollo/apolloClient';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

import {
	DEACTIVATE_PROJECT,
	GET_STATUS_REASONS,
} from '@/apollo/gql/gqlProjects';
import QuestionBadge from '@/components/badges/QuestionBadge';
import FormProgress from '@/components/FormProgress';
import { Shadow } from '@/components/styled-components/Shadow';
import useUser from '@/context/UserProvider';
import { IModal, Modal } from './Modal';
import ArchiveIcon from '../../../public/images/icons/archive_deep.svg';
import Routes from '@/lib/constants/Routes';
import useModal from '@/context/ModalProvider';

interface ISelectObj {
	value: number;
	label: string;
}

const buttonLabels: { [key: string]: string }[] = [
	{ confirm: 'okay, do it', cancel: "nope, don't do it" },
	{ confirm: 'deactivate this project', cancel: 'cancel' },
	{ confirm: '', cancel: 'close' },
];
interface IDeactivateProjectModal extends IModal {
	projectId?: string;
	setIsActive: Dispatch<SetStateAction<boolean>>;
}

const DeactivateProjectModal = ({
	projectId,
	setIsActive,
	setShowModal,
}: IDeactivateProjectModal) => {
	const [tab, setTab] = useState<number>(0);
	const [motive, setMotive] = useState<string>('');
	const [reasons, setReasons] = useState<ISelectObj[]>([]);
	const [selectedReason, setSelectedReason] = useState<ISelectObj | any>(
		undefined,
	);
	const {
		state: { isSignedIn },
	} = useUser();

	const {
		actions: { showSignWithWallet },
	} = useModal();

	const fetchReasons = async () => {
		const { data } = await client.query({
			query: GET_STATUS_REASONS,
			fetchPolicy: 'no-cache',
		});
		const fetchedReasons = data.getStatusReasons.map((elem: any) => ({
			label: elem.description,
			value: elem.id,
		}));
		console.log(fetchedReasons);
		setReasons(fetchedReasons);
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target;
		setMotive(value);
	};

	const handleConfirmButton = async () => {
		if (!!tab && !!selectedReason) {
			if (!isSignedIn) {
				showSignWithWallet();
				return;
			}
			const { data } = await client.mutate({
				mutation: DEACTIVATE_PROJECT,
				variables: {
					projectId: Number(projectId),
					reasonId: Number(selectedReason.value),
				},
			});
			const status = data.deactivateProject;
			setIsActive(!status);
		}
		setTab(previousTab => previousTab + 1);
	};

	useEffect(() => {
		fetchReasons();
	}, [selectedReason]);

	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={
				<Image
					src={ArchiveIcon}
					alt='Archive icon'
					height={32}
					width={32}
				/>
			}
			headerTitle='Deactivating project'
			headerTitlePosition='left'
		>
			<Wrapper>
				<FormProgress progress={tab} steps={formSteps} />
				<TextWrapper>
					<DeactivatingContent show={tab === 0} />
					<WhyContent
						handleChange={handleChange}
						handleSelect={setSelectedReason}
						options={reasons}
						selectedOption={selectedReason}
						show={tab === 1}
						textInput={motive}
					/>
					<DoneContent show={tab === 2} />
				</TextWrapper>
				<GivBackNotif>
					<QuestionBadge />
					<GLink>
						{tab < 2
							? 'You can reactivate later from your projects section under your account space!'
							: 'Your project is deactivated now, you can still find it on your own projects.'}
					</GLink>
				</GivBackNotif>
				{tab < 2 && (
					<ConfirmButton
						buttonType='secondary'
						size='small'
						label={buttonLabels[tab].confirm}
						onClick={handleConfirmButton}
						disabled={tab > 0 && !!!selectedReason}
					/>
				)}
				<CancelButton
					buttonType='texty'
					size='small'
					label={buttonLabels[tab].cancel}
					onClick={() => setShowModal(false)}
				/>
			</Wrapper>
		</Modal>
	);
};

const formSteps = ['Deactivating', 'Why?', 'Done'];

const Wrapper = styled.div`
	max-width: 500px;
	padding: 0 24px;
`;

const TextWrapper = styled.div`
	text-align: left;
`;

const GivBackNotif = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
	padding: 16px;
	background: ${semanticColors.blueSky[100]};
	border-radius: 8px;
	border: 1px solid ${semanticColors.blueSky[700]};
	margin-top: 36px;
	color: ${semanticColors.blueSky[700]};
	text-align: left;
`;

const ConfirmButton = styled(Button)`
	text-transform: uppercase;
	width: 100%;
	margin-top: 12px;
`;

const CancelButton = styled(Button)`
	text-transform: uppercase;
	width: 100%;
	margin: 8px 0;

	&:hover {
		background-color: transparent;
	}
`;

interface IDeactivatingContent {
	show: boolean;
}

const DeactivatingContent = ({ show }: IDeactivatingContent) => (
	<>
		{show && (
			<>
				<Lead>Before deactivating your project, be aware that:</Lead>
				<CustomList>
					{bulletPointsText.map((text, index) => (
						<BulletPoint key={`bullet-point-${index}`}>
							<Lead>{text}</Lead>
						</BulletPoint>
					))}
				</CustomList>
			</>
		)}
	</>
);

const bulletPointsText = [
	'Your project will be unlisted from Giveth',
	'All donors will be notified about this action',
	'Your project will be accessible only via direct link and donations will be disabled',
	'If you decide to activate it later, your project will have to be reviewed again',
];

const CustomList = styled.ul`
	list-style-image: url('/images/icons/bullet_icon.svg');
	padding-inline-start: 20px;
`;

const BulletPoint = styled.li`
	margin-bottom: 12px;

	div {
		position: relative;
		left: 4px;
	}
`;

interface IWhyContent {
	handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleSelect: (e: any) => void;
	options: ISelectObj[];
	selectedOption: ISelectObj | void;
	show: boolean;
	textInput: string;
}

const WhyContent = ({
	handleChange,
	handleSelect,
	options,
	selectedOption,
	show,
	textInput,
}: IWhyContent) => (
	<>
		{show && (
			<>
				<Lead>
					Please let us know why you are deactivating this project!
				</Lead>
				<Select
					options={options}
					placeholder='Select a reason for deactivating'
					styles={selectCustomStyles}
					value={selectedOption}
					onChange={e => handleSelect(e)}
					isMobile={false}
				/>
				<AnimatePresence>
					{String(selectedOption?.value) === '5' && (
						<motion.div
							initial={{
								height: 0,
								opacity: 0,
							}}
							animate={{
								height: 'auto',
								opacity: 1,
							}}
							exit={{
								height: 0,
								opacity: 0,
							}}
							transition={{
								duration: 1,
							}}
						>
							<GLink>Or write your own reason:</GLink>
							<InputBox
								placeholder="I'm deactivating because..."
								rows={5}
								value={textInput}
								onChange={(
									e: React.ChangeEvent<HTMLTextAreaElement>,
								) => handleChange(e)}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</>
		)}
	</>
);

const selectCustomStyles: StylesConfig = {
	control: styles => ({
		...styles,
		border: 0,
		borderRadius: '8px',
		boxShadow: 'none',
		backgroundColor: neutralColors.gray[200],
		margin: '12px 0',
	}),
	dropdownIndicator: styles => ({
		...styles,
		color: neutralColors.gray[900],
	}),
	indicatorSeparator: styles => ({
		...styles,
		backgroundColor: neutralColors.gray[200],
	}),
	menu: styles => ({
		...styles,
		border: '0px',
		borderRadius: '8px',
		boxShadow: Shadow.Neutral[500],
	}),
	option: (styles, { isFocused, isSelected }) => ({
		...styles,
		width: '95%',
		height: '38px',
		margin: '4px auto',
		borderRadius: '8px',
		color: 'black',
		backgroundColor: isSelected
			? neutralColors.gray[300]
			: isFocused
			? neutralColors.gray[200]
			: neutralColors.gray[100],
	}),
	placeholder: styles => ({
		...styles,
		color: neutralColors.gray[900],
	}),
};

const InputBox = styled(motion.textarea)`
	display: block;
	width: 100%;
	resize: none;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	box-shadow: ${Shadow.Neutral[400]};
	font-family: 'Red Hat Text';
	font-size: 16px;
	padding: 8px;
	margin-top: 4px;

	::placeholder,
	::-webkit-input-placeholder {
		font-family: 'Red Hat Text';
		font-size: 16px;
		color: ${neutralColors.gray[400]};
		padding: 2px 8px;
	}
`;

interface IDonoContent {
	show: boolean;
}

const DoneContent = ({ show }: IDonoContent) => {
	const router = useRouter();
	return show ? (
		<>
			<Lead>
				Your project was successfully deactivated. Thank you for using
				Giveth.
			</Lead>
			<RedirectLink onClick={() => router.push(Routes.Projects)}>
				Go to projects
			</RedirectLink>
			<RedirectLink onClick={() => router.push(Routes.MyAccount)}>
				Back to My account
			</RedirectLink>
		</>
	) : null;
};

const RedirectLink = styled(P)`
	display: block;
	margin-top: 8px;
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export default DeactivateProjectModal;
