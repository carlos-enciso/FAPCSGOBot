module.exports = function (grunt) {
	// Project configuration.
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		prettier: {
			files: {
				src: [
					'package.json',
					'*.js',
					'lib/*.js'
				]
			},
			options: {
				useTabs: true,
				singleQuote: true
			}
		},
		eslint: {
			target: ['*.js', 'lib/*.js']
		}
	});

	// Load grunt plugins for modules.
	grunt.loadNpmTasks('grunt-prettier');

	// Register tasks.
	grunt.registerTask('default', ['prettier', 'eslint']);
};
