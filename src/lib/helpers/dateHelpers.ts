/**
 * Formats an ISO date string to a localized, readable format
 * @param isoDate - ISO date string (e.g., "2025-08-12T04:00:00.000Z")
 * @param locale - Locale string (e.g., "en-US", "es-ES", "ca-ES")
 * @param showYear - Whether to include the year in the formatted date
 * @returns Formatted date string (e.g., "April 1, 2025" or "April 1")
 */
export const formatReadableDate = (
	isoDate: string,
	locale: string = 'en-US',
	showYear: boolean = true,
): string => {
	try {
		// Parse using Date but only for extracting UTC values
		const date = new Date(isoDate);
		if (isNaN(date.getTime())) {
			return isoDate;
		}

		const year = date.getUTCFullYear();
		const month = date.getUTCMonth(); // 0–11
		const day = date.getUTCDate();

		const options: Intl.DateTimeFormatOptions = {
			month: 'long',
			day: 'numeric',
			...(showYear && { year: 'numeric' }),
		};

		// Format using UTC parts instead of local conversion
		return new Intl.DateTimeFormat(locale, options).format(
			new Date(Date.UTC(year, month, day)),
		);
	} catch (error) {
		console.error('Error formatting date:', error);
		return isoDate;
	}
};

/**
 * Auto-detects whether to show year based on current year vs date year
 * @param isoDate - ISO date string
 * @param locale - Locale string
 * @param currentYear - Optional current year (defaults to current year)
 * @returns Formatted date string with year only if different from current year
 */
export const formatSmartDate = (
	isoDate: string,
	locale: string = 'en-US',
	currentYear?: number,
): string => {
	const date = new Date(isoDate);
	const dateYear = date.getFullYear();
	const thisYear = currentYear ?? new Date().getFullYear();

	// Show year only if it's different from current year
	const showYear = dateYear !== thisYear;

	return formatReadableDate(isoDate, locale, showYear);
};
