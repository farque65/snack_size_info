import React, { useEffect, useState } from 'react';
import { FileType, Link, Trash2, FolderPlus, ChevronLeft, ChevronRight, X, Menu, ArrowUpDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MobileDropdown from './MobileDropdown';

interface ImageFile {
  name: string;
  type: string;
  created_at: string;
  publicUrl: string;
  albums?: string[];
}

interface Album {
  id: string;
  name: string;
  description: string | null;
}

export function ImageDashboard() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [allImages, setAllImages] = useState<ImageFile[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [showNewAlbumDialog, setShowNewAlbumDialog] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1536) { // 2xl
        setItemsPerPage(15);
      } else if (window.innerWidth >= 1280) { // xl
        setItemsPerPage(12);
      } else if (window.innerWidth >= 1024) { // lg
        setItemsPerPage(10);
      } else if (window.innerWidth >= 768) { // md
        setItemsPerPage(8);
      } else { // sm and below
        setItemsPerPage(6);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial setup

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadImages();
    loadAlbums();
  }, []);

  useEffect(() => {
    if (selectedAlbum === null) {
      setImages(allImages);
    } else {
      setImages(allImages.filter(image => image.albums?.includes(selectedAlbum)));
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [selectedAlbum, allImages]);

  // Pagination calculations
  const totalPages = Math.ceil(images.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Sort and slice the images
  const sortedImages = [...images].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });
  
  const currentImages = sortedImages.slice(startIndex, endIndex);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const loadAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error('Error loading albums:', error);
    }
  };

  const loadImages = async () => {
    try {
      setLoading(true);
      const { data: storageData, error: storageError } = await supabase.storage
        .from('images')
        .list();

      if (storageError) throw storageError;

      const processedImages = await Promise.all(
        storageData.map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(file.name);

          const { data: imageAlbums } = await supabase
            .from('album_images')
            .select('album_id')
            .eq('image_path', file.name);

          return {
            name: file.name,
            type: file.metadata?.mimetype || 'unknown',
            created_at: new Date(file.created_at).toLocaleString(),
            publicUrl,
            albums: imageAlbums?.map(ia => ia.album_id) || []
          };
        })
      );

      setAllImages(processedImages);
      setImages(selectedAlbum === null ? processedImages : processedImages.filter(img => img.albums?.includes(selectedAlbum)));
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAlbum = async () => {
    try {
      const { error } = await supabase
        .from('albums')
        .insert([{ name: newAlbumName, description: newAlbumDescription || null }]);

      if (error) throw error;

      setNewAlbumName('');
      setNewAlbumDescription('');
      setShowNewAlbumDialog(false);
      loadAlbums();
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  const addToAlbum = async (imagePath: string, albumId: string) => {
    try {
      const { data: existingEntries, error: checkError } = await supabase
        .from('album_images')
        .select('*')
        .eq('album_id', albumId)
        .eq('image_path', imagePath);

      if (checkError) throw checkError;

      if (!existingEntries || existingEntries.length === 0) {
        const { error } = await supabase
          .from('album_images')
          .insert([{ album_id: albumId, image_path: imagePath }]);

        if (error) throw error;
        
        const updatedImages = allImages.map(img => {
          if (img.name === imagePath) {
            return {
              ...img,
              albums: [...(img.albums || []), albumId]
            };
          }
          return img;
        });

        setAllImages(updatedImages);
        setImages(selectedAlbum === null ? updatedImages : updatedImages.filter(img => img.albums?.includes(selectedAlbum)));
      }
    } catch (error) {
      console.error('Error adding image to album:', error);
    }
  };

  const removeFromAlbum = async (imagePath: string, albumId: string) => {
    try {
      const { error } = await supabase
        .from('album_images')
        .delete()
        .eq('album_id', albumId)
        .eq('image_path', imagePath);

      if (error) throw error;

      const updatedImages = allImages.map(img => {
        if (img.name === imagePath) {
          return {
            ...img,
            albums: (img.albums || []).filter(id => id !== albumId)
          };
        }
        return img;
      });

      setAllImages(updatedImages);
      setImages(selectedAlbum === null ? updatedImages : updatedImages.filter(img => img.albums?.includes(selectedAlbum)));
    } catch (error) {
      console.error('Error removing image from album:', error);
    }
  };

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
  };

  const deleteImage = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([fileName]);

      if (error) throw error;
      
      const updatedImages = allImages.filter(img => img.name !== fileName);
      setAllImages(updatedImages);
      setImages(selectedAlbum === null ? updatedImages : updatedImages.filter(img => img.albums?.includes(selectedAlbum)));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const renderPaginationControls = () => {
    const maxVisiblePages = windowWidth >= 768 ? 5 : 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex items-center text-sm text-gray-700">
          <span className="hidden sm:inline">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(endIndex, images.length)}</span> of{' '}
            <span className="font-medium">{images.length}</span> images
          </span>
          <span className="sm:hidden">
            {startIndex + 1}-{Math.min(endIndex, images.length)} of {images.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="hidden sm:flex space-x-2">
            {startPage > 1 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="px-3 py-1 rounded-md border hover:bg-gray-50"
                >
                  1
                </button>
                {startPage > 2 && (
                  <span className="px-2 py-1">...</span>
                )}
              </>
            )}
            {pages.map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <span className="px-2 py-1">...</span>
                )}
                <button
                  onClick={() => goToPage(totalPages)}
                  className="px-3 py-1 rounded-md border hover:bg-gray-50"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <div className="sm:hidden">
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
          </div>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Album Selection */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Albums</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowNewAlbumDialog(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FolderPlus className="h-4 w-4" />
              <span className="hidden sm:inline">New Album</span>
            </button>
          </div>
        </div>
        <div className={`${showMobileMenu ? 'flex' : 'hidden md:flex'} flex-col md:flex-row gap-2 md:space-x-2 overflow-x-auto pb-2`}>
          <button
            onClick={() => {
              setSelectedAlbum(null);
              setShowMobileMenu(false);
            }}
            className={`px-4 py-2 rounded-md whitespace-nowrap w-full md:w-auto text-left ${
              selectedAlbum === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Images
          </button>
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => {
                setSelectedAlbum(album.id);
                setShowMobileMenu(false);
              }}
              className={`px-4 py-2 rounded-md whitespace-nowrap w-full md:w-auto text-left ${
                selectedAlbum === album.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {album.name}
            </button>
          ))}
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-lg shadow-md overflow-visible">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedAlbum 
              ? `Images in ${albums.find(a => a.id === selectedAlbum)?.name}`
              : 'All Images'}
          </h2>
          <button
            onClick={toggleSortOrder}
            className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">
              Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </span>
          </button>
        </div>
        <div className="divide-y">
          {currentImages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No images found
            </div>
          ) : (
            currentImages.map((image) => (
              <div key={image.name} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex items-start gap-4 flex-grow">
                    <div className="w-20 h-20 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={image.publicUrl}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{image.name}</h3>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                        <FileType className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{image.type}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Uploaded: {image.created_at}
                      </div>
                      {image.albums && image.albums.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {image.albums.map(albumId => {
                            const album = albums.find(a => a.id === albumId);
                            return album ? (
                              <span key={albumId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 group">
                                {album.name}
                                <button
                                  onClick={() => removeFromAlbum(image.name, albumId)}
                                  className="hover:bg-blue-200 rounded p-0.5 transition-colors"
                                  title={`Remove from ${album.name}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:w-auto">
                    <div className="w-full sm:w-48">
                      <MobileDropdown
                        label="Add to album"
                        options={albums.filter(album => !image.albums?.includes(album.id))}
                        value={null}
                        onChange={(albumId) => {
                          if (albumId) {
                            addToAlbum(image.name, albumId);
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-2 flex-1 sm:flex-initial">
                      <button
                        onClick={() => copyToClipboard(image.publicUrl)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition-colors flex-1 sm:flex-initial"
                        title="Copy URL"
                      >
                        <Link className="h-4 w-4" />
                        <span className="hidden sm:inline">Copy URL</span>
                      </button>
                      <button
                        onClick={() => deleteImage(image.name)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-100 rounded-md text-red-700 hover:bg-red-200 transition-colors flex-1 sm:flex-initial"
                        title="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {images.length > 0 && renderPaginationControls()}
      </div>

      {/* New Album Dialog */}
      {showNewAlbumDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Album</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Album Name
                </label>
                <input
                  type="text"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="My Album"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  value={newAlbumDescription}
                  onChange={(e) => setNewAlbumDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Album description..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewAlbumDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={createAlbum}
                  disabled={!newAlbumName}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Album
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}