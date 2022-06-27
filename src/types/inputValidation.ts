export enum EInputValidation {
	NORMAL,
	WARNING,
	ERROR,
	SUCCESS,
}

export interface IInputValidation {
	validation: EInputValidation;
}
