// Fetch blog posts from API instead of MDX files

// SEO/AEO types
export interface FAQItem {
  question: string;
  answer: string;
}

export interface Citation {
  title: string;
  url: string;
  type?: string; // research, website, video
  author?: string;
  date?: string;
}

export interface InternalLink {
  slug: string;
  title: string;
  context?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  imageAlt?: string;
  author: string;
}

export interface BlogPostFull extends BlogPost {
  content: string;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  // AEO/SEO enhancement fields
  tldr?: string;
  faqSchema?: FAQItem[];
  schemaType?: string;
  citations?: Citation[];
  internalLinks?: InternalLink[];
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
      imageAlt: post.featured_image_alt || '',
      author: post.author || 'EduConnect Team',
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostFull | null> {
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
      imageAlt: post.featured_image_alt || '',
      author: post.author || 'EduConnect Team',
      // SEO fields
      metaTitle: post.meta_title || undefined,
      metaDescription: post.meta_description || undefined,
      metaKeywords: post.meta_keywords || undefined,
      // AEO/SEO enhancement fields
      tldr: post.tldr || undefined,
      faqSchema: post.faq_schema || undefined,
      schemaType: post.schema_type || 'Article',
      citations: post.citations || undefined,
      internalLinks: post.internal_links || undefined,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
