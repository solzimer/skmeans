module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
		browserify: {
			dist: {
				watch: true,
				keepAlive: true,
				files: {
					'dist/skmeans.js': ['browser.js']
				}
			}
		},
		babel: {
			options: {
				sourceMap: true,
				presets: ['es2015']
			},
			dist: {
				files: {
					'dist/skmeans.js': 'dist/skmeans.js'
				}
			}
		},
	  uglify: {
	    options: {
	      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	    },
			build: {
      	src: 'dist/skmeans.js',
      	dest: 'dist/skmeans.min.js'
    	}
	  },
		clean: ['dist/skmeans.js','skmeans.js.map']
	});

	grunt.registerTask('default', ['browserify','babel','uglify']);
};
