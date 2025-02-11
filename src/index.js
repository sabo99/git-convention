#!/usr/bin/env node

import process from "node:process";
import { execSync } from "node:child_process";
import {
	existsSync,
	mkdirSync,
	copyFileSync,
	appendFileSync,
	readFileSync,
	writeFileSync
} from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

// Paths
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");
const projectRoot = process.cwd();
const huskySourceDir = join(packageRoot, "src/template/husky");
const huskyTargetDir = join(projectRoot, ".husky");
const commitlintSrc = join(
	packageRoot,
	"src/template/commitlint/.commitlintrc.json"
);
const commitlintDest = join(projectRoot, ".commitlintrc.json");
const gitignoreTemplateSrc = join(
	packageRoot,
	"src/template/ignorefile/.gitignore"
);
const gitignoreDest = join(projectRoot, ".gitignore");
const huskyIgnoreLine = "# husky config\n.husky\n";

/**
 * Ensure the given directory exists, create if necessary.
 * @param {string} path - The directory path.
 */
function ensureDirectoryExists(path) {
	if (!existsSync(path)) {
		mkdirSync(path, { recursive: true });
	}
}

/**
 * Copy a file from source to destination.
 * @param {string} src - Source file path.
 * @param {string} dest - Destination file path.
 */
function copyFile(src, dest) {
	try {
		ensureDirectoryExists(dirname(dest));
		copyFileSync(src, dest);
		console.log(`✔ Copied: ${src} -> ${dest}`);
	} catch (error) {
		console.error(`❌ Error copying ${src} to ${dest}:`, error.message);
	}
}

/**
 * Copy Commitlint configuration file.
 */
function setupCommitlint() {
	if (existsSync(commitlintSrc)) {
		copyFile(commitlintSrc, commitlintDest);
	} else {
		console.warn("⚠ Commitlint config not found, skipping.");
	}
}

/**
 * Copy Husky hook files.
 */
function setupHuskyHooks() {
	ensureDirectoryExists(huskyTargetDir);

	const hooks = ["_/husky.sh", "commit-msg", "pre-commit", "pre-push"];
	hooks.forEach((hook) => {
		const srcPath = join(huskySourceDir, hook);
		const destPath = join(huskyTargetDir, hook);

		if (existsSync(srcPath)) {
			// Check if destination file exists and has the same content
			if (existsSync(destPath)) {
				const srcContent = readFileSync(srcPath, "utf8").trim();
				const destContent = readFileSync(destPath, "utf8").trim();

				if (srcContent === destContent) {
					console.log(`✔ Skipped: ${hook} already up to date.`);
					return;
				}
			}

			copyFile(srcPath, destPath);
		} else {
			console.warn(`⚠ Husky hook "${hook}" not found, skipping.`);
		}
	});
}

/**
 * Ensure .gitignore exists and add Husky ignore rule.
 */
function setupGitignore() {
	try {
		if (existsSync(gitignoreDest)) {
			// Read existing .gitignore
			const content = readFileSync(gitignoreDest, "utf8");

			// Check if the line is already present
			if (!content.includes(".husky")) {
				appendFileSync(gitignoreDest, `\n${huskyIgnoreLine}`);
				console.log("✔ Added Husky ignore rule to .gitignore");
			} else {
				console.log("✔ .husky already ignored in .gitignore, skipping.");
			}
		} else {
			// Copy the template .gitignore if it exists
			if (existsSync(gitignoreTemplateSrc)) {
				copyFileSync(gitignoreTemplateSrc, gitignoreDest);
				console.log("✔ Copied .gitignore from template.");
			} else {
				// If no template exists, create a new one
				writeFileSync(gitignoreDest, huskyIgnoreLine);
				console.log("✔ Created a new .gitignore with Husky ignore rule.");
			}
		}
	} catch (error) {
		console.error("❌ Error modifying .gitignore:", error.message);
	}
}

/**
 * Install necessary development dependencies.
 */
function installDependencies() {
	if (packageRoot !== projectRoot) {
		console.log("🔧 Installing devDependencies...");
		execSync(
			"npm install -D husky @commitlint/cli @commitlint/config-conventional",
			{
				stdio: "inherit"
			}
		);
	}
}

/**
 * Initialize Husky.
 */
function initializeHusky() {
	console.log("🔧 Initializing Husky...");
	execSync("npx husky init", { stdio: "inherit" });
	execSync("npm pkg delete scripts.prepare", { stdio: "inherit" });
}

/**
 * Main setup function.
 */
function setup() {
	try {
		console.log("🚀 Setting up Git conventions...");
		installDependencies();
		initializeHusky();

		// Copy required files
		setupCommitlint();
		setupHuskyHooks();
		setupGitignore();

		console.log("✅ Husky setup complete!");
	} catch (error) {
		console.error("❌ Failed to set up Husky:", error.message);
	}
}

// Run setup
setup();
