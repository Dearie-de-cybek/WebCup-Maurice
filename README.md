

```md
# 🚀 Digital Nomads

Welcome to our Hackathon project! This repository contains two main folders:

- `/frontend` — React.js frontend
- `/backend` — Express.js backend

## 📁 Project Structure

```

project-root/
│
├── frontend/       # React.js application
│   └── ...
│
├── backend/        # Express.js server
│   └── ...
│
└── README.md       # You're reading it

````

---

## 👥 Team Collaboration Guide

### 🔐 Main Branch Protection

> **The `main` branch is protected. No one should push directly to it.**

All changes must go through **Pull Requests (PRs)** and be approved by at least one team member before merging.

---

## 🔀 Branching Strategy

- Work on a **separate branch** for every feature, fix, or update.
- Use clear naming conventions:
  - `feature/login-page`
  - `bugfix/fix-auth-error`
  - `hotfix/crash-on-submit`
  - `chore/update-readme`

#### How to create a branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-branch-name
````

---

## 📁 Working in the Correct Folder

Make sure you are in the correct directory before running commands:

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

### Backend (Express)

```bash
cd backend
npm install
npm run dev
```

---

## 💾 Committing Changes

> ✅ Use clear and meaningful commit messages in this format:

```
type: short description
```

Where `type` can be:

* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Code style changes (formatting, missing semi colons, etc)
* `refactor`: Code change that doesn't fix a bug or add a feature
* `chore`: Changes to the build process or auxiliary tools

#### Example:

```bash
git add .
git commit -m "feat: added login form UI"
```

---

## 📤 Pushing and Creating a Pull Request

```bash
git push origin feature/your-branch-name
```

Then on GitHub:

1. Click **Compare & pull request**.
2. Add a descriptive title and summary of your changes.
3. Assign reviewers (at least one teammate).
4. Wait for review and approval before merging.

> 🚨 Never push directly to `main`. Always use a pull request.

---

## 🔄 Keeping Your Branch Up to Date

While working on a branch, you may need to update it with the latest changes from `main`:

```bash
git checkout main
git pull origin main

git checkout feature/your-branch-name
git merge main
```


---

## ✅ Before Merging a PR

* Ensure your changes **work as expected** and don’t break anything.
* Confirm that:

  * The branch is up to date with `main`.
  * The PR has a **clear description**.
* Delete your branch after merging (optional but tidy).

---

## 🧠 Summary of Git Commands

| Task                     | Command Example                          |
| ------------------------ | ---------------------------------------- |
| Create a new branch      | `git checkout -b feature/login-page`     |
| Stage and commit changes | `git add . && git commit -m "feat: msg"` |
| Push branch to GitHub    | `git push origin feature/login-page`     |
| Update your branch       | `git merge main` or `git rebase main`    |
| Switch to frontend       | `cd frontend`                            |
| Start React app          | `npm run dev`                              |
| Switch to backend        | `cd backend`                             |
| Start Express app        | `npm start`                            |

---

## 💬 Questions?

If you're stuck or confused, don’t hesitate to ask in the team group chat. Teamwork is everything!

---

Happy Hacking 💻✨
— Digital Nomads

