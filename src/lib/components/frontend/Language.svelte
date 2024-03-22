<script>
	import { enhance } from '$app/forms';
	import {
		availableLanguageTags,
		languageTag,
		sourceLanguageTag,
		setLanguageTag,
	} from '$paraglide/runtime';
	import Globe from './../icons/Globe.svelte';
	import { goto } from '$app/navigation';
	import { getCookie, setCookie } from '$lib/utils/cookie.js';
	import { ripple } from 'svelte-ripple-action';

	const langsToLabels = {
		en: 'English',
		de: 'German',
	};

	let currentLanguageLabel = $derived(langsToLabels[languageTag()]);

	function changeLanguage(lang) {
		if (availableLanguageTags.includes(lang)) {
			setLanguageTag(lang);
			const currentPath = window.location.pathname
				.split('/')
				.slice(2)
				.join('/');
			const currentQueryString = window.location.search;
			console.log('jaja', currentPath, currentQueryString);
			// Construct the new URL with the new language, existing path, and query string
			const newUrl = `/${lang}/${currentPath}${currentQueryString}`;
			setCookie('language', lang);
			goto(newUrl, { replaceState: true });
		}
	}
</script>

<div class="dropdown">
	<button class="flex items-center gap-1">
		<Globe class="w-4" />
		{currentLanguageLabel}
	</button>
	<div class="menu z-40 mt-24 rounded-box bg-base-100 p-2 shadow">
		<ul>
			{#each availableLanguageTags as lang}
				<li>
					<button
						name="locale"
						use:ripple
						on:click={() => changeLanguage(lang)}
						aria-current={lang === languageTag() ? 'page' : undefined}
					>
						{langsToLabels[lang]}
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>
