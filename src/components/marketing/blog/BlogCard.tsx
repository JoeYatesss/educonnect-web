import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.image && (
          <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-3 text-sm mb-4">
            <time dateTime={post.date} className="text-gray-600">{formattedDate}</time>
            <span className="text-brand-red font-medium">
              {post.category}
            </span>
          </div>

          <h3 className="font-montserrat text-xl font-semibold text-gray-900 mb-3 leading-snug line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3 text-[0.95rem]">
            {post.excerpt}
          </p>

          <div className="flex items-center text-brand-red font-medium group/link">
            <span>Read more</span>
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
