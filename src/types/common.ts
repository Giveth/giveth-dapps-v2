export interface IModal {
	setShowModal: (showModal: boolean) => void;
	type?: string;
}

export interface IFiatConfirmationModal extends IModal {
	continueProcess?: () => void;
}
