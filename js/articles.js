/**
 * Articles Data Schema:
 * {
 *   title: string - The title of the article
 *   tags: string[] - Array of tags/categories for the article
 *   created_at: string - Date in format "YYYY-MM-DD" or "Month DD, YYYY"
 *   link: string - URL to the article (can be relative or absolute)
 * }
 */

// Articles data array
const articles = [
    // Add your articles here following the schema above
    // Example:
    // {
    //     title: "Building Scalable AI Agents with OpenAI",
    //     tags: ["AI", "Backend", "OpenAI"],
    //     created_at: "2024-01-15",
    //     link: "/articles/building-scalable-ai-agents"
    // },
];

/**
 * Format date string to a more readable format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date like "January 15, 2024"
 */
function formatDate(dateString) {
    // If already in readable format, return as is
    if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
    }

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Create HTML for a single article list item
 * @param {Object} article - Article object with title, tags, created_at, and link
 * @returns {string} HTML string for the article list item
 */
function createArticleCard(article) {
    const tagsHTML = article.tags
        .map(tag => `<span class="article-tag">${tag}</span>`)
        .join('');

    return `
    <li>
      <a href="${article.link}" class="article-link">
        <span class="article-title">${article.title}</span>
        <span class="article-date">(${formatDate(article.created_at)})</span>
        <span class="article-tags">${tagsHTML}</span>
      </a>
    </li>
  `;
}

/**
 * Create HTML for empty state when there are no articles
 * @returns {string} HTML string for empty state
 */
function createEmptyState() {
    return `
    <div class="empty-state">
      <h2 class="empty-state-title">Nothing to serve yet!</h2>
      <p class="empty-state-message">
        Ashish is busy cooking some articles. They'll be served hot and fresh soon. 
        
      </p>
    </div>
  `;
}

/**
 * Render articles to the DOM
 * This function is called when the page loads
 */
function renderArticles() {
    const articlesContainer = document.getElementById('articles-list');

    if (!articlesContainer) {
        console.error('Articles container not found');
        return;
    }

    // Check if there are any articles
    if (articles.length === 0) {
        articlesContainer.innerHTML = createEmptyState();
        return;
    }

    // Sort articles by date (newest first)
    const sortedArticles = [...articles].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
    });

    // Render all articles as a list
    const articlesHTML = sortedArticles
        .map(article => createArticleCard(article))
        .join('');

    articlesContainer.innerHTML = `<ul class="articles-list">${articlesHTML}</ul>`;
}

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { articles, renderArticles, formatDate };
}
