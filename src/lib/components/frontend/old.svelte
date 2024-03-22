
frontendMenu.js:

import { tick, onDestroy } from 'svelte';
import { get, writable, derived } from 'svelte/store';

export let menuSlide = {
	main: {
		text: 'Home',
		title: 'Edit Profile',
		description: 'dfdff',
		items: [
			{
				text: 'Home',
				type: 'link',
				href: '/'
			},
			{
				id: 'invest',
				text: 'Invest',
				childSlide: 'invest_child_1',
				type: 'slide'
			},
			{
				text: 'Trade',
				type: 'link',
				href: '/trade'
			},
			{
				text: 'Learn',
				type: 'link',
				href: '/learn'
			},
			{
				text: 'Company',
				type: 'link',
				href: '/company'
			},
			{
				text: 'Support',
				type: 'link',
				href: '/support'
			}
		]
	},
	invest_child_1: {
		items: [
			{
				id: 'home-child',
				text: 'Invest Child 1',
				childSlide: 'invest_item1',
				type: 'slide'
			}
		]
	},
	invest_item1: {
		items: [
			{
				text: 'Invest Child 2',
				type: 'component',
				component: 'Invest'
			}
		]
	}
};
export const screenWidth = 640;
export const animateSlide = {
	in: 'translate3d(0, 0%, 0)',
	outRight: 'translate3d(-100%, 0,0)',
	outLeft: 'translate3d(100%, 0, 0)'
};
async function toggleTools(show, { after, before } = {}) {
	const navTool = document.querySelector(`#nav-tool`);
	if (!navTool) return;
	if (before) before();
	if (show) {
		navTool.classList.remove('m-fadeOut');
		navTool.classList.add('m-fadeIn');
	} else {
		navTool.classList.remove('m-fadeIn');
		navTool.classList.add('m-fadeOut');
	}
	if (after) after();
}

function animate(currentItem, previousItem, mode) {
	const previousSlideItem = previousItem ? document.querySelector(`#${previousItem}`) : null;
	const currentSlideItem = document.querySelector(`#${currentItem}`);
	if (mode === 'in') {
		if (currentSlideItem) {
			currentSlideItem.style.transform = animateSlide.in;
		}
		if (previousSlideItem) {
			previousSlideItem.style.transform = animateSlide.outRight;
		}
	} else {
		if (currentSlideItem) {
			currentSlideItem.style.transform = animateSlide.outLeft;
		}
		if (previousSlideItem) {
			previousSlideItem.style.transform = animateSlide.in;
		}
	}
}

const activeSlides = writable([]); // key of menu slide
async function openMenu(key, callback) {
	let previous = null;

	activeSlides.update((items) => {
		previous = items[items.length - 1];
		items.push(key);
		return items;
	});
	await tick();
	await new Promise((r) => setTimeout(r, 50));
	// if (typeof callback === 'function') callback(previous);
	animate(key, previous, 'in');
}
async function closeMenu(key) {
	const s = get(activeSlides);
	const itemIndex = s.findIndex((i) => i === key);
	if (itemIndex === -1) return;
	animate(key, s[itemIndex - 1], 'out');
	await new Promise((r) => setTimeout(r, 200));

	activeSlides.update((items) => {
		const itemIndex = items.findIndex((i) => i === key);
		if (itemIndex != -1) {
			return items.slice(0, itemIndex);
		}
	});
}
async function closeAllMenu() {
	const s = get(activeSlides);
	if (!s.length) return;
	animate(s[s.length - 1], '', 'out');
	await tick();
	await new Promise((r) => setTimeout(r, 200));
	activeSlides.update(() => []);
}

export function useNavMenu() {
	return {
		activeSlides,
		openMenu,
		closeMenu,
		closeAllMenu
	};
}

MobileMenu.svelte:

