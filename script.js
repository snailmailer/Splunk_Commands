// DOM Elements
const searchInput = document.getElementById('searchInput');
const commandsContainer = document.getElementById('commandsContainer');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentCategory = 'all';
let searchTerm = '';

// Initialize the app
function init() {
    renderCommands(splunkCommands);
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        filterAndRenderCommands();
    });

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Update current category
            currentCategory = e.target.dataset.category;
            filterAndRenderCommands();
        });
    });
}

// Filter and render commands based on current filters
function filterAndRenderCommands() {
    let filteredCommands = splunkCommands;

    // Filter by category
    if (currentCategory !== 'all') {
        filteredCommands = filteredCommands.filter(cmd => cmd.category === currentCategory);
    }

    // Filter by search term
    if (searchTerm) {
        filteredCommands = filteredCommands.filter(cmd => {
            return cmd.name.toLowerCase().includes(searchTerm) ||
                cmd.description.toLowerCase().includes(searchTerm) ||
                cmd.category.toLowerCase().includes(searchTerm) ||
                cmd.usage.some(u => u.toLowerCase().includes(searchTerm)) ||
                cmd.examples.some(ex => ex.toLowerCase().includes(searchTerm));
        });
    }

    renderCommands(filteredCommands);
}

// Render commands to the DOM
function renderCommands(commands) {
    if (commands.length === 0) {
        commandsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-secondary);">
                <h2 style="font-size: 2rem; margin-bottom: 1rem;">No commands found</h2>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    commandsContainer.innerHTML = commands.map(cmd => createCommandCard(cmd)).join('');

    // Add stagger animation
    const cards = commandsContainer.querySelectorAll('.command-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s both`;
    });
}

// Create a command card HTML
function createCommandCard(command) {
    const categoryColors = {
        search: '#2979ff',
        statistical: '#00c853',
        reporting: '#ff6d00',
        transforming: '#7c4dff',
        field: '#00bcd4',
        time: '#ff4081'
    };

    const categoryColor = categoryColors[command.category] || '#7c4dff';

    return `
        <div class="command-card" data-category="${command.category}">
            <div class="command-header">
                <h2 class="command-name">${command.name}</h2>
                <span class="category-badge" style="background: ${categoryColor}20; border-color: ${categoryColor}; color: ${categoryColor};">
                    ${command.category}
                </span>
            </div>
            
            <p class="command-description">${command.description}</p>
            
            <div class="command-section">
                <h3 class="section-title">📝 Formula</h3>
                <div class="formula-box">${escapeHtml(command.formula)}</div>
            </div>
            
            <div class="command-section">
                <h3 class="section-title">💡 Usage</h3>
                <ul class="usage-list">
                    ${command.usage.map(use => `<li>${use}</li>`).join('')}
                </ul>
            </div>
            
            <div class="command-section">
                <h3 class="section-title">🔧 Examples</h3>
                ${command.examples.map(ex => `<div class="example-box">${escapeHtml(ex)}</div>`).join('')}
            </div>
        </div>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
