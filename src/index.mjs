import process from "node:process";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = process.cwd();
const packageRoot = resolve(__dirname, "..");

function copyFile(src, dest) {
	try {
		mkdirSync(dirname(dest), { recursive: true });
		copyFileSync(src, dest);
		console.log(`✔ Copied: ${src} -> ${dest}`);
	} catch (error) {
		console.error(`❌ Error copying ${src} to ${dest}:`, error.message);
	}
}

function copyCommitlint() {
	const configCommitPath = join(
		packageRoot,
		"src/template/commitlint/.commitlintrc.json"
	);
	const targetPath = join(projectRoot, ".commitlintrc.json");

	copyFile(configCommitPath, targetPath);
}

function copyHuskyHooks() {
	// Ensure .husky/_ directory exists
	const huskyDir = join(projectRoot, ".husky/_");
	if (!existsSync(huskyDir)) {
		mkdirSync(huskyDir, { recursive: true });
	}

	// Check if src/template/husky exists (alternative husky location)
	const configHuskyPath = join(projectRoot, "src/template/husky");
	if (existsSync(configHuskyPath)) {
		const hooks = ["_/husky.sh", "commit-msg", "pre-commit", "pre-push"];
		hooks.forEach((hook) => {
			copyFile(join(configHuskyPath, hook), join(projectRoot, ".husky", hook));
		});
		console.log("✔ Husky hooks successfully copied");
	} else {
		console.log(
			"❌ Warning: src/template/husky folder not found. Skipping hook copy."
		);
	}
}

function setupFiles() {
	// Copy non-husky files
	console.log("Copy non-husky files");
	copyCommitlint();

	// Copy husky hooks *after* husky install
	console.log("Copy husky hooks files");
	copyHuskyHooks();
}

try {
	// console.log("Package root : ", packageRoot);
	// console.log("Project root : ", projectRoot);
	if (packageRoot !== projectRoot) {
		console.log("🔧 Installing devDependencies...");
		execSync(
			"npm install -D husky @commitlint/cli @commitlint/config-conventional"
		);
	}
	console.log("🔧 Setting up Husky...");
	execSync("npx husky init", { stdio: "inherit" });
	execSync("npm pkg delete scripts.prepare", { stdio: "inherit" });

	setupFiles();

	console.log("✅ Husky setup complete!");
} catch (error) {
	console.error("❌ Failed to set up Husky:", error.message);
}
