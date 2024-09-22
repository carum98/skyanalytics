import terser from '@rollup/plugin-terser'

export default {
	input: 'script.js',
	output: {
		file: 'dist/script.min.js',
		format: 'iife',
		name: 'SkyAnalytics',
		plugins: [
			terser({
				format: {
					comments: false,
				},
				compress: {
					defaults: true,
					arrows: true,
					dead_code: true,
					drop_console: true,
				}
			})
		]
	}
}