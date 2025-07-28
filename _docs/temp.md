# Portfolio Content System Design Document (Revised)

## Overview

This design defines a polymorphic content system for portfolio **projects and repositories** with reusable, filterable components and consistent rendering patterns. Content is agnostic - you can place any project-related content in either focus or body areas, with automatic GitHub integration and manual overrides.

## Core Architecture

### Content Object Structure

```yaml
# Jekyll Data Structure
ContentItem:
  id: string                    # Unique identifier
  source: "github" | "manual"   # Data source type
  focus:                        # Primary attention content - renderer determines how to display
    src: string                 # Image URL, demo URL, repo URL, etc.
    alt: string                 # Alt text for images, title for links
    caption: string             # Optional caption/description
  body:                         # Supporting information  
    title: string
    description: string
    technologies: array
    stats: object               # GitHub stats if applicable
  metadata:                     # Filtering & ordering
    tags: array
    order: integer
    featured: boolean
    created_at: date
    source_data: object         # Original GitHub data if applicable
```

**Jekyll Integration Pattern**:
```liquid
<!-- Access GitHub repos -->
{% assign github_repos = site.github.public_repositories %}

<!-- Access manual content --> 
{% assign manual_items = site.data.content_items %}

<!-- Combine and sort -->
{% assign all_content = github_repos | concat: manual_items | sort: 'metadata.order' %}
```

**Focus Content** (`content.focus`):
- Primary attention-grabbing element
- What users look at first
- Examples: project media, interactive demos, charts, screenshots, live demo links

**Body Content** (`content.body`):
- Supporting/descriptive information
- Secondary content that provides context
- Examples: project descriptions, tech stack, stats, contributor info, detailed explanations

**Metadata**:
- Tags/categories for filtering (technologies, topics, etc.)
- Order/priority for manual arrangement
- Source information (GitHub repo, manual entry, etc.)

## Content Examples

### Repository/Project Content
- **Focus**: Project media, demos, screenshots, live demo links *(visual hook)*
- **Body**: Project title, description, tech stack, GitHub stats, links *(explanatory details)*
- **Metadata**: Technology tags for filtering, priority order, featured status

### Manual Project Content
- **Focus**: Custom media, interactive elements, video previews *(attention-grabber)*
- **Body**: Custom descriptions, technology lists, external links *(supporting info)*
- **Metadata**: Custom tags for filtering, manual ordering

## Rendering System

### Layout Engine
- **Horizontal Alignment**: Focus and body elements centered relative to each other
- **Alternating Layout**: Even-indexed items render focus-left/body-right, odd-indexed items render focus-right/body-left
- **Responsive Behavior**: Stack vertically on mobile, maintain alternation on desktop
- **Content Agnostic**: Renderer doesn't care what type of content is in focus vs body

### Order Management
1. **Manual Priority**: Items with explicit `order` values sorted first
2. **Featured Items**: Items marked as `featured: true` get higher priority
3. **Auto-Generated**: GitHub-sourced content inserted by default rules (newest first, most starred, etc.)
4. **Custom Insertion**: Any project content can be manually placed anywhere in the sequence

## Filtering System

### Build-Time Filter Generation
**Generate Filters During Jekyll Build** (no runtime DOM manipulation):
```liquid
<!-- Collect all unique technologies during Jekyll build -->
{% assign all_technologies = "" | split: "" %}
{% for item in content_items %}
  {% for tech in item.body.technologies %}
    {% unless all_technologies contains tech %}
      {% assign all_technologies = all_technologies | push: tech %}
    {% endunless %}
  {% endfor %}
{% endfor %}
{% assign all_technologies = all_technologies | sort %}

<!-- Generate static filter buttons -->
<div class="filter-controls">
  <button class="filter-btn active" data-filter="all">All</button>
  {% for tech in all_technologies %}
    <button class="filter-btn" data-filter="{{ tech | slugify }}">{{ tech }}</button>
  {% endfor %}
</div>
```

### Content with Filter Attributes
```liquid
{% for item in content_items %}
  <div class="content-item" data-tags="{% for tech in item.body.technologies %}{{ tech | slugify }} {% endfor %}">
    <!-- existing content structure -->
  </div>
{% endfor %}
```

### Client-Side Filter Logic
**Simple show/hide - no DOM generation:**
```javascript
// All content and filters already exist in HTML
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Show/hide content items
    document.querySelectorAll('.content-item').forEach(item => {
      if (filter === 'all' || item.dataset.tags.includes(filter)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});
```

### Filter Benefits
- ✅ **SEO-friendly** - All content exists in static HTML
- ✅ **Fast filtering** - No DOM manipulation, just show/hide
- ✅ **Build-time optimization** - Filter buttons generated once during build
- ✅ **Accessible** - Works without JavaScript
- ✅ **No runtime computation** - All tags collected during Jekyll build

