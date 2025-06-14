# 🛠️ tools

![image](https://github.com/user-attachments/assets/22fec4e6-b392-43c1-9871-f7c503647905)

- Source: https://x.com/theapache64/status/1907157687340802306

## 🤖 Auto-Update Feature

This repository includes a GitHub Action that automatically updates the `index.html` file whenever new HTML tools are added to the repository.

### How it works:

1. **Trigger**: The action runs when you push HTML files (except `index.html`) to the main/master branch
2. **Detection**: It scans for new HTML files that aren't already listed in `index.html`
3. **Metadata Extraction**: For each new file, it extracts:
   - Title (from `<title>` tag or `<h1>`)
   - Description (from meta description or first `<p>` tag)
   - Filename for the link
4. **Auto-Update**: Creates a new tool card and adds it to the tools container in `index.html`
5. **Commit**: Automatically commits the updated `index.html` back to the repository

### Adding a new tool:

1. Create your HTML tool file (e.g., `my-awesome-tool.html`)
2. Make sure it has a proper `<title>` tag and description
3. Push to the main/master branch
4. The GitHub Action will automatically add it to the index page!

### File Structure:
```
├── .github/
│   └── workflows/
│       ├── update-index.yml    # GitHub Action workflow
│       └── update-index.js     # Script that handles the logic
├── index.html                  # Main landing page
├── tool1.html                  # Individual tool files
├── tool2.html
└── ...
```
