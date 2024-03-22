<script>
	import '../assets/css/app.scss';
	import 'svelte-ripple-action/ripple.css';

	import { ParaglideJS } from '@inlang/paraglide-js-adapter-sveltekit';
	import { i18n } from '$lib/i18n';

	import { onNavigate } from '$app/navigation';

	const { children } = $props();

	onNavigate((navigation) => {
		if (
			document.startViewTransition &&
			navigation.from?.url.href !== navigation.to?.url.href
		) {
			if (navigation.delta && navigation.delta < 0) {
				document.documentElement.dataset.back = 'true';
			} else {
				document.documentElement.removeAttribute('data-back');
			}

			return new Promise((resolve) => {
				document.startViewTransition &&
					document.startViewTransition(async () => {
						resolve();
						await navigation.complete;
					});
			});
		}
	});
</script>

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