## Data Sources

### Jekyll GitHub Metadata Integration
Using the `jekyll-github-metadata` plugin, repository data is available via `site.github` namespace:

```yaml
# Available GitHub data structure
site.github:
  repository_name: "repo-name"
  repository_url: "https://github.com/owner/repo"
  owner_name: "owner"
  project_title: "Project Title"
  releases: [...] 
  contributors: [...]
  public_repositories: [...]
  latest_release: {...}
```

**Repository Content Mapping**:
```liquid
{% for repo in site.github.public_repositories %}
  focus: {{ repo.homepage || repo.html_url }} # Live demo or repo link
  body: {{ repo.description }}, contributors, stats
  metadata: {{ repo.language }}, {{ repo.topics }}, {{ repo.created_at }}
{% endfor %}
```

**Authentication for Private Repos**:
```bash
export JEKYLL_GITHUB_TOKEN=ghp_your_token_here
bundle exec jekyll serve
```

### Manual Content Definition

**Option 1: Single File** (`_data/content_items.yml`)
```yaml
# All manual content in one file
- id: "custom-project"
  focus:
    src: "/assets/images/project.png"
    alt: "Project screenshot"
    caption: "Live demo available"
  body:
    title: "Custom Project"
    description: "Manual project description"
    technologies: ["Python", "React"]
  metadata:
    tags: ["AI", "Web"]
    order: 1
    featured: true

- id: "another-project"
  focus:
    src: "https://demo.example.com"
    alt: "Live demo"
  # ... more projects
```

**Option 2: Multiple Files**
```
_data/
├── projects.yml          # Manual projects
├── overrides.yml         # GitHub repo overrides
└── featured.yml          # Featured content
```


**Access in Templates**:
```liquid
<!-- Single file -->
{{ site.data.content_items }}

<!-- Multiple files -->
{{ site.data.projects }}
{{ site.data.overrides }}

<!-- Nested -->
{{ site.data.content.manual }}
{{ site.data.content.github_overrides }}
```

**Flexible Content Structure**:
- Focus: Just `src`, `alt`, `caption` - renderer figures out the rest
- Body supports rich content (markdown, HTML, structured data)
- Metadata enables filtering, ordering, and categorization
- Mix Jekyll/GitHub data with manual overrides

## Implementation Benefits

### Jekyll-Native Design
- **Built-in GitHub integration** - Leverages `jekyll-github-metadata` plugin
- **Liquid templating** - Use familiar Jekyll syntax for content rendering
- **Data files** - Store manual content in `_data/` directory
- **Build-time generation** - All content processed during Jekyll build

### Content Agnostic Design
- No predefined content types or restrictions
- Renderer works with any focus/body combination
- Easy to add completely new kinds of content

### Attention-Driven Layout
- Focus area always gets primary visual weight
- Body area provides necessary context
- User's eye naturally flows from focus to body

### Maximum Flexibility
- **GitHub + Manual mix** - Combine automated repo data with custom content
- **Authentication support** - Access private repos with tokens
- **Caching** - GitHub data cached during build process
- **Any tagging/filtering scheme** - Use Jekyll's filtering capabilities

## Jekyll Implementation Example

```liquid
<!-- _includes/content_renderer.liquid -->
{% assign content_items = site.github.public_repositories | map: 'github_mapper' | concat: site.data.content_items | sort: 'metadata.order' %}

{% for item in content_items %}
  <div class="content-item {% cycle 'left-focus', 'right-focus' %}">
    <div class="focus">
      {% if item.focus.src contains 'http' %}
        <!-- Could be image, demo, or repo - let CSS/JS handle smart rendering -->
        <a href="{{ item.focus.src }}" target="_blank">
          {% if item.focus.src contains '.png' or item.focus.src contains '.jpg' or item.focus.src contains '.gif' %}
            <img src="{{ item.focus.src }}" alt="{{ item.focus.alt }}">
          {% else %}
            <div class="link-preview">{{ item.focus.alt }}</div>
          {% endif %}
        </a>
      {% else %}
        <!-- Local asset -->
        <img src="{{ item.focus.src }}" alt="{{ item.focus.alt }}">
      {% endif %}
      {% if item.focus.caption %}
        <p class="caption">{{ item.focus.caption }}</p>
      {% endif %}
    </div>
    <div class="body">
      <h3>{{ item.body.title }}</h3>
      <p>{{ item.body.description }}</p>
      <div class="tech-tags">
        {% for tech in item.body.technologies %}
          <span class="tag" data-filter="{{ tech }}">{{ tech }}</span>
        {% endfor %}
      </div>
    </div>
  </div>
{% endfor %}
```

This system provides a Jekyll-native, flexible foundation where GitHub repository data and manual content seamlessly integrate through familiar Jekyll patterns. 