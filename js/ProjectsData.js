/* ========================================
   PROJECTS DATA
   Projects with case studies
   ======================================== */

const projectsData = [
    {
        id: 14,
        title: 'DESIGNER QUEST',
        category: 'game-ui',
        thumbnail: 'assets/games/designer-quest/tiles/trophy.png',
        thumbnailSize: 'contain',
        thumbnailBg: 'linear-gradient(135deg, #4a9bf0 0%, #7ec0ff 100%)',
        description: 'Playable Pixel Platformer — Level Up Your Portfolio',
        featured: true,
        year: '2026',
        role: 'Game UI Designer & Developer (Pixel UI, HUD, Gameplay Code)',
        externalLink: 'designer-quest.html'
    },
    {
        id: 10,
        title: 'STELLAR VANGUARD',
        category: 'game-ui',
        thumbnail: null,
        thumbnailIcon: '🚀',
        thumbnailBg: 'radial-gradient(circle at 30% 20%, #00d9ff22 0%, transparent 40%), linear-gradient(135deg, #060a24 0%, #141452 55%, #2a0a4e 100%)',
        description: 'Sci-Fi Pilot Select Screen — Interactive Game UI',
        featured: true,
        year: '2026',
        role: 'Game UI Designer (UI Design, Front-End Implementation)',
        externalLink: 'character-select.html'
    },
    {
        id: 11,
        title: 'NEON DECK',
        category: 'game-ui',
        thumbnail: null,
        thumbnailIcon: '🃏',
        thumbnailBg: 'radial-gradient(circle at 70% 30%, #ff00aa22 0%, transparent 45%), linear-gradient(135deg, #1a0030 0%, #3a0a5e 50%, #ff1493 100%)',
        description: 'Cyberpunk RPG Card Battle UI',
        featured: true,
        year: '2026',
        role: 'Game UI Designer (Card System, UI Design, Front-End)',
        externalLink: 'cyberpunk-cards.html'
    },
    {
        id: 12,
        title: 'SUPER ZEYNEP WORLD',
        category: 'game-ui',
        thumbnail: null,
        thumbnailIcon: '🍄',
        thumbnailBg: 'radial-gradient(circle at 50% 15%, #ffe06633 0%, transparent 40%), linear-gradient(135deg, #1f8fe0 0%, #4fc3ff 60%, #9be7ff 100%)',
        description: 'Platformer HUD & Gamified Portfolio UX',
        featured: true,
        year: '2026',
        role: 'Game UI Designer (HUD, Quest System, Front-End)',
        externalLink: 'super-zeynep-world.html'
    },
    {
        id: 13,
        title: 'Games.exe',
        category: 'game-ui',
        thumbnail: null,
        thumbnailIcon: '🎮',
        thumbnailBg: 'radial-gradient(circle at 30% 70%, #6d28d955 0%, transparent 45%), linear-gradient(135deg, #0e1a3a 0%, #1e3a8a 55%, #6d28d9 100%)',
        description: 'Playable Arcade Suite — Minesweeper · Snake · Tetris · Pong',
        featured: true,
        year: '2026',
        role: 'Game UI Designer & Developer (Game UI, Gameplay Code)',
        opensWindow: 'games'
    },
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
        title: 'FIREBOX',
        category: 'industrial',
        thumbnail: 'assets/projects/firebox/hero.jpg',
        description: 'Portable Camp & Cooking Station',
        featured: true,
        year: '2025',
        role: 'Product Designer (Research, Sketching, 3D Modeling)',
        caseStudy: {
            hero: 'assets/projects/firebox/hero.jpg',
            intro: 'FIREBOX is a portable, foldable camping fire pit and cooking station designed for outdoor enthusiasts. It transforms from a compact carrying case into a fully functional grill and fire pit, perfect for camping, tailgating, and backyard gatherings.',
            challenge: 'Campers and outdoor enthusiasts struggle with bulky, heavy fire pits that are difficult to transport. Traditional camping grills lack versatility and proper airflow for efficient burning. The goal was to design a lightweight, portable solution that combines fire pit and cooking functionality.',
            solution: 'FIREBOX features an innovative folding mechanism that collapses into a briefcase-like form for easy transport. The modular design includes removable grill grates, heat-resistant silicone handles, and an integrated ash drawer for easy cleanup.',
            specs: {
                material: 'Stainless Steel + Silicone Grips',
                size: 'Compact folded dimensions',
                components: 'Grill Grate, Fire Chamber, Ash Drawer, Folding Panels'
            },
            images: {
                context: 'assets/projects/firebox/context.jpg',
                render1: 'assets/projects/firebox/exploded.jpg',
                render2: 'assets/projects/firebox/inuse.jpg',
                technical: 'assets/projects/firebox/technical.jpg'
            }
        }
    },
    {
        id: 5,
        title: 'GUSTO',
        category: 'industrial',
        thumbnail: 'assets/projects/gusto/hero.png',
        description: 'Personal Air Management Device',
        featured: true,
        year: '2026',
        role: 'Product Designer (Research, Concept Development, 3D Modeling)'
    },
    {
        id: 6,
        title: 'MarineSentry',
        category: 'industrial',
        thumbnail: 'assets/projects/marinesentry/hero.png',
        description: 'Decision-Support Underwater Drone',
        featured: true,
        year: '2026',
        role: 'Product Designer (Research, Concept Development, 3D Modeling)'
    },
    {
        id: 4,
        title: 'FuncArt',
        category: 'industrial',
        thumbnail: 'assets/projects/funcart/hero.png',
        description: 'Modular Ceramic Studio System',
        featured: true,
        year: '2026',
        role: 'Product Designer (Research, Concept Development, 3D Modeling)'
    },
    {
        id: 8,
        title: 'Moodie',
        category: 'ui-ux',
        thumbnail: 'assets/projects/moodie/user-flow.png',
        thumbnailPos: 'center',
        thumbnailSize: 'contain',
        thumbnailBg: '#f8f4f0',
        description: 'Mobile Wellness & Mood Tracking App',
        featured: true,
        year: '2026',
        role: 'UI/UX Designer',
        externalLink: 'moodie-case-study.html'
    },
    {
        id: 9,
        title: 'Pockety',
        category: 'ui-ux',
        thumbnail: 'assets/projects/pockety/dashboard.png',
        thumbnailPos: 'top center',
        thumbnailSize: 'cover',
        description: 'Smart Budget Companion App',
        featured: true,
        year: '2026',
        role: 'UI/UX Designer',
        externalLink: 'pockety-case-study.html'
    },
    {
        id: 7,
        title: 'CoffeeForm',
        category: 'industrial',
        thumbnail: 'assets/projects/coffeeform/hero.png',
        description: 'Sustainable Laptop Stand from Coffee Waste',
        featured: true,
        year: '2026',
        role: 'Product Designer (Concept Development, Material Research, Prototyping, 3D Modeling)',
        caseStudy: {
            hero: 'assets/projects/coffeeform/hero.png',
            intro: 'CoffeeForm is an ergonomic laptop stand made primarily from recycled coffee grounds. Designed as a foldable, flat-pack product, it transforms from a compact surface into a stable stand through tool-free assembly — using only material logic and form.',
            challenge: 'The product was developed as part of a circular design concept for coffee brands. Coffee waste collected from daily consumption is transformed into a long-lasting object, encouraging users to rethink waste, material value, and everyday sustainability.',
            solution: 'CoffeeForm features a foldable, flat-pack structure with tool-free assembly. The user opens the flat surface, removes the rear support piece, inserts it through the front slot, and instantly transforms the product into a stable stand — no instructions, no fasteners needed. The integrated surface provides space for mouse use, and the ergonomic elevation reaches up to 25 cm.',
            specs: {
                material: 'Recycled Coffee Grounds + Wood Chip Composite',
                size: '54.7cm (L) × 22.5cm (W), up to 25cm elevation',
                components: 'Main Body Panel, Rear Leg Piece, Integrated Mouse Surface'
            },
            images: {
                context: 'assets/projects/coffeeform/context.png',
                render1: 'assets/projects/coffeeform/render1.png',
                render2: 'assets/projects/coffeeform/render2.png',
                technical: 'assets/projects/coffeeform/technical.png'
            }
        }
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
            'game-ui': 'Game UI',
            'ui-ux': 'UI/UX',
            'illustration': 'Illustration',
            'industrial': 'Industrial Design'
        };
        return labels[category] || category;
    }

    renderProjectsHTML(category = 'all') {
        const filtered = this.filterByCategory(category);
        return filtered.map(project => {
            const pos = project.thumbnailPos || 'center';
            const size = project.thumbnailSize || 'cover';
            const bg = project.thumbnailBg || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            // Icon-only thumbnail (no image): gradient + centered emoji badge
            const thumbStyle = project.thumbnail
                ? `background: url('${project.thumbnail}') ${pos}/${size} no-repeat, ${bg}; height: 100px;`
                : `background: ${bg}; height: 100px; display: flex; align-items: center; justify-content: center; font-size: 40px;`;
            const thumbContent = project.thumbnail
                ? ''
                : `<span style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));">${project.thumbnailIcon || '🎮'}</span>`;
            return `
            <div class="project-card" data-project-id="${project.id}" style="cursor: pointer;">
                <div class="project-thumbnail" style="${thumbStyle}">${thumbContent}</div>
                <div class="project-info">
                    <div class="project-title">${project.title}</div>
                    <div class="project-category">${this.getCategoryLabel(project.category)}</div>
                </div>
            </div>
        `;
        }).join('');
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
