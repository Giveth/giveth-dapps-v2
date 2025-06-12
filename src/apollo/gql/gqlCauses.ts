export const CAUSE_TITLE_IS_VALID = `
	query IsValidTitleForCause($title: String!, $causeId: Float) {
		isValidTitleForCause(title: $title, causeId: $causeId)
	}
`;
