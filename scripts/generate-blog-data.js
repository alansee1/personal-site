const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'content/blog');
const outputPath = path.join(process.cwd(), 'data/blog.json');

function generateBlogData() {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    console.log('No blog directory found, creating empty blog.json');
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
    return;
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || '',
        description: data.description || '',
        tags: data.tags || [],
        published: data.published ?? true,
        content: content, // Include the markdown content
      };
    })
    // Sort by date (newest first)
    .sort((a, b) => {
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    });

  // Write to data/blog.json
  fs.writeFileSync(outputPath, JSON.stringify(allPosts, null, 2));
  console.log(`✓ Generated blog.json with ${allPosts.length} posts`);
}

generateBlogData();
