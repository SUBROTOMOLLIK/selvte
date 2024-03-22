<script>
	const { dog } = $props();
	$effect(() => {
		console.log(dog);
	});
</script>
