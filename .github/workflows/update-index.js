const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Function to extract metadata from HTML file
function extractMetadata(htmlContent, filename) {
    const $ = cheerio.load(htmlContent);
    
    // Extract title
    const titleElement = $('title');
    let title = titleElement.length ? titleElement.text().trim() : '';
    
    // If title is empty, try to extract from h1
    if (!title) {
        const h1Element = $('h1');
        title = h1Element.length ? h1Element.text().trim() : '';
    }
    
    // If still empty, generate from filename
    if (!title) {
        title = filename.replace('.html', '').replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Extract description from meta description
    const metaDescription = $('meta[name="description"]');
    let description = metaDescription.length ? metaDescription.attr('content') : '';
    
    // If no meta description, try to find first paragraph
    if (!description) {
        const firstP = $('p');
        description = firstP.length ? firstP.text().trim().substring(0, 150) + '...' : '';
    }
    
    // If still no description, generate a basic one
    if (!description) {
        description = `A useful web tool: ${title}`;
    }
    
    return {
        title,
        description,
        filename
    };
}

// Function to get current date in readable format
function getCurrentDate() {
    const now = new Date();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

// Function to create tool card HTML
function createToolCard(metadata) {
    return `
        <div class="tool-card">
            <h2>${metadata.title}</h2>
            <div class="date">Added: ${getCurrentDate()}</div>
            <p>${metadata.description}</p>
            <a href="${metadata.filename}" class="tool-link">Open Tool</a>
        </div>`;
}

// Main function
async function updateIndex() {
    try {
        // Read current index.html
        const indexPath = 'index.html';
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Parse index.html to extract existing tools
        const $ = cheerio.load(indexContent);
        
        // Get all HTML files in the current directory
        const htmlFiles = fs.readdirSync('.')
            .filter(file => file.endsWith('.html') && file !== 'index.html');
        
        // Extract existing tool filenames from index.html
        const existingTools = [];
        $('.tool-card a.tool-link').each((i, elem) => {
            const href = $(elem).attr('href');
            if (href) {
                existingTools.push(href);
            }
        });
        
        // Find new HTML files not in index
        const newFiles = htmlFiles.filter(file => !existingTools.includes(file));
        
        if (newFiles.length === 0) {
            console.log('No new HTML files found to add to index.');
            return;
        }
        
        console.log(`Found ${newFiles.length} new HTML file(s):`, newFiles);
        
        // Extract metadata from new files and create tool cards
        const newToolCardsHtml = [];
        for (const file of newFiles) {
            try {
                const htmlContent = fs.readFileSync(file, 'utf8');
                const metadata = extractMetadata(htmlContent, file);
                const toolCard = createToolCard(metadata);
                newToolCardsHtml.push(toolCard);
                console.log(`Processed: ${file} -> ${metadata.title}`);
            } catch (error) {
                console.error(`Error processing ${file}:`, error.message);
            }
        }
        
        if (newToolCardsHtml.length === 0) {
            console.log('No valid new tools to add.');
            return;
        }
        
        // Find the closing tag of the tools container and insert new cards before it
        const toolsContainerEndPattern = /(\s*)<\/div>\s*<footer>/;
        const newCardsString = newToolCardsHtml.join('\n');
        
        const updatedContent = indexContent.replace(toolsContainerEndPattern, (match, whitespace) => {
            return `${newCardsString}\n${whitespace}</div>\n\n    <footer>`;
        });
        
        // Write updated index.html
        fs.writeFileSync(indexPath, updatedContent);
        
        console.log(`Successfully added ${newToolCardsHtml.length} new tool(s) to index.html`);
        
    } catch (error) {
        console.error('Error updating index:', error);
        process.exit(1);
    }
}

// Run the update
updateIndex();
