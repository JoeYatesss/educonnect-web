import { getAllPosts } from '@/lib/blog';
import { BlogHero } from '@/components/marketing/blog/BlogHero';
import { BlogCard } from '@/components/marketing/blog/BlogCard';
import { Newsletter } from '@/components/marketing/blog/Newsletter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - EduConnect',
  description: 'Insights, tips, and stories from international teachers living and working in China',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  // Group posts by category for filtering (optional enhancement)
  const categories = Array.from(new Set(posts.map(post => post.category)));

  return (
    <div className="min-h-screen pt-20">
      <BlogHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category filter - optional future enhancement */}
        {/* <div className="flex flex-wrap gap-3 mb-8">
          <button className="px-4 py-2 rounded-lg bg-brand-red text-white font-medium">
            All Posts
          </button>
          {categories.map(category => (
            <button key={category} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              {category}
            </button>
          ))}
        </div> */}

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Newsletter signup */}
        <Newsletter />
      </div>
    </div>
  );
}
