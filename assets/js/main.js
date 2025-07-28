// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Initialize theme from localStorage or default to light
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            htmlElement.setAttribute('data-theme', savedTheme);
            updateThemeToggleIcon(savedTheme);
        } else if (prefersDark) {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeToggleIcon('dark');
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            updateThemeToggleIcon('light');
        }
    }
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon(newTheme);
    }
    
    // Update theme toggle icon based on current theme
    function updateThemeToggleIcon(theme) {
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        }
    }
    
    // Add event listener to theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            updateThemeToggleIcon(newTheme);
        }
    });
    
    // Initialize theme on page load
    initializeTheme();

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 60; // Account for fixed navbar
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Don't change URL
            }
        });
    });

    // Mobile dropdown menu toggle
    const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
    const dropdown = document.querySelector('.nav-dropdown');
    
    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking dropdown items
        const dropdownItems = document.querySelectorAll('.nav-dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Clear filters when navigating to a specific project
                const targetId = this.getAttribute('href');
                clearFilters();
                
                // Navigate to the top of the project content
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Close dropdown
                dropdown.classList.remove('active');
                if (window.innerWidth <= 767) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target) && !dropdownToggle.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            // Also close dropdown if open
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Update active navigation on scroll
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sectionsToAnimate = document.querySelectorAll('.section, .project, .skill-card');
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('.btn[href^="#"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Don't change URL
            }
        });
    });

    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Enhanced typing effect for about title
    const aboutTitle = document.querySelector('.about-intro h1');
    if (aboutTitle) {
        const text = aboutTitle.textContent;
        aboutTitle.innerHTML = '<span class="typing-text"></span><span class="typing-cursor">|</span>';
        
        const typingText = aboutTitle.querySelector('.typing-text');
        const cursor = aboutTitle.querySelector('.typing-cursor');
        
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    if (cursor) cursor.style.display = 'none';
                }, 1000);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }

    // Project Filtering System
    setTimeout(function() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projects = document.querySelectorAll('.project[data-tags]');
        
        if (filterButtons.length > 0 && projects.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (this.classList.contains('disabled') || this.disabled) {
                        return;
                    }
                    const filter = this.getAttribute('data-filter');
                    
                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Filter projects with pipe-delimited tags
                    projects.forEach(project => {
                        const projectTags = project.getAttribute('data-tags').toLowerCase();
                        const tagsArray = projectTags.split('|');
                        const shouldShow = filter === 'all' || tagsArray.includes(filter.toLowerCase());
                        
                        if (shouldShow) {
                            project.style.display = 'block';
                            project.style.opacity = '1';
                        } else {
                            project.style.display = 'none';
                            project.style.opacity = '0';
                        }
                    });
                    
                    // Re-apply alternating layout to visible projects only
                    updateAlternatingLayout();
                });
            });
        }
    }, 500);
    
    // Function to update alternating layout for visible projects
    function updateAlternatingLayout() {
        const allProjects = document.querySelectorAll('.project[data-tags]');
        const visibleProjects = Array.from(allProjects).filter(project => 
            project.style.display !== 'none' && 
            getComputedStyle(project).display !== 'none'
        );
        
        // Remove existing layout classes
        allProjects.forEach(project => {
            project.classList.remove('layout-left', 'layout-right');
        });
        
        // Apply alternating layout to visible projects
        visibleProjects.forEach((project, index) => {
            if (index % 2 === 0) {
                project.classList.add('layout-left');
            } else {
                project.classList.add('layout-right');
            }
        });
    }
    
    // Function to clear filters and show all projects
    function clearFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projects = document.querySelectorAll('.project[data-tags]');
        
        // Reset to "All" filter
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
        
        // Show all projects
        projects.forEach(project => {
            project.style.display = 'block';
            project.style.opacity = '1';
        });
        
        // Update layout
        updateAlternatingLayout();
    }
    
    // Initial layout setup
    setTimeout(updateAlternatingLayout, 600);
}); 