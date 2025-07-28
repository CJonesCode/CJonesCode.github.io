# Implementation Task List - Polymorphic Content System

## Overview
Implementation plan for converting from hardcoded projects to a polymorphic content system with GitHub integration and filtering capabilities.

---

## ✅ Task 1: Content Data Structure & Manual Overrides

### 1.1 Data Structure Setup
- [x] **Create `_data/content_items.yml`** - Convert current projects to YAML structure
- [ ] **Validate YAML structure** - Ensure all fields are properly structured
- [ ] **Create placeholder images** - Add actual project preview images to `/assets/images/`
  - [ ] `project-alpha-preview.png`
  - [ ] `defense-analytics-preview.png` 
  - [ ] `aerospace-controller-preview.png`

### 1.2 Manual Override Examples
- [x] **Project Alpha** - Security-focused application (Python, AWS, Security, Architecture)
- [x] **Defense Analytics Platform** - Defense analytics (C#, Langgraph, AWS, OSINT)
- [x] **Aerospace Systems Controller** - Aerospace systems (Python, C#, Real-time Systems, Aerospace)

### 1.3 Data Validation
- [ ] **Test YAML parsing** - Run `bundle exec jekyll serve` to validate syntax
- [ ] **Verify data access** - Test `{{ site.data.content_items }}` in templates
- [ ] **Check field completeness** - Ensure all required fields are present

**Success Criteria**: YAML data loads correctly in Jekyll and contains all current project information.

---

## 🔄 Task 2: Render Content Data Structure

### 2.1 Template Conversion
- [ ] **Create content renderer include** - `_includes/content_renderer.liquid`
- [ ] **Replace hardcoded projects** - Update `index.html` projects section
- [ ] **Implement alternating layout** - Use `{% cycle 'left-focus', 'right-focus' %}`
- [ ] **Add data attributes** - Include `data-tags` for filtering

### 2.2 Template Structure
```liquid
<!-- Replace current projects section with: -->
{% for item in site.data.content_items %}
  <div class="project" data-tags="{{ item.metadata.tags | join: ' ' | slugify }}">
    <div class="project-content {% cycle 'left-focus', 'right-focus' %}">
      <!-- Focus area -->
      <div class="project-visual">
        <img src="{{ item.focus.src }}" alt="{{ item.focus.alt }}">
        {% if item.focus.caption %}<p>{{ item.focus.caption }}</p>{% endif %}
      </div>
      <!-- Body area -->
      <div class="project-info">
        <h3>{{ item.body.title }}</h3>
        <p>{{ item.body.description }}</p>
        <div class="project-tech">
          {% for tech in item.body.technologies %}
            <span class="tech-tag">{{ tech }}</span>
          {% endfor %}
        </div>
        <div class="project-links">
          <a href="{{ item.body.links.demo }}" class="btn btn-primary">View Project</a>
          <a href="{{ item.body.links.github }}" class="btn btn-secondary">GitHub</a>
        </div>
      </div>
    </div>
  </div>
{% endfor %}
```

### 2.3 CSS Updates
- [ ] **Update project styles** - Ensure CSS works with new structure
- [ ] **Add filter attributes** - Style for `data-tags` attributes
- [ ] **Test responsive layout** - Verify alternating layout on mobile/desktop

### 2.4 Testing
- [ ] **Visual parity check** - Ensure rendered output matches current design
- [ ] **Link functionality** - Test all project links work correctly
- [ ] **Responsive behavior** - Test on different screen sizes

**Success Criteria**: Projects render identically to current implementation but from YAML data.

---

## 🔍 Task 3: Filter Buttons Generation

### 3.1 Build-Time Filter Generation
- [ ] **Create filter logic** - Extract unique technologies during Jekyll build
- [ ] **Generate filter buttons** - Create filter controls dynamically
- [ ] **Add filter container** - Insert above projects section

### 3.2 Filter Implementation
```liquid
<!-- Collect all unique technologies -->
{% assign all_technologies = "" | split: "" %}
{% for item in site.data.content_items %}
  {% for tech in item.body.technologies %}
    {% unless all_technologies contains tech %}
      {% assign all_technologies = all_technologies | push: tech %}
    {% endunless %}
  {% endfor %}
{% endfor %}
{% assign all_technologies = all_technologies | sort %}

<!-- Generate filter buttons -->
<div class="filter-controls">
  <button class="filter-btn active" data-filter="all">All</button>
  {% for tech in all_technologies %}
    <button class="filter-btn" data-filter="{{ tech | slugify }}">{{ tech }}</button>
  {% endfor %}
</div>
```

### 3.3 JavaScript Filter Logic
- [ ] **Add filter JavaScript** - Client-side show/hide functionality
- [ ] **Button active states** - Visual feedback for selected filters
- [ ] **Filter interaction** - Click to filter, click again to show all

### 3.4 Filter Styling
- [ ] **Style filter buttons** - Match existing design system
- [ ] **Active/hover states** - Visual feedback for interactions
- [ ] **Mobile responsiveness** - Ensure filters work on mobile

### 3.5 Testing
- [ ] **Filter functionality** - Test all technology filters work
- [ ] **Multi-project filtering** - Test projects with multiple tags
- [ ] **SEO compatibility** - Ensure content remains accessible without JS

**Success Criteria**: Dynamic filter buttons generate from project technologies and filter content correctly.

---

## 🔗 Task 4: Jekyll GitHub Metadata Plugin Integration

### 4.1 Plugin Setup
- [ ] **Verify plugin installation** - Check `bundle list | grep github`
- [ ] **Configure authentication** - Set up `JEKYLL_GITHUB_TOKEN` for private repos
- [ ] **Test GitHub data access** - Verify `site.github.public_repositories` works

### 4.2 GitHub Content Mapping
- [ ] **Create GitHub mapper** - Transform repo data to content structure
- [ ] **Map repo fields** - Convert GitHub API data to content items
- [ ] **Handle missing data** - Graceful fallbacks for incomplete repos

### 4.3 GitHub Mapping Logic
```liquid
<!-- Map GitHub repos to content structure -->
{% assign github_content = "" | split: "" %}
{% for repo in site.github.public_repositories %}
  {% if repo.stargazers_count > 0 or repo.name contains 'featured' %}
    {% assign repo_item = site.emptyArray | push: repo | first %}
    <!-- Transform repo to content item structure -->
    {% assign github_content = github_content | push: repo_item %}
  {% endif %}
{% endfor %}
```

### 4.4 Content Merging
- [ ] **Combine content sources** - Merge manual + GitHub content
- [ ] **Sort by priority** - Order by `metadata.order`, then GitHub metrics
- [ ] **Avoid duplicates** - Handle repos that exist in both sources

### 4.5 GitHub Data Integration
- [ ] **Repository selection** - Choose which repos to display (pinned, starred, etc.)
- [ ] **Fallback content** - Handle repos without descriptions/languages
- [ ] **Rate limiting** - Ensure build works within GitHub API limits

### 4.6 Testing
- [ ] **Build with GitHub data** - Test full build with live GitHub integration
- [ ] **Verify repo mapping** - Check GitHub repos appear in content
- [ ] **Test private repos** - Verify token authentication works

**Success Criteria**: GitHub repositories automatically populate content alongside manual projects.

---

## 🎯 Final Integration Testing

### Testing Checklist
- [ ] **Full build test** - Complete Jekyll build with all features
- [ ] **Content rendering** - All projects (manual + GitHub) display correctly
- [ ] **Filter functionality** - All technologies generate filters and work
- [ ] **Performance check** - Build time and page load performance
- [ ] **Mobile compatibility** - Full functionality on mobile devices
- [ ] **Accessibility** - Ensure keyboard navigation and screen reader support

### Deployment Preparation
- [ ] **GitHub Pages compatibility** - Ensure all features work on GitHub Pages
- [ ] **Documentation update** - Update README with new content system
- [ ] **Fallback behavior** - Graceful degradation if GitHub API unavailable

---

## 📚 Reference Files

- **Design Document**: `temp.md` (moved to `_docs/temp.md`)
- **Current Projects**: `index.html` (lines 80-171)
- **Data Structure**: `_data/content_items.yml`
- **Styles**: `assets/css/main.scss` (project section styles)

---

## Success Metrics

1. **Visual Parity**: New system produces identical output to current hardcoded version
2. **Enhanced Functionality**: Filtering works and improves user experience  
3. **GitHub Integration**: Live repositories automatically populate content
4. **Performance**: Build time remains reasonable with new features
5. **Maintainability**: Adding new projects requires only YAML updates 

---

## 🔄 Task 5: Repository Self-Serve Ingestion Config

Provide a mechanism for any GitHub repository to opt-in to the portfolio site by shipping its own pre-configured YAML file (e.g., `.portfolio.yml`) at the repo root.

### 5.1 YAML Schema Definition
- [ ] **Define minimal fields** – `name`, `description`, `homepage`, `language`, `topics`, `order`
- [ ] **Optional extras** – `logo`, `screenshots`, `demo_url`, `highlight` flag
- [ ] **Versioning** – Include a `schema_version` to allow future evolution

### 5.2 Schema Documentation
- [ ] **Living spec** – Document the schema in `_docs/portfolio-schema.md`
- [ ] **Example file** – Provide a sample `.portfolio.yml` users can copy-paste
- [ ] **Add links** – Reference the spec from the main `README`

### 5.3 Consumption Pipeline
- [ ] **Repository scan** – During the build, search each repo for `.portfolio.yml`
- [ ] **YAML parse** – Load file via GitHub API or local checkout at build time
- [ ] **Merge strategy** – Combine self-serve data with GitHub metadata, precedence: YAML > GitHub > defaults

### 5.4 Validation & Error Handling
- [ ] **Schema validation** – Fail build loudly if required fields are missing
- [ ] **Logging** – Surface warnings for non-fatal issues (e.g., unknown keys)

### 5.5 Testing
- [ ] **Unit tests** – YAML loader & mapper functions
- [ ] **Integration tests** – End-to-end build with sample repos

**Success Criteria**: Repositories with a valid `.portfolio.yml` are ingested automatically and rendered identically to manually defined content items.

--- 