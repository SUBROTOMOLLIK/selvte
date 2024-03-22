<script>
	import Header from '$lib/components/frontend/Header.svelte';
	import Menu from '$lib/components/frontend/Menu.svelte';

	const { children } = $props();
</script>

<main>
	<Menu />
	<Header />

	{@render children()}
</main>
