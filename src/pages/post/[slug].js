// pages/post/[slug].js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { format } from 'date-fns';

export default function BlogPost({ post, relatedPosts }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
          <p className="mt-2 text-gray-600">The post you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <a className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">Return to homepage</a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Head>
        <title>{post.title} | TechPulse</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <a className="text-2xl font-bold text-indigo-600">TechPulse</a>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/category/technology">
                  <a className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Technology
                  </a>
                </Link>
                <Link href="/category/smartphones">
                  <a className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Smartphones
                  </a>
                </Link>
                <Link href="/category/laptops">
                  <a className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Laptops
                  </a>
                </Link>
                <Link href="/category/gaming">
                  <a className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Gaming
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-3xl mx-auto">
          {/* Post Header */}
          <div className="mb-8">
            <Link href={`/category/${post.category}`}>
              <a className="text-indigo-600 hover:text-indigo-800 text-sm font-medium uppercase tracking-wider">
                {post.category}
              </a>
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">{post.title}</h1>
            <p className="mt-4 text-lg text-gray-500">{post.excerpt}</p>
            <div className="mt-6 flex items-center">
              <div className="flex-shrink-0">
                <span className="sr-only">{post.author?.name || 'Admin'}</span>
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {(post.author?.name || 'A').charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{post.author?.name || 'Admin'}</p>
                <div className="flex space-x-1 text-sm text-gray-500">
                  <time dateTime={post.createdAt}>
                    {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                  </time>
                  <span aria-hidden="true">&middot;</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}

          {/* Ad placeholder */}
          <div className="py-4 mb-8 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Advertisement</p>
          </div>

          {/* Post Content */}
          <div className="prose prose-indigo prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Ad placeholder */}
          <div className="py-4 my-8 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Advertisement</p>
          </div>

          {/* Share buttons */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Share this article</h2>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16.363 2H7.637C4.525 2 2 4.525 2 7.637v8.726C2 19.475 4.525 22 7.637 22h8.726C19.475 22 22 19.475 22 16.363V7.637C22 4.525 19.475 2 16.363 2zM7.637 4h8.726C18.372 4 20 5.628 20 7.637v8.726C20 18.372 18.372 20 16.363 20H7.637C5.628 20 4 18.372 4 16.363V7.637C4 5.628 5.628 4 7.637 4z"/>
                  <path d="M7.5 9.5A1.5 1.5 0 106 8a1.5 1.5 0 001.5 1.5zM6.5 11h2v7h-2zM13.5 11c-1.103 0-2 .897-2 2v.5h-2V11h2v.5a2.5 2.5 0 014.9.6V18h-2v-4a1 1 0 00-2 0v4h-2v-7h3.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-xl font-bold text-gray-900">Related Articles</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                  {relatedPost.featuredImage && (
                    <div className="flex-shrink-0">
                      <img
                        className="h-48 w-full object-cover"
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                      />
                    </div>
                  )}
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <Link href={`/category/${relatedPost.category}`}>
                        <a className="text-sm font-medium text-indigo-600">
                          {relatedPost.category}
                        </a>
                      </Link>
                      <Link href={`/post/${relatedPost.slug}`}>
                        <a className="block mt-2">
                          <p className="text-xl font-semibold text-gray-900">{relatedPost.title}</p>
                          <p className="mt-3 text-base text-gray-500 line-clamp-3">{relatedPost.excerpt}</p>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <Link href="/">
                <a className="text-2xl font-bold text-indigo-600">TechPulse</a>
              </Link>
              <p className="text-gray-500 text-base">
                Your trusted source for technology news, reviews, and insights.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Categories</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/category/technology">
                      <a className="text-base text-gray-500 hover:text-gray-900">Technology</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/smartphones">
                      <a className="text-base text-gray-500 hover:text-gray-900">Smartphones</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/laptops">
                      <a className="text-base text-gray-500 hover:text-gray-900">Laptops</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/gaming">
                      <a className="text-base text-gray-500 hover:text-gray-900">Gaming</a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/about">
                      <a className="text-base text-gray-500 hover:text-gray-900">About</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy">
                      <a className="text-base text-gray-500 hover:text-gray-900">Privacy Policy</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service">
                      <a className="text-base text-gray-500 hover:text-gray-900">Terms of Service</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      <a className="text-base text-gray-500 hover:text-gray-900">Contact</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; {new Date().getFullYear()} TechPulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  // We'll pre-render only published posts at build time
  const postsQuery = query(
    collection(db, 'posts'), 
    where('status', '==', 'published'),
    limit(10) // Limit to 10 most recent posts for initial build
  );
  
  const querySnapshot = await getDocs(postsQuery);
  
  // Get the paths we want to pre-render based on posts
  const paths = [];
  querySnapshot.forEach((doc) => {
    const post = doc.data();
    if (post.slug) {
      paths.push({ params: { slug: post.slug } });
    }
  });

  // We'll pre-render only these paths at build time.
  // { fallback: true } means other routes will be generated at runtime.
  return { paths, fallback: true };
}

// This function gets called at build time
export async function getStaticProps({ params }) {
  const { slug } = params;

  // Find the post with matching slug
  const postsQuery = query(
    collection(db, 'posts'),
    where('slug', '==', slug),
    where('status', '==', 'published'),
    limit(1)
  );
  
  const querySnapshot = await getDocs(postsQuery);
  
  // If no matching post is found, return 404
  if (querySnapshot.empty) {
    return {
      notFound: true
    };
  }

  // Get the post data
  let post = null;
  querySnapshot.forEach((doc) => {
    post = {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    };
  });

  // Get related posts in the same category
  const relatedPostsQuery = query(
    collection(db, 'posts'),
    where('category', '==', post.category),
    where('slug', '!=', slug),
    where('status', '==', 'published'),
    limit(3)
  );
  
  const relatedQuerySnapshot = await getDocs(relatedPostsQuery);
  
  const relatedPosts = [];
  relatedQuerySnapshot.forEach((doc) => {
    relatedPosts.push({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    });
  });

  // Pass post data to the page via props
  return {
    props: {
      post,
      relatedPosts
    },
    // Re-generate the post at most once per hour if a request comes in
    revalidate: 3600
  };
}