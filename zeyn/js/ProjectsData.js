/* ========================================
   PROJECTS DATA
   8 placeholder projects with categories
   ======================================== */

const projectsData = [
    {
        id: 1,
        title: 'Mobile Banking App',
        category: 'ui-ux',
        thumbnail: 'assets/projects/project-1.jpg',
        description: 'Modern banking interface with intuitive UX',
        featured: true
    },
    {
        id: 2,
        title: 'Creative Studio Illustrations',
        category: 'illustration',
        thumbnail: 'assets/projects/project-2.jpg',
        description: 'Character designs and digital art',
        featured: true
    },
    {
        id: 3,
        title: 'Smart Home Product',
        category: 'industrial',
        thumbnail: 'assets/projects/project-3.jpg',
        description: 'IoT device industrial design',
        featured: true
    },
    {
        id: 4,
        title: 'E-commerce Dashboard',
        category: 'ui-ux',
        thumbnail: 'assets/projects/project-4.jpg',
        description: 'Analytics and admin interface'
    },
    {
        id: 5,
        title: 'Brand Identity System',
        category: 'illustration',
        thumbnail: 'assets/projects/project-5.jpg',
        description: 'Logo and visual identity design'
    },
    {
        id: 6,
        title: 'Ergonomic Chair Design',
        category: 'industrial',
        thumbnail: 'assets/projects/project-6.jpg',
        description: 'Modern furniture design concept'
    },
    {
        id: 7,
        title: 'Health Tracking App',
        category: 'ui-ux',
        thumbnail: 'assets/projects/project-7.jpg',
        description: 'Wellness and fitness tracker UI'
    },
    {
        id: 8,
        title: 'Portable Speaker',
        category: 'industrial',
        thumbnail: 'assets/projects/project-8.jpg',
        description: 'Bluetooth speaker product design'
    }
];

class ProjectsManager {
    constructor() {
        this.projects = projectsData;
        this.currentFilter = 'all';
    }

    filterByCategory(category) {
        this.currentFilter = category;
        if (category === 'all') {
            return this.projects;
        }
        return this.projects.filter(project => project.category === category);
    }

    getCategoryLabel(category) {
        const labels = {
            'ui-ux': 'UI/UX',
            'illustration': 'Illustration',
            'industrial': 'Industrial Design'
        };
        return labels[category] || category;
    }

    renderProjectsHTML(category = 'all') {
        const filtered = this.filterByCategory(category);
        return filtered.map(project => `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-thumbnail" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100px;"></div>
                <div class="project-info">
                    <div class="project-title">${project.title}</div>
                    <div class="project-category">${this.getCategoryLabel(project.category)}</div>
                </div>
            </div>
        `).join('');
    }
}

window.ProjectsManager = ProjectsManager;
window.projectsData = projectsData;
