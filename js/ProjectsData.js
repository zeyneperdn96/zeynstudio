/* ========================================
   PROJECTS DATA
   Projects with case studies
   ======================================== */

const projectsData = [
    {
        id: 1,
        title: 'METBIC',
        category: 'industrial',
        thumbnail: 'assets/projects/metbic/hero.png',
        description: 'Compact Modular Bicycle Repair Kit',
        featured: true,
        year: '2026',
        role: 'Product Designer (Research, Sketching, 3D Modeling)',
        caseStudy: {
            hero: 'assets/projects/metbic/hero.png',
            intro: 'METBIC is a pocket-sized, all-in-one repair kit designed for mountain bikers. It solves the problem of carrying bulky tools by condensing essential maintenance functions into a 90mm x 60mm modular unit.',
            challenge: 'Professional mountain bikers often face mechanical failures like chain breaks or tire punctures on the trail. User research with personas like "Mehmet" (a 40-year-old pro cyclist) revealed that carrying multiple standalone tools disrupts the riding experience and takes up too much space. The goal was to design a tool that is both comprehensive and compact.',
            solution: 'METBIC transforms from a compact box into a fully functional workshop. Dimensions: It measures just 90mm x 60mm x 30mm when closed, fitting easily into a pocket. Modular Tools: The kit includes a specialized tire lever, a rim straightener, a double-sided file, and a wrench. Versatility: It features a magnetic screwdriver slot with 6 interchangeable heads and a secure compartment for spare screws and hexagonal nuts (8mm, 10mm, 15mm).',
            specs: {
                material: 'Durable Polymer Casing with Metal Tools',
                size: '9cm (H) x 6cm (W)',
                components: '6 Screwdriver bits, Tire Lever, Wrench, File, Rim Straightener'
            },
            images: {
                context: 'assets/projects/metbic/context.png',
                render1: 'assets/projects/metbic/render1.png',
                render2: 'assets/projects/metbic/render2.png',
                technical: 'assets/projects/metbic/technical.png'
            }
        }
    },
    {
        id: 2,
        title: 'Mobile Banking App',
        category: 'ui-ux',
        thumbnail: 'assets/projects/project-1.jpg',
        description: 'Modern banking interface with intuitive UX',
        featured: true
    },
    {
        id: 3,
        title: 'Creative Studio Illustrations',
        category: 'illustration',
        thumbnail: 'assets/projects/project-2.jpg',
        description: 'Character designs and digital art',
        featured: true
    },
    {
        id: 4,
        title: 'Smart Home Product',
        category: 'industrial',
        thumbnail: 'assets/projects/project-3.jpg',
        description: 'IoT device industrial design',
        featured: false
    },
    {
        id: 5,
        title: 'E-commerce Dashboard',
        category: 'ui-ux',
        thumbnail: 'assets/projects/project-4.jpg',
        description: 'Analytics and admin interface'
    },
    {
        id: 6,
        title: 'Brand Identity System',
        category: 'illustration',
        thumbnail: 'assets/projects/project-5.jpg',
        description: 'Logo and visual identity design'
    },
    {
        id: 7,
        title: 'Ergonomic Chair Design',
        category: 'industrial',
        thumbnail: 'assets/projects/project-6.jpg',
        description: 'Modern furniture design concept'
    },
    {
        id: 8,
        title: 'Health Tracking App',
        category: 'ui-ux',
        thumbnail: 'assets/projects/project-7.jpg',
        description: 'Wellness and fitness tracker UI'
    },
    {
        id: 9,
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
            <div class="project-card" data-project-id="${project.id}" style="cursor: pointer;">
                <div class="project-thumbnail" style="background: url('${project.thumbnail}') center/cover no-repeat, linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100px;"></div>
                <div class="project-info">
                    <div class="project-title">${project.title}</div>
                    <div class="project-category">${this.getCategoryLabel(project.category)}</div>
                </div>
            </div>
        `).join('');
    }

    getProjectById(id) {
        return this.projects.find(p => p.id === parseInt(id));
    }

    renderCaseStudyHTML(project) {
        if (!project.caseStudy) {
            return `
                <div style="padding: 40px; text-align: center; background: #f5f5f5;">
                    <h2 style="margin: 0 0 10px; color: #333;">${project.title}</h2>
                    <p style="color: #666;">${project.description}</p>
                    <p style="color: #999; margin-top: 20px; font-style: italic;">Case study coming soon...</p>
                </div>
            `;
        }

        const cs = project.caseStudy;
        return `
            <div class="case-study" style="max-height: 70vh; overflow-y: auto; padding: 0; background: #fff;">

                <!-- Hero Section -->
                <div style="background: #1a1a2e; padding: 30px; text-align: center;">
                    <img src="${cs.hero}" alt="${project.title}" style="max-width: 100%; max-height: 280px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                </div>

                <!-- Title & Info -->
                <div style="padding: 24px 30px; background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%); color: #fff;">
                    <h1 style="margin: 0; font-size: 22px; font-weight: 600;">${project.title}</h1>
                    <p style="margin: 8px 0 0; color: #3498db; font-size: 14px; font-weight: 500;">${project.description}</p>
                    <div style="margin-top: 12px; font-size: 12px; color: rgba(255,255,255,0.6); display: flex; gap: 20px;">
                        <span>${project.year}</span>
                        <span>${project.role}</span>
                    </div>
                </div>

                <!-- Overview -->
                <div style="padding: 24px 30px; background: #fff; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0 0 12px; color: #2c3e50; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Overview</h3>
                    <p style="margin: 0; color: #555; line-height: 1.7; font-size: 13px;">${cs.intro}</p>
                </div>

                <!-- Solution -->
                <div style="padding: 24px 30px; background: #f8fffe; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0 0 12px; color: #2c3e50; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Solution</h3>
                    <p style="margin: 0; color: #555; line-height: 1.7; font-size: 13px;">${cs.solution}</p>
                </div>

                <!-- Product Gallery -->
                <div style="padding: 24px 30px; background: #fafafa; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0 0 16px; color: #2c3e50; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Product Gallery</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        ${cs.images.render1 ? `<img src="${cs.images.render1}" alt="Render" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; border: 1px solid #e0e0e0;">` : ''}
                        ${cs.images.render2 ? `<img src="${cs.images.render2}" alt="Render" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; border: 1px solid #e0e0e0;">` : ''}
                        ${cs.images.context ? `<img src="${cs.images.context}" alt="Context" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; border: 1px solid #e0e0e0;">` : ''}
                        ${cs.images.technical ? `<img src="${cs.images.technical}" alt="Technical" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; border: 1px solid #e0e0e0;">` : ''}
                    </div>
                </div>

                <!-- Specifications -->
                <div style="padding: 24px 30px; background: #fff;">
                    <h3 style="margin: 0 0 16px; color: #2c3e50; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Specifications</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                        <div style="background: #f5f5f5; padding: 16px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 6px;">Material</div>
                            <div style="font-size: 12px; color: #333; font-weight: 500;">${cs.specs.material}</div>
                        </div>
                        <div style="background: #f5f5f5; padding: 16px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 6px;">Size</div>
                            <div style="font-size: 12px; color: #333; font-weight: 500;">${cs.specs.size}</div>
                        </div>
                        <div style="background: #f5f5f5; padding: 16px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 6px;">Components</div>
                            <div style="font-size: 12px; color: #333; font-weight: 500;">${cs.specs.components}</div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }
}

window.ProjectsManager = ProjectsManager;
window.projectsData = projectsData;
// Cache bust Mon, Jan 26, 2026 11:39:10 PM
