<script>
	import Language from './Language.svelte';
	import Theme from './Theme.svelte';
</script>

<Language />
<button onclick={window.switchModes}><Theme class="w-4" /></button>
