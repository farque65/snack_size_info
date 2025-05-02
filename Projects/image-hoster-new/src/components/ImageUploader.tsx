import React, { useState, useCallback } from 'react';
import { Upload, Copy, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      setShowSuccessModal(true);
      
      // Delay the reload to allow the user to see the success modal
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setError('Error uploading image. Please try again.');
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const copyToClipboard = async () => {
    if (imageUrl) {
      await navigator.clipboard.writeText(imageUrl);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-4">
            {uploading ? (
              <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
            <div className="text-gray-600">
              <p className="font-medium">Drop your image here or click to upload</p>
              <p className="text-sm">Supports: JPG, PNG, GIF</p>
            </div>
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Upload Successful!</h3>
              </div>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src={imageUrl} 
                  alt="Uploaded preview" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={imageUrl}
                  readOnly
                  className="flex-1 p-2 text-sm bg-gray-50 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                The page will refresh in a few seconds to show your uploaded image.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}