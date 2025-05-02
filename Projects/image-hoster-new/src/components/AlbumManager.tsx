import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Album {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export function AlbumManager() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadAlbums();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (album: Album) => {
    setEditingId(album.id);
    setEditName(album.name);
    setEditDescription(album.description || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const saveAlbum = async (id: string) => {
    try {
      const { error } = await supabase
        .from('albums')
        .update({
          name: editName,
          description: editDescription || null
        })
        .eq('id', id);

      if (error) throw error;

      setAlbums(albums.map(album => 
        album.id === id 
          ? { ...album, name: editName, description: editDescription }
          : album
      ));
      cancelEditing();
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
      return;
    }

    try {
      // First, remove all album_images entries for this album
      const { error: deleteImagesError } = await supabase
        .from('album_images')
        .delete()
        .eq('album_id', id);

      if (deleteImagesError) throw deleteImagesError;

      // Then delete the album itself
      const { error: deleteAlbumError } = await supabase
        .from('albums')
        .delete()
        .eq('id', id);

      if (deleteAlbumError) throw deleteAlbumError;

      setAlbums(albums.filter(album => album.id !== id));
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Albums</h2>
        </div>
        <div className="divide-y">
          {albums.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No albums found
            </div>
          ) : (
            albums.map((album) => (
              <div key={album.id} className="p-4 hover:bg-gray-50 transition-colors">
                {editingId === album.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Album Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEditing}
                        className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={() => saveAlbum(album.id)}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{album.name}</h3>
                      {album.description && (
                        <p className="mt-1 text-sm text-gray-500">{album.description}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        Created: {new Date(album.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(album)}
                        className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                        title="Edit album"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteAlbum(album.id)}
                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-md"
                        title="Delete album"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}