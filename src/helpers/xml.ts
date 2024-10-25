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
 * This ensures that the string can be safely included in an XML document as content or attribute values,
 * preventing issues where these characters could interfere with the XML structure.
 *
 * @param {string} unsafe - The input string that may contain unsafe XML characters.
 * @returns {string} - The escaped string, safe for inclusion in XML.
 */
export function escapeXml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;') // Escape ampersand
		.replace(/</g, '&lt;') // Escape less-than
		.replace(/>/g, '&gt;') // Escape greater-than
		.replace(/"/g, '&quot;') // Escape double quote
		.replace(/'/g, '&apos;'); // Escape single quote
}
