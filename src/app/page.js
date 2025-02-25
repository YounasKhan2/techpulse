// src/app/page.js
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';

// Metadata for the page
export const metadata = {
  title: 'TechPulse - Latest Technology News, Reviews and Guides',
  description: 'Stay updated with the latest technology trends, reviews, and buying guides for gadgets, software, and tech innovations.',
};

// Make the component async for server-side data fetching
export default async function Home() {
  // Get featured posts
  const featuredPostsQuery = query(
    collection(db, 'posts'),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(3)
  );
  
  const featuredSnapshot = await getDocs(featuredPostsQuery);
  
  const featuredPosts = [];
  featuredSnapshot.forEach((doc) => {
    featuredPosts.push({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    });
  });

  // Get recent posts for each category
  const categories = [
    { name: 'Technology', slug: 'technology' },
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Gaming', slug: 'gaming' }
  ];
  
  const popularCategories = [];
  
  for (const category of categories) {
    const categoryPostsQuery = query(
      collection(db, 'posts'),
      where('category', '==', category.slug),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    
    const categorySnapshot = await getDocs(categoryPostsQuery);
    
    const categoryPosts = [];
    categorySnapshot.forEach((doc) => {
      categoryPosts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      });
    });
    
    if (categoryPosts.length > 0) {
      popularCategories.push({
        ...category,
        posts: categoryPosts
      });
    }
  }

  // Get most recent posts overall
  const recentPostsQuery = query(
    collection(db, 'posts'),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(5)
  );
  
  const recentSnapshot = await getDocs(recentPostsQuery);
  
  const recentPosts = [];
  recentSnapshot.forEach((doc) => {
    recentPosts.push({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    });
  });

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600">
                  TechPulse
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  href="/category/technology" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Technology
                </Link>
                <Link 
                  href="/category/smartphones" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Smartphones
                </Link>
                <Link 
                  href="/category/laptops" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Laptops
                </Link>
                <Link 
                  href="/category/gaming" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Gaming
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link 
                href="/search" 
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Search</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero section with featured post */}
        {featuredPosts.length > 0 && (
          <div className="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
            <div className="absolute inset-0">
              <div className="bg-white h-1/3 sm:h-2/3"></div>
            </div>
            <div className="relative max-w-7xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Featured Articles</h2>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                  Stay up to date with the latest technology trends and insights
                </p>
              </div>

              <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
                {featuredPosts.map((post) => (
                  <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                    <div className="flex-shrink-0">
                      <img className="h-48 w-full object-cover" src={post.featuredImage} alt={post.title} />
                    </div>
                    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-indigo-600">
                          <Link href={`/category/${post.category}`} className="hover:underline">
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </Link>
                        </p>
                        <Link href={`/post/${post.slug}`} className="block mt-2">
                          <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                          <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
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
            </div>
          </div>
        )}

        {/* Ad placeholder */}
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="py-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Advertisement</p>
          </div>
        </div>

        {/* Category sections */}
        {popularCategories.map((category) => (
          <div key={category.slug} className="bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
            <div className="relative max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                  {category.name}
                </h2>
                <Link 
                  href={`/category/${category.slug}`}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  View All <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.posts.map((post) => (
                  <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                    <div className="flex-shrink-0">
                      <img className="h-48 w-full object-cover" src={post.featuredImage} alt={post.title} />
                    </div>
                    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <Link href={`/post/${post.slug}`} className="block">
                          <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                          <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
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
            </div>
          </div>
        ))}

        {/* Newsletter subscription */}
        <div className="bg-indigo-700">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Stay updated with TechPulse</span>
              <span className="block">Subscribe to our newsletter</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-indigo-200">
              Get the latest tech news, reviews, and guides delivered straight to your inbox.
            </p>
            <form className="mt-8 sm:flex justify-center max-w-md mx-auto">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs border-white rounded-md"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                TechPulse
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
                    <Link href="/category/technology" className="text-base text-gray-500 hover:text-gray-900">
                      Technology
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/smartphones" className="text-base text-gray-500 hover:text-gray-900">
                      Smartphones
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/laptops" className="text-base text-gray-500 hover:text-gray-900">
                      Laptops
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/gaming" className="text-base text-gray-500 hover:text-gray-900">
                      Gaming
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="text-base text-gray-500 hover:text-gray-900">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="text-base text-gray-500 hover:text-gray-900">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                      Contact
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