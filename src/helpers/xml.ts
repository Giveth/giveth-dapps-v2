/**
 * Escapes special characters in a string to make it safe for use in XML.
 *
 * This function replaces the following characters with their corresponding XML escape codes:
 * - `&` becomes `&amp;`
 * - `<` becomes `&lt;`
 * - `>` becomes `&gt;`
 * - `"` becomes `&quot;`
 * - `'` becomes `&apos;`
 *
 * Additionally, it removes or replaces invalid control characters (e.g., `U+0000`–`U+001F`, except `\t`, `\n`, and `\r`)
 * that are not allowed in XML.
 *
 * @param {string} unsafe - The input string that may contain unsafe or invalid XML characters.
 * @returns {string} - The sanitized and escaped string, safe for inclusion in XML.
 */
export function escapeXml(unsafe: string): string {
	// Remove invalid XML characters
	const sanitized = unsafe.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

	// Escape XML special characters
	return sanitized
		.replace(/&/g, '&amp;') // Escape ampersand
		.replace(/</g, '&lt;') // Escape less-than
		.replace(/>/g, '&gt;') // Escape greater-than
		.replace(/"/g, '&quot;') // Escape double quote
		.replace(/'/g, '&apos;'); // Escape single quote
}
