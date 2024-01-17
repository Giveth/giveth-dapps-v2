export enum EModifySuperTokenSteps {
	MODIFY,
	APPROVE,
	APPROVING,
	DEPOSIT,
	DEPOSITING,
	WITHDRAW,
	WITHDRAWING,
	SUBMITTED,
}

export const actionButtonLabel = {
	[EModifySuperTokenSteps.MODIFY]: 'label.confirm',
	[EModifySuperTokenSteps.APPROVE]: 'label.approve',
	[EModifySuperTokenSteps.APPROVING]: 'label.approve',
	[EModifySuperTokenSteps.DEPOSIT]: 'label.deposit',
	[EModifySuperTokenSteps.DEPOSITING]: 'label.deposit',
	[EModifySuperTokenSteps.WITHDRAW]: 'label.withdraw',
	[EModifySuperTokenSteps.WITHDRAWING]: 'label.withdraw',
	[EModifySuperTokenSteps.SUBMITTED]: 'label.done',
};
