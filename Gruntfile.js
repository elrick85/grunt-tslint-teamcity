/*
 * grunt-tslint-teamcity
 * https://github.com/zismailov/grunt-tslint-teamcity
 *
 * Copyright (c) 2014 zismailov
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			]
			,options: {
				jshintrc: '.jshintrc'
			}
		},

		tslint_teamcity: {
			all: {
				options: {
				  configuration: grunt.file.readJSON("tslint.json")
				}
				,files: {
				  src: [
					"test/fixtures/correctFile.ts"
					,"test/fixtures/errorFile.ts"
				]}
			}
			,errors: {
				options: {
				  configuration: grunt.file.readJSON("tslint.json")
				}
				,files: {
				  src: [
					"test/fixtures/errorFile.ts"
				]}
			}
			,success: {
				options: {
				  configuration: grunt.file.readJSON("tslint.json")
				}
				,files: {
				  src: [
					"test/fixtures/correctFile.ts"
				]}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	
	grunt.registerTask('test', ['tslint_teamcity']);
	grunt.registerTask('default', ['jshint', 'test']);
};
