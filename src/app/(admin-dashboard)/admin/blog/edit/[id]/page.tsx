'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { API_URL } from '@/lib/constants';

// Lazy load RichTextEditor to reduce initial bundle size (~200KB Tiptap library)
const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor').then(mod => mod.RichTextEditor),
  {
    loading: () => (
      <div className="min-h-[300px] border border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    ),
    ssr: false,
  }
);

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  slug: z.string().min(1, 'Slug is required').max(255),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  author: z.string().default('EduConnect Team'),
  featured_image: z.string().url().optional().or(z.literal('')),
  is_published: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function EditBlogPostPage() {
  const { adminUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [content, setContent] = useState('');
  const [contentJson, setContentJson] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    if (!authLoading && !adminUser) {
      router.push('/login');
    } else if (adminUser && postId) {
      fetchPost();
    }
  }, [adminUser, authLoading, postId, router]);

  const fetchPost = async () => {
    try {
      const { data: { session } } = await (await import('@/lib/supabase/client')).createClient().auth.getSession();
      const token = session?.access_token || '';

      const response = await fetch(
        `${API_URL}/api/v1/blog/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch blog post');

      const post = await response.json();

      // Populate form fields
      setValue('title', post.title);
      setValue('slug', post.slug);
      setValue('excerpt', post.excerpt || '');
      setValue('category', post.category || '');
      setValue('author', post.author);
      setValue('featured_image', post.featured_image || '');
      setValue('is_published', post.is_published);

      // Set editor content
      setContent(post.content || '');
      setContentJson(post.content_json);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      alert('Failed to load blog post. Redirecting to blog list...');
      router.push('/admin/blog');
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    if (!content) {
      alert('Content is required');
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await (await import('@/lib/supabase/client')).createClient().auth.getSession();
      const token = session?.access_token || '';

      const payload = {
        ...data,
        content,
        content_json: contentJson,
      };

      const response = await fetch(`${API_URL}/api/v1/blog/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update blog post');
      }

      alert('Blog post updated successfully!');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Failed to save blog post:', error);
      alert(error instanceof Error ? error.message : 'Failed to save blog post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                {...register('title')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter blog post title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL Slug *
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  /blog/
                </span>
                <input
                  type="text"
                  {...register('slug')}
                  className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="url-friendly-slug"
                />
              </div>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Excerpt
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Brief summary for preview cards..."
              />
            </div>

            {/* Category & Author */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  {...register('category')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Teaching Tips"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  {...register('author')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Featured Image URL
              </label>
              <input
                type="text"
                {...register('featured_image')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://example.com/image.jpg"
              />
              {errors.featured_image && (
                <p className="mt-1 text-sm text-red-600">{errors.featured_image.message}</p>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                content={content}
                onChange={(html, json) => {
                  setContent(html);
                  setContentJson(json);
                }}
                placeholder="Start writing your blog post..."
              />
            </div>

            {/* Published Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('is_published')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Published
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Update Blog Post'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/blog')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
