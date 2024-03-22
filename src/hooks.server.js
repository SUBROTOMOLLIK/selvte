import { redirect } from '@sveltejs/kit';
import Negotiator from 'negotiator';

import { i18n } from '$lib/i18n';
import { availableLanguageTags, sourceLanguageTag } from '$paraglide/runtime';

export const handle = async ({ event, resolve }) => {
	const pathSegments = event.url.pathname.split('/').filter(Boolean); // Split URL path and remove any empty segments
	const firstSegment = pathSegments[0]; // Get the first segment of the URL path, which may be a language tag

	// Check if there's a language cookie set
	const preferredLocaleCookie = event.cookies.get('language');

	// Language negotiation to find the best match for the user's browser settings
	const negotiator = new Negotiator({
		headers: {
			'accept-language': event.request.headers.get('accept-language') || '',
		},
	});
	const browserLanguage =
		negotiator.language(availableLanguageTags) || sourceLanguageTag;

	// If the first segment is a recognized language tag
	if (availableLanguageTags.includes(firstSegment)) {
		console.log('ortyhis', firstSegment, preferredLocaleCookie);
		event.cookies.set('language', firstSegment, {
			path: '/',
			httpOnly: false,
			secure: false,
		});
		// Update the language cookie to reflect the current selection
	} else if (!firstSegment) {
		console.log('this runs');
		// When visiting "/", use the preferred locale cookie if available, otherwise use the browser's language
		const redirectLanguage = preferredLocaleCookie || browserLanguage;

		// Redirect to the appropriate language-prefixed URL
		throw redirect(303, `/${redirectLanguage}/`);
	} else {
		// If the first segment is not a recognized language tag and not the root path
		const currentPath = `/${pathSegments.join('/')}`; // Reconstruct the current non-root path
		const redirectLanguage = preferredLocaleCookie || browserLanguage;
		// Check if the preferredLocaleCookie or browserLanguage is different from the default language
		// And redirect to the language-prefixed URL if necessary
		if (redirectLanguage !== sourceLanguageTag) {
			throw redirect(303, `/${redirectLanguage}${currentPath}`);
		}
	}
	// Else, if visiting a non-language-specific path that is not the root, handle as necessary

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			// Directly use the first segment as the language if it's a recognized language tag
			const lang = availableLanguageTags.includes(firstSegment)
				? firstSegment
				: preferredLocaleCookie || browserLanguage;
			const updatedHtml = html.replace(
				/<html\s+(lang="[^"]*")?/,
				`<html lang="${lang}"`,
			);
			return updatedHtml;
		},
	});

	return response;
};
