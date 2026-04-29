import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Image as ImageIcon, Folder, Tag, Search, Plus, Filter, Trash2 } from 'lucide-react';

export interface GalleryImage {
  id: string;
  dataUrl: string;
  caption: string;
  category: string;
  album: string;
  uploadDate: number;
}

export const ImageGallery: React.FC<{ isDarkMode: boolean; onClose: () => void }> = ({ isDarkMode, onClose }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [fullScreenImage, setFullscreenImage] = useState<GalleryImage | null>(null);

  // New Upload Form State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadAlbum, setUploadAlbum] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [registryImages, setRegistryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('spi_gallery_images');
    if (saved) {
      try {
        setImages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse gallery', e);
      }
    }
    
    // Also fetch registry images
    fetchRegistryImages();
  }, []);

  const fetchRegistryImages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        const registryAsGallery: GalleryImage[] = (data.visuals || []).map((v: any) => ({
          id: v.id,
          dataUrl: v.imageUrl,
          caption: v.title,
          category: v.category,
          album: 'System Registry',
          uploadDate: Date.now()
        }));
        setRegistryImages(registryAsGallery);
      }
    } catch (e) {
      console.error('Failed to fetch registry images', e);
    } finally {
      setLoading(false);
    }
  };

  const saveImages = (newImages: GalleryImage[]) => {
    setImages(newImages);
    try {
      localStorage.setItem('spi_gallery_images', JSON.stringify(newImages));
    } catch (e) {
      alert('Storage limit reached! Please delete some images. (Images are stored locally)');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPreviewUrl(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) return;

    const newImage: GalleryImage = {
      id: Math.random().toString(36).substr(2, 9),
      dataUrl: previewUrl,
      caption: uploadCaption || 'Untitled',
      category: uploadCategory || 'Uncategorized',
      album: uploadAlbum || 'Default Album',
      uploadDate: Date.now(),
    };

    saveImages([newImage, ...images]);
    setIsUploading(false);
    resetUploadForm();
  };

  const resetUploadForm = () => {
    setPreviewUrl(null);
    setUploadCaption('');
    setUploadCategory('');
    setUploadAlbum('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Only allow deleting local images
    if (registryImages.find(img => img.id === id)) {
      alert('Cannot delete System Registry assets from here. Use Admin Dashboard.');
      return;
    }
    if (confirm('Delete this image?')) {
      saveImages(images.filter(img => img.id !== id));
    }
  };

  const allImages = [...images, ...registryImages];
  const albums = ['All', ...Array.from(new Set(allImages.map(img => img.album)))];
  const categories = ['All', ...Array.from(new Set(allImages.map(img => img.category)))];

  const filteredImages = allImages.filter(img => {
    const matchesAlbum = selectedAlbum === 'All' || img.album === selectedAlbum;
    const matchesCategory = selectedCategory === 'All' || img.category === selectedCategory;
    const matchesSearch = img.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAlbum && matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Header */}
      <header className={`p-6 md:p-10 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'border-white/5 bg-stealth-950/80' : 'border-slate-100 bg-white/80'} backdrop-blur-md`}>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-registry-teal/10 rounded-2xl">
            <ImageIcon className="w-6 h-6 text-registry-teal" />
          </div>
          <div>
            <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Clinical Gallery</h2>
            <p className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">{images.length} Images Stored</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsUploading(true)}
            className="flex items-center space-x-2 px-5 py-3 bg-registry-teal text-stealth-950 font-black text-sm uppercase tracking-wider rounded-xl hover:bg-registry-teal/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden md:inline">Upload</span>
          </button>
          <button 
            onClick={onClose}
            className={`p-3 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className={`p-4 md:p-6 border-b shrink-0 flex flex-col md:flex-row gap-4 items-center ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search captions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-registry-teal outline-none transition-all ${isDarkMode ? 'bg-stealth-900 border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-slate-400" />
            <select 
              value={selectedAlbum} 
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className={`text-sm py-2 px-3 rounded-xl border outline-none ${isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
            >
              {albums.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`text-sm py-2 px-3 rounded-xl border outline-none ${isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-custom bg-slate-50/50 dark:bg-stealth-950/30">
        {filteredImages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <ImageIcon className="w-16 h-16 opacity-20" />
            <p className="font-medium text-lg">No images found</p>
            {images.length === 0 && (
              <button onClick={() => setIsUploading(true)} className="text-registry-teal font-bold hover:underline">
                Upload your first image
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img) => (
              <motion.div 
                layoutId={`img-\${img.id}`}
                key={img.id}
                onClick={() => setFullscreenImage(img)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl ${isDarkMode ? 'border-white/10 bg-stealth-900' : 'border-slate-200 bg-white'}`}
              >
                <div className="relative aspect-square overflow-hidden bg-black/5">
                  <img src={img.dataUrl} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <button 
                    onClick={(e) => handleDelete(img.id, e)}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <p className={`font-bold truncate text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{img.caption}</p>
                  <div className="flex items-center space-x-3 mt-2 text-[10px] uppercase font-black tracking-wider text-slate-400">
                    <span className="flex items-center"><Folder className="w-3 h-3 mr-1" /> {img.album}</span>
                    <span className="flex items-center"><Tag className="w-3 h-3 mr-1 text-registry-teal" /> {img.category}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className={`w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-stealth-900 border border-white/10' : 'bg-white border border-slate-200'}`}
            >
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                <h3 className={`text-xl font-black italic uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Upload Image</h3>
                <button onClick={() => { setIsUploading(false); resetUploadForm(); }} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <div className="p-6 overflow-y-auto">
                <form id="upload-form" onSubmit={handleUploadSubmit} className="space-y-6">
                  {/* Image Picker */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`aspect-video w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden group ${previewUrl ? 'border-registry-teal' : 'border-slate-300 dark:border-white/20 hover:border-registry-teal'} ${isDarkMode ? 'bg-black/20' : 'bg-slate-50'}`}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center space-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-8 h-8 mx-auto text-registry-teal" />
                        <p className="text-sm font-bold">Click to browse or drag image here</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Caption / Title</label>
                      <input required value={uploadCaption} onChange={e => setUploadCaption(e.target.value)} type="text" placeholder="e.g. Apical 4 Chamber View" className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-registry-teal ${isDarkMode ? 'bg-stealth-800 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Album</label>
                        <input value={uploadAlbum} onChange={e => setUploadAlbum(e.target.value)} type="text" placeholder="e.g. Physics Lab" list="album-list" className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-registry-teal ${isDarkMode ? 'bg-stealth-800 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                        <datalist id="album-list">{albums.filter(a => a !== 'All').map(a => <option key={a} value={a} />)}</datalist>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Category</label>
                        <input value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} type="text" placeholder="e.g. Artifacts" list="cat-list" className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-registry-teal ${isDarkMode ? 'bg-stealth-800 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                        <datalist id="cat-list">{categories.filter(c => c !== 'All').map(c => <option key={c} value={c} />)}</datalist>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-white/10 flex justify-end">
                <button 
                  type="submit" 
                  form="upload-form"
                  disabled={!previewUrl}
                  className="px-6 py-3 bg-registry-teal text-stealth-950 font-black text-sm uppercase tracking-wider rounded-xl hover:bg-registry-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen View */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] flex flex-col bg-black/95 backdrop-blur-lg"
          >
            <div className="p-6 flex justify-between items-center text-white absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
              <div>
                <h3 className="text-xl font-bold">{fullScreenImage.caption}</h3>
                <div className="flex items-center space-x-4 mt-2 text-xs uppercase tracking-widest text-slate-300">
                  <span className="flex items-center"><Folder className="w-4 h-4 mr-2 text-registry-teal" /> {fullScreenImage.album}</span>
                  <span className="flex items-center"><Tag className="w-4 h-4 mr-2" /> {fullScreenImage.category}</span>
                </div>
              </div>
              <button 
                onClick={() => setFullscreenImage(null)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div 
              className="flex-1 w-full h-full flex items-center justify-center p-8 pt-24"
              onClick={() => setFullscreenImage(null)}
            >
              <motion.img 
                layoutId={`img-\${fullScreenImage.id}`}
                src={fullScreenImage.dataUrl} 
                alt={fullScreenImage.caption} 
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
