# Editing the Philadelphia Argentine Tango School Website

This guide will help you update the website using an LLM agent (like Claude). You don't need to know coding or command-line tools—just follow these steps and tell the agent what to do.

## Initial Setup (Do This Once)

### 1. Get the Website Files

1. Open Visual Studio Code
2. Tell your agent: **"Clone the repository from https://github.com/tangoschool/pats"**
3. When asked where to save it, choose a folder on your computer

### 2. Open the Project

Tell your agent: **"Open the pats folder in VS Code"**

## Making Changes to the Website

### Finding What to Edit

The website files are in the `website` folder. Each page is an HTML file:
- `index.html` - Home page
- `about.html` - About page
- `group-classes.html` - Classes page
- And many more...

**To make changes:** Tell your agent which page you want to edit and what changes you want. For example:
- *"Update the about.html page to change the studio address"*
- *"Add a new workshop announcement to the index.html page"*
- *"Change the teacher bio on meredith.html"*

### Testing Your Changes Locally

Before publishing changes to the live website, you can preview them on your computer:

1. Tell your agent: **"Start a local web server to preview the website"**
2. The agent will start Python's built-in server
3. Open your web browser and go to: `http://localhost:8000/website/`
4. You'll see your changes live
5. When done previewing, tell your agent: **"Stop the local web server"**

### Publishing Your Changes

Once you're happy with your edits:

1. Tell your agent: **"Commit and push my changes to GitHub"**
2. The agent will ask you to describe what you changed (e.g., "Updated studio hours")
3. Your changes will be published to the live website automatically within a few minutes

## Tips

- Be specific when describing changes to your agent
- Always preview changes locally before publishing
- If something looks wrong, tell your agent: *"Undo the last change"*
- You can view the live website at your GitHub Pages URL after changes are published
