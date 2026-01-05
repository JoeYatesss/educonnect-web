// Fetch blog posts from API instead of MDX files

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  author: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/public`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch blog posts');
      return [];
    }

    const data = await response.json();

    // Transform API response to match existing BlogPost interface
    return data.map((post: any) => ({
      slug: post.slug,
      title: post.title,
      date: post.published_at || post.created_at,
      category: post.category || 'Uncategorized',
      excerpt: post.excerpt || '',
      image: post.featured_image || '',
      author: post.author || 'EduConnect Team',
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/public/${slug}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    const post = await response.json();

    return {
      slug: post.slug,
      content: post.content, // HTML content from database
      title: post.title,
      date: post.published_at || post.created_at,
      category: post.category || 'Uncategorized',
      excerpt: post.excerpt || '',
      image: post.featured_image || '',
      author: post.author || 'EduConnect Team',
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
