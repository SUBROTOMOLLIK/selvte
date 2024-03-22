<script>
	import Test from './Test.svelte';
	import * as m from '$m';
	import { i18n } from '$lib/i18n';

	import { Drawer } from 'vaul-svelte';
	$effect(() => {
		console.log('ey');
	});
</script>

<Drawer.Root>
	<Drawer.Trigger>Open</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Content>
			<p>Content</p>
		</Drawer.Content>
		<Drawer.Overlay />
	</Drawer.Portal>
</Drawer.Root>
<Test dog="fuck" />
<h1 class="text-3xl text-primary">{m.contact()}</h1>
<p>
	Visit <a href={i18n.resolveRoute('/about')}>kit.svelte.dev</a> to read the documentation
</p>
<input type="text" />
