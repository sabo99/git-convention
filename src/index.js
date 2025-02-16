#!/usr/bin/env node

const Runtime = require('./main/runtime');
const { resolve } = require('path');
const process = require('node:process');
const config = require('./config');

const runtime = new Runtime({
	config,
	packageRoot: resolve(__filename, '..'),
	projectRoot: process.cwd()
});

console.log('packageRoot:', resolve(__filename, '..'));
console.log('projectRoot:', process.cwd());

runtime.exec();
