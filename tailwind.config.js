import themes from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */

const themeOverrides = {
	'--rounded-box': 'var(--radius)',
	'--rounded-btn': 'var(--radius)',
	'--tab-radius': 'var(--radius)',
	'--rounded-badge': 'calc(var(--radius) * 2)',
};

export default {
	// content: ['./src/**/*.{html,svelte}'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {},
	},
	daisyui: {
		logs: false,
		themes: [
			{
				light: {
					primary: '#ff0000',

					secondary: '#ffffff',

					accent: '#ffffff',

					neutral: '#ffffff',

					'base-100': '#ffffff',

					info: '#ffffff',

					success: '#00ffff',

					warning: '#ffffff',

					error: '#ffffff',
				},
			},
			{
				dark: {
					primary: '#1560eb',

					secondary: '#ffffff',

					accent: '#ffffff',

					neutral: '#ffffff',

					'base-100': '#ffffff',

					info: '#ffffff',

					success: '#00ffff',

					warning: '#ffffff',

					error: '#ffffff',
				},
			},
		],
	},
	plugins: [require('daisyui')],
};
