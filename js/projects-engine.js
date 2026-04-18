/**
 * Projects Engine - Dynamic Loader
 * Reads from data/projects.json and renders filtered cards
 */

async function loadDynamicProjects(targetCategory = 'all') {
    const container = document.querySelector('.projects-grid') || document.getElementById('projectsContainer');
    if (!container) return;

    try {
        const response = await fetch('./data/projects.json');
        
        if (!response.ok) {
            throw new Error(`Data fetch failed: ${response.status}`);
        }

        const projects = await response.json();

        // Filter projects based on page category
        const filteredProjects = targetCategory === 'all' 
            ? projects 
            : projects.filter(p => p.category === targetCategory);

        // Clear placeholder
        container.innerHTML = '';

        if (filteredProjects.length === 0) {
            container.innerHTML = '<p class="mono" style="grid-column: 1/-1; text-align: center;">No projects deployed in this sector yet.</p>';
            return;
        }

        // Render Cards
        filteredProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'card reveal';
            card.innerHTML = `
                <div class="card-img-wrap">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='https://placehold.jp/24/0f0f15/ffffff/400x250.png?text=Preview'">
                </div>
                <div class="card-content">
                    <div class="card-tags">
                        <span class="tag">${project.technologies.split(',')[0]}</span>
                    </div>
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-desc">${project.description}</p>
                    <div class="card-footer">
                        <div class="technologies-icons">
                            <span class="mono" style="font-size: 0.7rem; color: var(--text-dim)">${project.technologies}</span>
                        </div>
                        <div class="card-actions">
                            <a href="${project.github}" target="_blank" class="action-btn" title="View Source"><i class="fab fa-github"></i></a>
                            <a href="${project.demo}" target="_blank" class="action-btn" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // Re-initialize ScrollReveal or any animations if needed
        if (typeof initScrollReveal === 'function') initScrollReveal();

    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = '<p class="mono" style="color:#ef4444">Critical Error: Unable to fetch local data matrix.</p>';
    }
}
