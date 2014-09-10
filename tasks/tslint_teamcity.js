/*
 * grunt-tslint-teamcity
 * https://github.com/zismailov/grunt-tslint-teamcity
 *
 * Copyright (c) 2014 zismailov
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {

	/** Dependency injection */
	var Linter = require("tslint");
	var path = require("path");
	
	/** Create task */
  grunt.registerMultiTask('tslint_teamcity', 'TypeScript linter with teamcity reporter.', function() {
  
    /** Success flag */
	var success = true;
	
	/** Merge task-specific and/or target-specific options with these defaults. */
	var options = this.options({});
	
	/** Get module dir */
	var moduleDirectory = path.dirname(module.filename);
	
	/** Get the absolute path of the dir 'formatters' relative to the Gruntfile. */
	var CORE_FORMATTERS_DIRECTORY = path.resolve(moduleDirectory, "..", "formatters");
	
	/** Formatter name */
	options.formatter = "teamcity";
	
	/** Formatters dir */
	options.formattersDirectory = CORE_FORMATTERS_DIRECTORY;
		
	this.filesSrc.forEach(function(filepath){
		
		/** Check file exist */
		if (!grunt.file.exists(filepath)) {
			grunt.log.warn('Source file "' + filepath + '" not found.');
		} else {
			var contents = grunt.file.read(filepath),
				
				/** Create linter */
				linter = new Linter(filepath, contents, options),
				
				/** Run linter */
				result = linter.lint();
			
			/** Check result */
			result.output.split("\n").forEach(function (line) {
				if (line) {
					/** Show formatting error */
					grunt.log.writeln(line);
				}
			});
			
			/** Check result length and success flag */
			if (!result.output && success) {
				success = true;
			} else {
				success = false;
			}
		}
	});
	
	/** Show success block or abort task */
	if(success){
		grunt.log.writeln("##teamcity[testStarted name='TSHint']");
		grunt.log.writeln("##teamcity[testFinished name='TSHint']");
	} else {
		return false;
	}
  });
};
