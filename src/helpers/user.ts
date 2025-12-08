import StorageLabel from '@/lib/localStorage';
import { getLocalStorageData } from './localstorage';
import { IUser } from '@/apollo/types/types';

export function getTokens() {
	return getLocalStorageData(StorageLabel.TOKENS);
}

export function getUserName(user?: IUser, short = true) {
	if (!user) return 'Unknown';
	return (
		user.name ||
		`${user.firstName || ''} ${user.lastName || ''}`.trim() ||
		(short
			? user?.walletAddress?.substring(0, 8) + '...'
			: user?.walletAddress)
	);
}

/**
 * Cleans Twitter/X username from various input formats
 * @param input - User input that may contain URL, @mention, or plain username
 * @returns Cleaned username without URL, @ symbol, or empty string if invalid
 *
 * @example
 * cleanTwitterUsername('https://x.com/username') // 'username'
 * cleanTwitterUsername('https://twitter.com/username') // 'username'
 * cleanTwitterUsername('@username') // 'username'
 * cleanTwitterUsername('username') // 'username'
 * cleanTwitterUsername('') // ''
 */
export function cleanTwitterUsername(input: string | null | undefined): string {
	if (!input) return '';

	// Trim whitespace
	let cleaned = input.trim();

	// Remove URL patterns (x.com, twitter.com)
	// Matches: https://x.com/username, http://twitter.com/username, etc.
	const urlPatterns = [
		/^https?:\/\/(www\.)?(x\.com|twitter\.com)\//i,
		/^(www\.)?(x\.com|twitter\.com)\//i,
	];

	for (const pattern of urlPatterns) {
		cleaned = cleaned.replace(pattern, '');
	}

	// Remove @ symbol from the beginning
	cleaned = cleaned.replace(/^@+/, '');

	// Remove trailing slashes and query parameters
	cleaned = cleaned.split('/')[0];
	cleaned = cleaned.split('?')[0];
	cleaned = cleaned.split('#')[0];

	// Trim again in case there were spaces after URL
	cleaned = cleaned.trim();

	// Validate: Twitter usernames are alphanumeric + underscore, 1-15 chars
	// Return empty string if it doesn't match valid Twitter username format
	if (cleaned && !/^[a-zA-Z0-9_]{1,15}$/.test(cleaned)) {
		console.warn(`Invalid Twitter username format: ${cleaned}`);
		// Still return it but warn - let backend validate if needed
	}

	return cleaned;
}

/**
 * Cleans Telegram username from various input formats
 * @param input - User input that may contain URL, @mention, or plain username
 * @returns Cleaned username without URL, @ symbol, or empty string if invalid
 *
 * @example
 * cleanTelegramUsername('https://t.me/username') // 'username'
 * cleanTelegramUsername('https://telegram.me/username') // 'username'
 * cleanTelegramUsername('@username') // 'username'
 * cleanTelegramUsername('username') // 'username'
 * cleanTelegramUsername('') // ''
 */
export function cleanTelegramUsername(
	input: string | null | undefined,
): string {
	if (!input) return '';

	// Trim whitespace
	let cleaned = input.trim();

	// Remove URL patterns (t.me, telegram.me, telegram.org)
	// Matches: https://t.me/username, http://telegram.me/username, etc.
	const urlPatterns = [
		/^https?:\/\/(www\.)?(t\.me|telegram\.me|telegram\.org)\//i,
		/^(www\.)?(t\.me|telegram\.me|telegram\.org)\//i,
	];

	for (const pattern of urlPatterns) {
		cleaned = cleaned.replace(pattern, '');
	}

	// Remove @ symbol from the beginning
	cleaned = cleaned.replace(/^@+/, '');

	// Remove trailing slashes and query parameters
	cleaned = cleaned.split('/')[0];
	cleaned = cleaned.split('?')[0];
	cleaned = cleaned.split('#')[0];

	// Trim again in case there were spaces after URL
	cleaned = cleaned.trim();

	// Validate: Telegram usernames are alphanumeric + underscore, 5-32 chars
	// Return empty string if it doesn't match valid Telegram username format
	if (cleaned && !/^[a-zA-Z0-9_]{5,32}$/.test(cleaned)) {
		console.warn(`Invalid Telegram username format: ${cleaned}`);
		// Still return it but warn - let backend validate if needed
	}

	return cleaned;
}
