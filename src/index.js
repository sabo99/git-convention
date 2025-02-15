#!/usr/bin/env node

const Runtime = require("./main/Runtime");
const { resolve } = require("path");
const process = require("node:process");
const config = require("./config");

const runtime = new Runtime({
	config,
	packageRoot: resolve(__filename, ".."),
	projectRoot: process.cwd()
});

runtime.exec();
