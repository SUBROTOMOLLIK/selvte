const menuStructure = {
	main: {
		text: 'Home',
		items: [
			{ text: 'Home', type: 'link', href: '/' },
			{ text: 'Invest', type: 'slide', childSlide: 'invest_child_1' },
			{ text: 'Trade', type: 'link', href: '/' },
			{ text: 'Learn', type: 'link', href: '/' },
			{ text: 'Company', type: 'link', href: '/' },
			{ text: 'Support', type: 'link', href: '/' },
		],
	},
	invest_child_1: {
		items: [
			{ text: 'Invest Child 1', type: 'slide', childSlide: 'invest_item1' },
		],
	},
	invest_child_2: {
		items: [
			{ text: 'New Child', type: 'slide', childSlide: 'invest_item2' },
		],
	},
	invest_item1: {
		items: [{ text: 'tester',type: 'component' }],
	},
	// invest_item1: {
	// 	items: [{ text: 'Invest Child 2', type: 'component', component: 'Invest' }],
	// },
};

class Menu {
	open = $state(false);
	stack = $state([menuStructure.main]); // Initialize with the main menu
	direction = $state(1); // 1 for forward, -1 for backward
	navigating = $state(false); // Lock to prevent rapid navigation

	openMenu() {
		if (!this.open) {
			this.open = true;
			// Reset to main menu on open
			this.stack = [menuStructure.main];
		}
	}

	closeMenu = () => {
		this.open = false;
		this.stack = [];
	};

	async pushToStack(childSlide, dir = 1) {
		if (this.navigating || !menuStructure[childSlide]) return;
		this.navigating = true;
		const nextSlide = menuStructure[childSlide];
		this.stack = [...this.stack, nextSlide];
		this.direction = dir;
		await new Promise((r) => setTimeout(r, 600)); // Match animation duration
		this.navigating = false;
	}

	async popFromStack(dir = -1) {
		if (this.navigating || this.stack.length <= 1) return;
		this.navigating = true;
		this.stack = this.stack.slice(0, -1);
		this.direction = dir;
		await new Promise((r) => setTimeout(r, 600)); // Match animation duration
		this.navigating = false;
	}
}

export const menuController = new Menu();
