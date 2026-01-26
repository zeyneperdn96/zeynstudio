/* ========================================
   PROJECTS DATA
   Projects with case studies
   ======================================== */

const projectsData = [
    {
        id: 1,
        title: 'METBİC',
        category: 'industrial',
        thumbnail: 'assets/projects/metbic/hero.png',
        description: 'Compact Modular Bicycle Repair Kit',
        featured: true,
        year: '2026',
        role: 'Product Designer (Research, Sketching, 3D Modeling)',
        caseStudy: {
            hero: 'assets/projects/metbic/hero.png',
            intro: 'METBİC is a pocket-sized, all-in-one repair kit designed for mountain bikers. It solves the problem of carrying bulky tools by condensing essential maintenance functions into a 90mm x 60mm modular unit.',
            challenge: 'Professional mountain bikers often face mechanical failures like chain breaks or tire punctures on the trail. User research with personas like "Mehmet" (a 40-year-old pro cyclist) revealed that carrying multiple standalone tools disrupts the riding experience and takes up too much space. The goal was to design a tool that is both comprehensive and compact.',
            solution: 'METBİC transforms from a compact box into a fully functional workshop. Dimensions: It measures just 90mm x 60mm x 30mm when closed, fitting easily into a pocket. Modular Tools: The kit includes a specialized tire lever, a rim straightener, a double-sided file, and a wrench. Versatility: It features a magnetic screwdriver slot with 6 interchangeable heads and a secure compartment for spare screws and hexagonal nuts (8mm, 10mm, 15mm).',
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
                <div style="padding: 20px; text-align: center;">
                    <h2>${project.title}</h2>
                    <p>${project.description}</p>
                    <p style="color: #888; margin-top: 20px;">Case study coming soon...</p>
                </div>
            `;
        }

        const cs = project.caseStudy;
        return `
            <div class="case-study" style="max-height: 70vh; overflow-y: auto; padding: 0;">
                <!-- Hero Image -->
                <div style="width: 100%; height: 200px; background: url('${cs.hero}') center/cover no-repeat; border-bottom: 2px solid #808080;"></div>

                <!-- Header -->
                <div style="padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff;">
                    <h1 style="margin: 0; font-size: 24px;">${project.title}</h1>
                    <p style="margin: 5px 0 0; color: #00d4ff; font-size: 14px;">${project.description}</p>
                    <div style="margin-top: 10px; font-size: 12px; color: #888;">
                        <span style="margin-right: 15px;">📅 ${project.year}</span>
                        <span>👤 ${project.role}</span>
                    </div>
                </div>

                <!-- Introduction -->
                <div style="padding: 20px; background: #f5f5f5; border-bottom: 1px solid #ddd;">
                    <h3 style="margin: 0 0 10px; color: #333; font-size: 14px;">📋 Introduction</h3>
                    <p style="margin: 0; color: #555; line-height: 1.6; font-size: 13px;">${cs.intro}</p>
                </div>

                <!-- Challenge -->
                <div style="padding: 20px; background: #fff3cd; border-bottom: 1px solid #ddd;">
                    <h3 style="margin: 0 0 10px; color: #856404; font-size: 14px;">⚠️ The Challenge</h3>
                    <p style="margin: 0; color: #856404; line-height: 1.6; font-size: 13px;">${cs.challenge}</p>
                </div>

                <!-- Solution -->
                <div style="padding: 20px; background: #d4edda; border-bottom: 1px solid #ddd;">
                    <h3 style="margin: 0 0 10px; color: #155724; font-size: 14px;">✅ The Solution</h3>
                    <p style="margin: 0; color: #155724; line-height: 1.6; font-size: 13px;">${cs.solution}</p>
                </div>

                <!-- Context Image -->
                ${cs.images.context ? `
                <div style="padding: 20px; background: #fff; border-bottom: 1px solid #ddd;">
                    <h3 style="margin: 0 0 10px; color: #333; font-size: 14px;">🚴 In Use</h3>
                    <img src="${cs.images.context}" alt="Context" style="width: 100%; border-radius: 8px; border: 1px solid #ddd;">
                </div>
                ` : ''}

                <!-- Renders -->
                <div style="padding: 20px; background: #f8f9fa; border-bottom: 1px solid #ddd;">
                    <h3 style="margin: 0 0 10px; color: #333; font-size: 14px;">🎨 Product Renders</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        ${cs.images.render1 ? `<img src="${cs.images.render1}" alt="Render 1" style="width: 100%; border-radius: 8px; border: 1px solid #ddd;">` : ''}
                        ${cs.images.render2 ? `<img src="${cs.images.render2}" alt="Render 2" style="width: 100%; border-radius: 8px; border: 1px solid #ddd;">` : ''}
                    </div>
                </div>

                <!-- Technical Specs -->
                <div style="padding: 20px; background: #e2e3e5; border-bottom: 1px solid #ddd;">
                    <h3 style="margin: 0 0 10px; color: #333; font-size: 14px;">📐 Technical Specifications</h3>
                    <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #ccc;">
                            <td style="padding: 8px 0; font-weight: bold; color: #555;">Material</td>
                            <td style="padding: 8px 0; color: #333;">${cs.specs.material}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #ccc;">
                            <td style="padding: 8px 0; font-weight: bold; color: #555;">Size</td>
                            <td style="padding: 8px 0; color: #333;">${cs.specs.size}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #555;">Components</td>
                            <td style="padding: 8px 0; color: #333;">${cs.specs.components}</td>
                        </tr>
                    </table>
                </div>

                <!-- Technical Drawing -->
                ${cs.images.technical ? `
                <div style="padding: 20px; background: #fff;">
                    <h3 style="margin: 0 0 10px; color: #333; font-size: 14px;">📏 Technical Drawing</h3>
                    <img src="${cs.images.technical}" alt="Technical Drawing" style="width: 100%; border-radius: 8px; border: 1px solid #ddd;">
                </div>
                ` : ''}
            </div>
        `;
    }
}

window.ProjectsManager = ProjectsManager;
window.projectsData = projectsData;
