# Casey Jones - Portfolio Website

Jekyll portfolio website for GitHub Pages deployment.

## Design System

The portfolio uses CSS custom properties (design tokens) making it easy to customize colors:

```css
:root {
  --primary-color: #2563eb;
  --background-color: #fafafa;
  --text-primary: #1e293b;
  /* ... and many more */
}
```

## Sections

1. **About** - Bio, education, focus areas, contact info and social links
2. **Skills** - Technology skills grid
3. **Projects** - Project showcase with alternating layout

## Project Structure

```
├── _config.yml          # Jekyll configuration
├── _layouts/            
│   └── default.html     # Main layout template
├── assets/
│   ├── css/
│   │   └── main.scss    # Styles with design tokens
│   └── js/
│       └── main.js      # Interactive functionality
├── index.html           # Main portfolio page
├── Gemfile             # Ruby dependencies
└── README.md           # This file
```

## Local Development

### Prerequisites

- **Ruby** (version 2.7 or higher, 3.x recommended)
- **Bundler** gem manager

### System Requirements

- **macOS**: Ruby pre-installed, consider Homebrew for newer version
- **Windows**: Install via [RubyInstaller](https://rubyinstaller.org/)
- **Linux**: Install via package manager (`sudo apt install ruby-dev` on Ubuntu)

### Setup

```bash
# Install dependencies
bundle install

# Start development server with live reload
bundle exec jekyll serve --livereload

# View at http://localhost:4000
```

**Note**: If you get permission errors during install:
```bash
bundle install --path vendor/bundle
```

### Development Workflow

1. Edit files in your preferred editor
2. Save changes (Jekyll auto-rebuilds)
3. Browser auto-refreshes (with `--livereload`)

**Config changes** (`_config.yml`) require server restart.

## GitHub Pages Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial portfolio setup"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Set source to "Deploy from a branch"
   - Select "main" branch
   - Click "Save"

3. **Your site will be live at:** `https://cjonescode.github.io`

## Customization

### Adding Real Projects

Replace the placeholder projects in `index.html`:

```html
<div class="project-info">
  <h3>Your Project Name</h3>
  <p>Your project description...</p>
  <div class="project-tech">
    <span class="tech-tag">Technology</span>
  </div>
  <div class="project-links">
    <a href="https://your-demo.com" class="btn btn-primary">View Project</a>
    <a href="https://github.com/you/repo" class="btn btn-secondary">GitHub</a>
  </div>
</div>
```

### Updating Personal Information

Edit `_config.yml` to update:
- Personal details
- Skills list
- Education information
- Social media links

### Color Customization

Modify the CSS custom properties in `assets/css/main.scss`:

```css
:root {
  --primary-color: #your-color;
  --background-color: #your-bg;
  /* ... other design tokens */
}
```

## Build Commands

```bash
# Production build
JEKYLL_ENV=production bundle exec jekyll build

# Clean build artifacts
bundle exec jekyll clean
``` 