export interface IModal {
	setShowModal: (showModal: boolean) => void;
	continueProcess?: () => void;
	type?: string;
}
