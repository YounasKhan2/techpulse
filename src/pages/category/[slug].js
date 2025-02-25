// pages/category/[slug].js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { format } from 'date-fns';

const POSTS_PER_PAGE = 9;

export default function CategoryPage({ category, posts, totalPosts }) {
  const router = useRouter();
  const { slug } = router.query;
  
  const [displayedPosts, setDisplayedPosts] = useState(posts);
  const [lastPost, setLastPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(displayedPosts.length >= totalPosts);

  useEffect(() => {
    if (posts && posts.length > 0) {
      setDisplayedPosts(posts);
      setLastPost(posts[posts.length - 1]);
      setReachedEnd(posts.length >= totalPosts);
    }
  }, [posts, totalPosts]);

  const loadMorePosts = async () => {
    if (reachedEnd || loading) return;
    
    setLoading(true);
    
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('category', '==', slug),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        startAfter(lastPost.createdAt),
        limit(POSTS_PER_PAGE)
      );
      
      const querySnapshot = await getDocs(postsQuery);
      
      if (querySnapshot.empty) {
        setReachedEnd(true);
        setLoading(false);
        return;
      }
      
      const newPosts = [];
      querySnapshot.forEach((doc) => {
        newPosts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        });
      });
      
      setDisplayedPosts([...displayedPosts, ...newPosts]);
      setLastPost(newPosts[newPosts.length - 1]);
      setReachedEnd(displayedPosts.length + newPosts.length >= totalPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading more posts:', error);
      setLoading(false);
    }
  };

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="bg-white">
      <Head>
        <title>{categoryTitle} Articles | TechPulse</title>
        <meta name="description" content={`Explore the latest ${categoryTitle} news, reviews, and insights on TechPulse.`} />
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
                  <a className={`${slug === 'technology' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Technology
                  </a>
                </Link>
                <Link href="/category/smartphones">
                  <a className={`${slug === 'smartphones' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Smartphones
                  </a>
                </Link>
                <Link href="/category/laptops">
                  <a className={`${slug === 'laptops' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Laptops
                  </a>
                </Link>
                <Link href="/category/gaming">
                  <a className={`${slug === 'gaming' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Gaming
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{categoryTitle}</h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              {`Discover the latest ${categoryTitle.toLowerCase()} news, reviews, and insights.`}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Ad placeholder */}
        <div className="py-4 mb-12 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Advertisement</p>
        </div>

        {displayedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayedPosts.map((post) => (
                <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                  {post.featuredImage && (
                    <div className="flex-shrink-0">
                      <img
                        className="h-48 w-full object-cover"
                        src={post.featuredImage}
                        alt={post.title}
                      />
                    </div>
                  )}
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <Link href={`/post/${post.slug}`}>
                        <a className="block">
                          <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                          <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                        </a>
                      </Link>
                    </div>
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!reachedEnd && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMorePosts}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
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

export async function getStaticPaths() {
  // Pre-render some common categories
  const categories = ['technology', 'smartphones', 'laptops', 'gaming', 'software', 'gadgets'];
  
  const paths = categories.map((category) => ({
    params: { slug: category }
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  try {
    // Get total count first
    const countQuery = query(
      collection(db, 'posts'),
      where('category', '==', slug),
      where('status', '==', 'published')
    );
    
    const countSnapshot = await getDocs(countQuery);
    const totalPosts = countSnapshot.size;

    // Now get the first batch of posts
    const postsQuery = query(
      collection(db, 'posts'),
      where('category', '==', slug),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(POSTS_PER_PAGE)
    );
    
    const querySnapshot = await getDocs(postsQuery);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      });
    });

    return {
      props: {
        category: slug,
        posts,
        totalPosts
      },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    
    return {
      notFound: true
    };
  }
}