<script>
	import { portalAction, mediaQuery, hotKeyAction } from 'svelte-legos';
	import { fade } from 'svelte/transition';
	import { useNavMenu, screenWidth, animateSlide, menuSlide } from '$lib/stores/frontendMenu';
	import BackIcon from '~icons/mdi/arrow-left';
	import CloseIcon from '~icons/mdi/close';
	import { ripple } from 'svelte-ripple-action';
	import MdiChevronRight from '~icons/mdi/chevron-right';
	import { language } from '$lib/stores/languageStore.js';

	import Invest from './menu/Invest.svelte';

	const { activeSlides, openMenu, closeMenu, closeAllMenu } = useNavMenu();
	const isTab = mediaQuery(`(min-width: ${screenWidth}px)`);

	const updateStyles = (open, o = false) => {
		if (typeof window !== 'undefined') {
			const body = document.getElementById('fe-site');
			if (!body) return;
			if (!$isTab || o) {
				if (open) {
					body.classList.add('menu-slide');
					body.style.transform = animateSlide.outRight;
				} else {
					body.style.transform = animateSlide.in;
				}
			}
		}
	};

	function scrollLock(open) {
		if (typeof window !== 'undefined') {
			if (open) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		}
	}

	let isMenuOpen = false;
	$: {
		scrollLock(isMenuOpen);
		updateStyles(isMenuOpen);
	}
	let bodyAnimated = false;
	$: {
		if ($activeSlides?.length > 0) {
			if (bodyAnimated) {
				isMenuOpen = !isMenuOpen;
				bodyAnimated = false;
			}
		}
	}

	$: {
		if ($activeSlides?.length === 1) {
			isMenuOpen = true;
		}
	}

	$: {
		if ($isTab && isMenuOpen) {
			updateStyles(false, true);
		}
		if (!$isTab && isMenuOpen) {
			updateStyles(true, true);
		}
	}

	function closeMobileMenu() {
		if ($activeSlides && $activeSlides.length > 0) {
			closeMenu($activeSlides[$activeSlides.length - 1]);
			if ($activeSlides.length === 1) {
				isMenuOpen = false;
			}
		}
	}

	function closeAllMobileMenu() {
		closeAllMenu();
		isMenuOpen = false;
	}

	const componentMap = {
		Invest: Invest
		// Add more components here as needed
	};
</script>

<button
	on:click={() => {
		openMenu('main');
		bodyAnimated = true;
	}}
	use:hotKeyAction={{
		code: 'Escape',
		cb: () => {
			console.log('esc button');
			if (isMenuOpen) closeAllMobileMenu();
		}
	}}
>
	<slot />
</button>

{#if $activeSlides?.length}
	<div
		class={`fixed top-0 right-0 h-screen ${
			$isTab ? 'w-min' : 'w-screen'
		} m-0 flex justify-end overflow-hidden`}
		use:portalAction={'body'}
	>
		<div
			class="fixed top-0 h-screen w-screen left-0 cursor-pointer sm:bg-black/60"
			on:click={closeAllMobileMenu}
			in:fade={{ duration: 80 }}
			out:fade={{ duration: 80 }}
		></div>

		<div
			class={`${$isTab ? 'w-[400px] shadow-md ring-1 ring-black ring-opacity-5' : 'w-screen'} overflow-hidden h-screen relative`}
		>
			{#each $activeSlides as activeSlide, i}
				{@const slide = menuSlide[activeSlide]}
				<div
					class="menu-slide w-full absolute top-0 right-0 h-screen bg-white"
					id={activeSlide}
					style={`margin: 0 !important;`}
				>
					<div
						class="container mx-auto md:px-2 flex items-center justify-between h-[54px] md:h-[72px] border-b"
					>
						<div class="flex-1">
							<div
								use:ripple
								class="inline-flex md:h-12 md:w-12 md:flex md:items-center md:justify-center rounded-full"
							>
								{#if $activeSlides?.length > 1 && $activeSlides[0] !== activeSlide}
									<button on:click={closeMobileMenu}>
										<BackIcon class="w-6 h-6" />
									</button>
								{:else}
									<button on:click={closeAllMobileMenu}>
										<BackIcon class="w-6 h-6" />
									</button>
								{/if}
							</div>
						</div>
						<div class="flex-0 text-center">
							<span class="flex text-black font-semibold md:text-xl mt-[-2px]">Menu</span>
						</div>
						<div class="flex-1"></div>
					</div>

					<div
						class={`${$isTab ? 'w-[400px]' : 'w-full'} text-black flex flex-col gap-3 text-nowrap h-full`}
					>
						{#if slide.items && slide.items?.length}
							<div class="text-left flex flex-col justify-start items-start w-full">
								{#each slide.items as item}
									{#if item.type === 'slide'}
										<button
											on:click={() => {
												openMenu(item.childSlide);
											}}
											class="w-full flex justify-between items-center py-4 px-6 border-b"
										>
											<span class="text-sm md:text-base">{item.text}</span>
											<MdiChevronRight class="h-5 w-5" />
										</button>
									{:else if item.type === 'link'}
										<a
											on:click={closeAllMobileMenu}
											href={$language + item.href}
											class="w-full flex justify-between items-center py-4 px-6 border-b"
										>
											<span class="text-sm md:text-base">{item.text}</span>
										</a>
									{:else if item.type === 'component'}
										<svelte:component this={componentMap[item.component]} />
									{:else}
										<p>{item.text}</p>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

css:


.menu-slide {
	/* Initial state, assuming offscreen to the right */
	transform: translate3d(100%, 0, 0);

	/* Smooth transition for transform property */
	transition: transform 0.15s ease;
}

