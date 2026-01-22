import { getAllPosts, getPostBySlug, BlogPostFull, Citation } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { BlogCTA } from '@/components/marketing/blog/BlogCTA';
import DOMPurify from 'isomorphic-dompurify';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Configure DOMPurify to allow YouTube embeds and citation links
const sanitizeConfig = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src', 'title', 'loading'],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
};

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found - EduConnect',
    };
  }

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  return {
    title: `${title} - EduConnect Blog`,
    description: description,
    keywords: post.metaKeywords?.join(', '),
    openGraph: {
      title: title,
      description: description,
      images: post.image ? [post.image] : [],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: post.image ? [post.image] : [],
    },
  };
}

// Process content to add inline citation links
function processContentWithCitations(content: string, citations?: Citation[]): string {
  if (!citations || citations.length === 0) return content;

  let processedContent = content;

  // Replace citation markers like [1], [2], etc. with linked superscripts
  // This looks for patterns like [1] or [cite:1] in the content
  citations.forEach((citation, index) => {
    const citationNumber = index + 1;
    // Match [1], [cite:1], or [cite-1] patterns
    const patterns = [
      new RegExp(`\\[${citationNumber}\\](?!</a>)`, 'g'),
      new RegExp(`\\[cite:${citationNumber}\\]`, 'g'),
      new RegExp(`\\[cite-${citationNumber}\\]`, 'g'),
    ];

    const replacement = `<sup class="citation-ref"><a href="#cite-${citationNumber}" class="text-brand-red hover:underline" title="${citation.title}">[${citationNumber}]</a></sup>`;

    patterns.forEach((pattern) => {
      processedContent = processedContent.replace(pattern, replacement);
    });
  });

  return processedContent;
}

// Extract YouTube video IDs from content for structured data
function extractYouTubeVideos(content: string): { id: string; title?: string }[] {
  const videos: { id: string; title?: string }[] = [];

  // Match YouTube iframe embeds
  const iframeRegex = /<iframe[^>]*src=["'](?:https?:)?\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)[^"']*["'][^>]*(?:title=["']([^"']*)["'])?[^>]*>/gi;

  let match;
  while ((match = iframeRegex.exec(content)) !== null) {
    videos.push({
      id: match[1],
      title: match[2] || undefined,
    });
  }

  // Also match youtube-nocookie.com embeds
  const nocookieRegex = /<iframe[^>]*src=["'](?:https?:)?\/\/(?:www\.)?youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)[^"']*["'][^>]*(?:title=["']([^"']*)["'])?[^>]*>/gi;

  while ((match = nocookieRegex.exec(content)) !== null) {
    videos.push({
      id: match[1],
      title: match[2] || undefined,
    });
  }

  return videos;
}

