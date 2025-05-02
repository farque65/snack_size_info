import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDashboard } from './components/ImageDashboard';
import { AlbumManager } from './components/AlbumManager';
import { ImageIcon, FolderIcon } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'images' | 'albums'>('images');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <ImageIcon className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Image Manager</h1>
        </div>

        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentPage('images')}
              className={`flex items-center px-4 py-2 rounded-md ${
                currentPage === 'images'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ImageIcon className="h-5 w-5 mr-2" />
              Images
            </button>
            <button
              onClick={() => setCurrentPage('albums')}
              className={`flex items-center px-4 py-2 rounded-md ${
                currentPage === 'albums'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FolderIcon className="h-5 w-5 mr-2" />
              Albums
            </button>
          </div>
        </div>

        {currentPage === 'images' ? (
          <div className="space-y-8">
            <ImageUploader />
            <ImageDashboard />
          </div>
        ) : (
          <AlbumManager />
        )}
      </div>
    </div>
  );
}