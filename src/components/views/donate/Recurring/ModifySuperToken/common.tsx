export enum EModifySuperTokenSteps {
	MODIFY,
	APPROVE,
	APPROVING,
	DEPOSIT,
	DEPOSITING,
	WITHDRAW,
	WITHDRAWING,
	DEPOSIT_CONFIRMED,
	WITHDRAW_CONFIRMED,
}

export const actionButtonLabel = {
	[EModifySuperTokenSteps.MODIFY]: 'label.confirm',
	[EModifySuperTokenSteps.APPROVE]: 'label.approve',
	[EModifySuperTokenSteps.APPROVING]: 'label.approve',
	[EModifySuperTokenSteps.DEPOSIT]: 'label.deposit',
	[EModifySuperTokenSteps.DEPOSITING]: 'label.deposit',
	[EModifySuperTokenSteps.WITHDRAW]: 'label.withdraw',
	[EModifySuperTokenSteps.WITHDRAWING]: 'label.withdraw',
	[EModifySuperTokenSteps.DEPOSIT_CONFIRMED]: 'label.done',
	[EModifySuperTokenSteps.WITHDRAW_CONFIRMED]: 'label.done',
};
