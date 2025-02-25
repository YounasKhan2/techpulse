// pages/admin/media.js
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../lib/firebase';
import { useDropzone } from 'react-dropzone';

export default function Media() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      // Get media documents from Firestore
      const mediaQuery = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(mediaQuery);
      
      const mediaData = [];
      querySnapshot.forEach((doc) => {
        mediaData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        });
      });
      
      setMediaFiles(mediaData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching media:', error);
      setError('Failed to load media files');
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      const uploadedFiles = [];
      
      for (const file of acceptedFiles) {
        // Create a storage reference
        const storageRef = ref(storage, `media/${Date.now()}-${file.name}`);
        
        // Upload file to Firebase Storage
        const uploadTask = await uploadBytes(storageRef, file);
        
        // Get download URL
        const downloadURL = await getDownloadURL(uploadTask.ref);
        
        // Add file info to Firestore
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          url: downloadURL,
          path: uploadTask.ref.fullPath,
          createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'media'), fileData);
        
        uploadedFiles.push({
          id: docRef.id,
          ...fileData,
          createdAt: new Date()
        });
      }
      
      // Add new files to the state
      setMediaFiles([...uploadedFiles, ...mediaFiles]);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files');
      setUploading(false);
    }
  }, [mediaFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    }
  });

  const handleDelete = async (file) => {
    if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      try {
        // Delete from Storage
        const fileRef = ref(storage, file.path);
        await deleteObject(fileRef);
        
        // Delete from Firestore
        const mediaRef = doc(db, 'media', file.id);
        await deleteDoc(mediaRef);
        
        // Update state
        setMediaFiles(mediaFiles.filter(media => media.id !== file.id));
      } catch (error) {
        console.error('Error deleting file:', error);
        setError('Failed to delete file');
      }
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  return (
    <AdminLayout>
      <Head>
        <title>Media Library | TechPulse Admin</title>
      </Head>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Media Library</h1>
            <p className="mt-2 text-sm text-gray-700">
              Upload and manage images for your blog posts.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div {...getRootProps()} className="mt-8 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <input {...getInputProps()} />
              <p className="pl-1">
                {isDragActive
                  ? 'Drop the files here...'
                  : 'Drag and drop images here, or click to select files'}
              </p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            {uploading && (
              <div className="mt-2">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="mt-1 text-sm text-gray-500">Uploading...</p>
              </div>
            )}
          </div>
        </div>

        {/* Media Gallery */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Media Files</h2>
          
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="mt-2 text-sm text-gray-500">Loading media files...</p>
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-sm text-gray-500">No media files found. Upload your first image!</p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {mediaFiles.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedFile(file)}
                    />
                  </div>
                  <div className="mt-2 flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                        {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(file)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File details modal */}
        {selectedFile && (
          <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedFile(null)}></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {selectedFile.name}
                    </h3>
                    <div className="mt-2">
                      <img src={selectedFile.url} alt={selectedFile.name} className="w-full h-auto max-h-80 object-contain mx-auto" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                        value={selectedFile.url}
                        readOnly
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => copyToClipboard(selectedFile.url)}
                      >
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Size: {(selectedFile.size / 1024).toFixed(1)} KB | Type: {selectedFile.type}
                    </p>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}