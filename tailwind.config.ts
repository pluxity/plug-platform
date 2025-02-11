import type { Config } from "tailwindcss";

export default {
	content: [],
	theme: {
		extend: {
			colors: {
            	primary: {},
              	// ... 다른 색상 변수
            },
		},
	},
	plugins: [],
} satisfies Config;