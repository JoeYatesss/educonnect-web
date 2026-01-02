import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found - EduConnect',
    };
  }

  return {
    title: `${post.title} - EduConnect Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="min-h-screen bg-gray-50">
      {/* Hero section with image */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link href="/blog" className="text-brand-red hover:underline">
              ← Back to Blog
            </Link>
          </nav>

          {/* Meta information */}
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-red/10 text-brand-red">
              {post.category}
            </span>
            <time dateTime={post.date}>{formattedDate}</time>
            <span>•</span>
            <span>{post.author}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Featured image */}
        {post.image && (
          <div className="relative h-[400px] w-full max-w-4xl mx-auto">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* Article content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h1:text-4xl prose-h1:mb-4
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 prose-li:my-2
              prose-blockquote:border-l-4 prose-blockquote:border-brand-red prose-blockquote:pl-4 prose-blockquote:italic
              prose-code:text-brand-red prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-img:rounded-lg prose-img:shadow-md"
          >
            <MDXRemote source={post.content} />
          </div>
        </div>

        {/* Related posts or CTA section */}
        <div className="mt-12 p-8 bg-gradient-to-br from-brand-red to-red-600 rounded-xl text-white text-center">
          <h3 className="text-2xl font-bold mb-3">
            Ready to Start Your Teaching Journey in China?
          </h3>
          <p className="text-lg text-white/90 mb-6">
            Explore our current job opportunities and join thousands of teachers making a difference.
          </p>
          <Link
            href="/jobs"
            className="inline-block px-8 py-3 bg-white text-brand-red rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Available Jobs
          </Link>
        </div>
      </div>
    </article>
  );
}
