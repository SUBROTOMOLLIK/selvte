<script>
	import { menuController } from './menuController.svelte.js';
	import { slide, fade } from 'svelte/transition';
	import { elasticIn, elasticInOut, quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	$effect(() => {
		document.body.style.overflow = menuController.open ? 'hidden' : '';
	});
</script>

<button on:click={() => menuController.openMenu()}>Toggle Menu</button>
<!-- in:fade={{ duration: 80 }} -->
<!-- out:fade={{ duration: 80 }} -->
{#if menuController.open}
	<div
		class="fixed top-0 right-0 h-screen w-min m-0 flex justify-end overflow-hidden z-50"
	>
		<div
			class="fixed top-0 h-screen w-screen left-0 cursor-pointer sm:bg-black/60"
			on:click={menuController.closeMenu}

		></div>
		<div
			class="w-[400px] shadow-md ring-1 ring-black ring-opacity-5 overflow-hidden h-screen relative"
			transition:fly={{ x: 200, duration: 200 }}
			style={`transform: ${menuController.open ? 'translate3d(0%, 0%, 0px)' : 'translate3d(0%, 0%, 0px)'};`}
		>
			{#each menuController.stack as { items }, index (index)}
				<div
					class=" w-full absolute top-0 right-0 h-screen bg-white"
					style={`transform: ${index === menuController.stack.length - 1 ? 'translate3d(0px, 0%, 0px)' : menuController.direction > 0 ? 'translate3d(0%, 0, 0px)' : 'translate3d(100%, 0, 0px)'};`}
				>
					<div transition:fly={{ x: 200, duration: 200 }} class="px-4 py-5 border-b relative font-bold text-lg flex items-center justify-center">
						{#if index === 0}
						<button
							on:click={() => menuController.popFromStack()}
							class="block absolute left-2 font-medium"> <svg width="25px" height="25px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5-a</title><polyline points="244 400 100 256 244 112" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"></polyline><line x1="120" y1="256" x2="412" y2="256" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"></line></g></svg>
						</button>
						{/if}
						{#if index > 0}
							<button
								on:click={() => menuController.popFromStack()}
								class="block absolute left-2 font-medium"> <svg width="25px" height="25px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5-a</title><polyline points="244 400 100 256 244 112" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"></polyline><line x1="120" y1="256" x2="412" y2="256" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"></line></g></svg>
							</button>
						{/if}
						Menu
					</div>
					{#each items as { text, type, href, childSlide }, itemIndex}
					    
						{#if type === 'link'}
							<a {href} class="block font-medium p-4 border-b">{text}</a>
						{:else if type === 'slide'}
							<button
								on:click={() => menuController.pushToStack(childSlide)}
								class="w-full font-medium p-4 border-b flex items-center justify-between">{text} <svg fill="#000000" height="15px" width="15px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"></path> </g></svg></button
							>
						{:else if type === 'component'}
							<!-- Dynamically render your component here -->
							<div class="block p-4 font-medium ">{text} </div>
						{/if}
					{/each}
					<!-- {#if index > 0}
						<button
							on:click={() => menuController.popFromStack()}
							class="block p-4 font-medium"> <svg width="25px" height="25px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5-a</title><polyline points="244 400 100 256 244 112" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"></polyline><line x1="120" y1="256" x2="412" y2="256" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"></line></g></svg>
						</button>
					{/if} -->
					<!-- <button
						on:click={() => menuController.closeMenu()}
						class="block p-4 border-t">Close</button
					> -->
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* .menu-slide {
		transform: translate3d(100%, 0, 0);
		transition: transform 0.15s ease;
	} */
</style>
