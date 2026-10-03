import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';

const ImageUpload = ({ onImageUpload, maxImages = 5, disabled = false, initialImages = [] }) => {
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Initialiser avec les images existantes si fournies
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImages(initialImages.map(img => ({
        ...img,
        id: img.id || `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        preview: img.preview || img.url
      })));
    }
  }, [initialImages]);

  // Nettoyer les URLs d'objets créées pour l'aperçu
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.preview && image.preview.startsWith('blob:')) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  const handleFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB max
    );

    if (validFiles.length === 0) {
      return { error: 'Veuillez sélectionner des images valides (moins de 5MB)' };
    }

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    const updatedImages = [...images, ...newImages].slice(0, maxImages);
    setImages(updatedImages);
    onImageUpload(updatedImages.map(img => img.file || img));
    
    return { success: true };
  }, [images, maxImages, onImageUpload]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (id, e) => {
    e.stopPropagation();
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove?.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImageUpload(updatedImages.map(img => img.file || img));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Afficher la grille d'images
  const renderImageGrid = () => {
    if (images.length === 0) return null;

    return (
      <div className="mt-4">
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, index) => (
            <div 
              key={img.id || index}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <img 
                src={img.preview || img.url} 
                alt={`Prévisualisation ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x300?text=Image+non+chargée';
                }}
              />
              <button
                type="button"
                onClick={(e) => removeImage(img.id, e)}
                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            : dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={!disabled ? handleDrag : undefined}
        onDragLeave={!disabled ? handleDrag : undefined}
        onDragOver={!disabled ? handleDrag : undefined}
        onDrop={!disabled ? handleDrop : undefined}
        onClick={!disabled ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={!disabled ? handleChange : undefined}
          className="hidden"
          disabled={disabled || images.length >= maxImages}
        />
        
        <div className="space-y-4">
          <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full ${
            disabled ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <ImageIcon className={`w-6 h-6 ${
              disabled ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
            }`} />
          </div>
          
          <div>
            <p className={`text-sm ${
              disabled ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {images.length >= maxImages ? (
                'Nombre maximum d\'images atteint'
              ) : (
                <>
                  Glissez-déposez des images ici, ou{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog();
                    }}
                    className={`font-medium ${
                      disabled 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline'
                    }`}
                    disabled={disabled}
                  >
                    parcourez vos fichiers
                  </button>
                </>
              )}
            </p>
            <p className={`text-xs mt-1 ${
              disabled ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              JPG, PNG ou GIF (max 5MB) • Max {maxImages} images
            </p>
          </div>
        </div>
      </div>
      
      {renderImageGrid()}
      
      {images.length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <span>{images.length} image{images.length > 1 ? 's' : ''} sélectionnée{images.length > 1 ? 's' : ''}</span>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImages([]);
                onImageUpload([]);
              }}
              className="ml-auto flex items-center text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Tout supprimer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
