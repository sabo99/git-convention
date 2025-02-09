# @sabo/git-convention

![npm](https://img.shields.io/npm/v/@sabo/git-convention?color=blue&style=flat-square)
![license](https://img.shields.io/github/license/sabo99/git-convention?style=flat-square)

🚀 **@sabo/git-convention** is a simple CLI tool to set up Git conventions like Husky and Commitlint in your project.

---

## 📌 Features

✔ Automatically installs and configures **Husky** 🐶  
✔ Sets up **Commitlint** for commit message validation 📝  
✔ Ensures `.gitignore` includes necessary rules ⚡  
✔ Works with any Node.js project 💡  

---

## 📦 Installation

Install globally using npm:

```sh
npm install -g @sabo/git-convention
```

Or use `npx` to run it without installation:

```sh
npx @sabo/git-convention init
```

---

## 🚀 Usage

To set up Git conventions, run:

```sh
npx git-convention init
```

This will:

- Install **Husky** and **Commitlint**
- Configure Husky hooks (`commit-msg`, `pre-commit`, `pre-push`)
- Add `.commitlintrc.json` to enforce conventional commits
- Ensure `.husky` is ignored in `.gitignore`

---

## 🛠 Configuration

### Customizing `.commitlintrc.json`

You can modify `.commitlintrc.json` to adjust commit message rules:

```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

### Custom Husky Hooks

Modify `.husky/pre-commit` to add custom pre-commit scripts:

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npm test
```

---

## 🤝 Contributing

Want to improve this package? Fork the repo and submit a PR! 🎉

1. **Fork the repo**
2. **Clone your fork**

   ```sh
   git clone https://github.com/sabo99/git-convention.git
   ```

3. **Install dependencies**

   ```sh
   npm install
   ```

4. **Make your changes and test**
5. **Submit a PR** 🚀

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Show Your Support

Give a ⭐ if you like this project!

---