// Generate JSON-LD structured data for SEO/AEO
function generateStructuredData(post: BlogPostFull, formattedDate: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://educonnect.com';

  // Base article schema
  const articleSchema: any = {
    '@context': 'https://schema.org',
    '@type': post.schemaType === 'HowTo' ? 'HowToArticle' : 'Article',
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    image: post.image ? `${baseUrl}${post.image}` : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'EduConnect',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  };

  // Add citations to article schema if present
  if (post.citations && post.citations.length > 0) {
    articleSchema.citation = post.citations.map((citation) => ({
      '@type': 'WebPage',
      name: citation.title,
      url: citation.url,
    }));
  }

  // FAQ Schema for AEO (Answer Engine Optimization)
  let faqSchema = null;
  if (post.faqSchema && post.faqSchema.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqSchema.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  };

  // Video schema for YouTube embeds
  const videos = extractYouTubeVideos(post.content);
  let videoSchemas: any[] = [];
  if (videos.length > 0) {
    videoSchemas = videos.map((video) => ({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: video.title || `Video in ${post.title}`,
      description: post.excerpt,
      thumbnailUrl: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
      uploadDate: post.date,
      contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
      embedUrl: `https://www.youtube.com/embed/${video.id}`,
    }));
  }

  return { articleSchema, faqSchema, breadcrumbSchema, videoSchemas };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const { articleSchema, faqSchema, breadcrumbSchema, videoSchemas } = generateStructuredData(post, formattedDate);

  // Process content to add inline citation links
  const processedContent = processContentWithCitations(post.content, post.citations);
  const sanitizedContent = DOMPurify.sanitize(processedContent, sanitizeConfig);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {videoSchemas.map((videoSchema, index) => (
        <script
          key={`video-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      ))}

      <article className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/blog" className="text-brand-red hover:underline text-sm">
              ← Back to Blog
            </Link>
          </nav>

          {/* Article content with padding */}
          <div className="px-4 md:px-20">
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {post.excerpt}
            </p>

            {/* TL;DR Section */}
            {post.tldr && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-lg">
                <h2 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-2">
                  TL;DR
                </h2>
                <p className="text-amber-900 leading-relaxed">
                  {post.tldr}
                </p>
              </div>
            )}

            {/* Featured image */}
            {post.image && (
              <div className="relative max-w-2xl mx-auto mb-10 overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  width={672}
                  height={380}
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>
            )}

            {/* Article content with YouTube embed styling */}
            <div
              className="prose prose-lg max-w-none
                [&>h1:first-child]:hidden
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-4
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-700 prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-brand-red prose-blockquote:pl-4 prose-blockquote:italic
                prose-code:text-brand-red prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100
                prose-img:rounded-lg prose-img:shadow-md
                prose-table:border-collapse prose-table:w-full
                prose-th:bg-gray-100 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:text-left
                prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2
                [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:shadow-lg [&_iframe]:my-8
                [&_.video-container]:relative [&_.video-container]:w-full [&_.video-container]:pb-[56.25%] [&_.video-container]:mb-8
                [&_.video-container_iframe]:absolute [&_.video-container_iframe]:top-0 [&_.video-container_iframe]:left-0 [&_.video-container_iframe]:w-full [&_.video-container_iframe]:h-full
                [&_.citation-ref]:text-xs [&_.citation-ref]:align-super [&_.citation-ref]:ml-0.5"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* FAQ Section for AEO */}
            {post.faqSchema && post.faqSchema.length > 0 && (
              <section className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {post.faqSchema.map((faq, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Posts / Internal Links */}
            {post.internalLinks && post.internalLinks.length > 0 && (
              <section className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Related Articles
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {post.internalLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={`/blog/${link.slug}`}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1 hover:text-brand-red transition-colors">
                        {link.title}
                      </h3>
                      {link.context && (
                        <p className="text-sm text-gray-600">
                          {link.context}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Citations / Sources with anchor IDs for inline references */}
            {post.citations && post.citations.length > 0 && (
              <section className="mt-12 border-t border-gray-200 pt-8" id="references">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Sources & References
                </h2>
                <ol className="space-y-3 list-decimal list-inside">
                  {post.citations.map((citation, index) => (
                    <li
                      key={index}
                      id={`cite-${index + 1}`}
                      className="text-sm text-gray-700 scroll-mt-24"
                    >
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-red hover:underline font-medium"
                      >
                        {citation.title}
                      </a>
                      {citation.type && (
                        <span className="text-gray-500 ml-2 text-xs uppercase bg-gray-100 px-2 py-0.5 rounded">
                          {citation.type}
                        </span>
                      )}
                      {citation.author && (
                        <span className="text-gray-600 ml-2">
                          — {citation.author}
                        </span>
                      )}
                      {citation.date && (
                        <span className="text-gray-500 ml-1">
                          ({citation.date})
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-gray-500 mt-4">
                  Click citation numbers like <sup className="text-brand-red">[1]</sup> in the article to jump to references.
                </p>
              </section>
            )}

            {/* Keywords/Tags */}
            {post.metaKeywords && post.metaKeywords.length > 0 && (
              <section className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {post.metaKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* CTA section */}
            <BlogCTA />
          </div>
        </div>
      </article>
    </>
  );
}
