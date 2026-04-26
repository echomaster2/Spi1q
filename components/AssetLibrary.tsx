import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Upload, Trash2, Grid, Folder, Plus, X, Loader2, Check, Search, Filter, Edit2, Camera, Film, ZoomIn, ZoomOut, Maximize2, Minimize2, Link as LinkIcon, Play, FileVideo } from 'lucide-react';

interface Asset {
  id: string;
  data: string;
  type: 'user' | 'default' | 'stock' | 'gif' | 'video';
  category?: string;
  author?: string;
  authorUrl?: string;
}

interface AssetLibraryProps {
  userId: string;
  isDarkMode: boolean;
  onSelect: (asset: Asset) => void;
  onClose: () => void;
  modules?: any[];
  onAttachToLesson?: (lessonId: string, asset: Asset) => void;
  lexiconTerms?: any[];
  onAttachToLexicon?: (term: string, asset: Asset) => void;
}

const DEFAULT_ASSETS: Asset[] = [
  { id: 'none', data: '', type: 'default', category: 'Abstract' },
  { id: 'def-1', data: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Carotid_ultrasound.jpg', type: 'default', category: 'Medical' },
  { id: 'def-2', data: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Apikal4D.gif', type: 'default', category: 'Medical' },
  { id: 'def-3', data: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/ColourDopplerA.jpg', type: 'default', category: 'Medical' },
  { id: 'def-4', data: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/SpectralDopplerA.jpg', type: 'default', category: 'Medical' },
  { id: 'def-5', data: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/A_medical_ultrasound_linear_array_probe%2C_scan_head%2C_transducer.jpg', type: 'default', category: 'Medical' },
  { id: 'def-6', data: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/A_modern_medical_ultrasound_scanner.jpg', type: 'default', category: 'Medical' },
];

const CATEGORIES = ['All', 'Medical', 'Abstract', 'Nature', 'User Uploads'];

export const AssetLibrary: React.FC<AssetLibraryProps> = ({ userId, isDarkMode, onSelect, onClose, modules = [], onAttachToLesson, lexiconTerms = [], onAttachToLexicon }) => {
  const [userAssets, setUserAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'user'>('user');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showRenameModal, setShowRenameModal] = useState<{ id: string, name: string } | null>(null);
  const [selectedAssetForView, setSelectedAssetForView] = useState<Asset | null>(null);
  const [newName, setNewName] = useState('');
  const [zoom, setZoom] = useState(1);
  const [showAttachModal, setShowAttachModal] = useState<Asset | null>(null);
  const [attachTarget, setAttachTarget] = useState<'lesson' | 'lexicon'>('lesson');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'user') {
      fetchUserAssets();
    }
  }, [userId, activeTab]);

  const fetchUserAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/images/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserAssets(data.map((img: any) => {
          const type = img.data.startsWith('data:video') ? 'video' : 'user';
          return { ...img, type, category: type === 'video' ? 'Videos' : 'User Uploads' };
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files || files.length === 0) return;

    setUploading(true);
    
    // If only one file and it's an image, keep old logic for backward compatibility with base64 storage if preferred,
    // but for bulk we definitely want the new server-side file storage.
    
    if (files.length > 1) {
      // Bulk logic
      const formData = new FormData();
      files.forEach(file => {
        if (file.type.startsWith('video/')) {
          formData.append('videos', file);
        } else {
          formData.append('images', file);
        }
      });

      try {
        // We separate them or use a combined endpoint. 
        // Let's just handle them sequentially or update server to handle mixed.
        // Actually, let's just use the image endpoint if they are mostly images.
        
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        const videoFiles = files.filter(f => f.type.startsWith('video/'));

        if (imageFiles.length > 0) {
          const imgFormData = new FormData();
          imageFiles.forEach(f => imgFormData.append('images', f));
          const res = await fetch('/api/bulk-upload-images', { method: 'POST', body: imgFormData });
          if (res.ok) {
            const result = await res.json();
            for (const file of result.files) {
              const imageId = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`;
              await fetch(`/api/images/${userId}/${imageId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: file.url }), // Save URL instead of base64
              });
            }
          }
        }

        if (videoFiles.length > 0) {
          const vidFormData = new FormData();
          videoFiles.forEach(f => vidFormData.append('videos', f));
          const res = await fetch('/api/bulk-upload-videos', { method: 'POST', body: vidFormData });
          if (res.ok) {
            const result = await res.json();
            for (const file of result.files) {
                const imageId = `video-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                await fetch(`/api/images/${userId}/${imageId}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ data: `data:video/mp4;base64,${file.url}` }),
                });
            }
          }
        }
        
        fetchUserAssets();
      } catch (error) {
        console.error('Bulk upload failed:', error);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      return;
    }

    const file = files[0];
    
    // Check if it's a video
    if (file.type.startsWith('video/')) {
      const formData = new FormData();
      formData.append('video', file);
      
      try {
        const response = await fetch('/api/upload-video', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          // For videos, we save the URL to the user's image vault as a reference
          const imageId = `video-${Date.now()}`;
          await fetch(`/api/images/${userId}/${imageId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: `data:video/mp4;base64,${result.url}` }), // We use a special prefix to identify it's a server-hosted video
          });
          fetchUserAssets();
        } else {
          const err = await response.json();
          console.error('Video upload failed:', err);
          alert(`Video upload failed: ${err.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Video upload error:', error);
        alert('Video upload failed. Please check your connection and file size.');
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      return;
    }

    // Handle images as before, but with better error handling
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const imageId = `user-${Date.now()}`;
      try {
        const response = await fetch(`/api/images/${userId}/${imageId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: base64 }),
        });
        if (response.ok) {
          fetchUserAssets();
        } else {
          console.error('Image upload failed');
          alert('Image upload failed. The file might be too large.');
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed. Please check your connection.');
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      console.error('File reading failed');
      alert('Failed to read the file.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };
  const handleDelete = async (imageId: string) => {
    setShowDeleteConfirm(null);
    try {
      const response = await fetch(`/api/images/${userId}/${imageId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchUserAssets();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleRename = async () => {
    if (!showRenameModal || !newName.trim()) return;
    
    const oldId = showRenameModal.id;
    const newId = newName.trim().replace(/[^a-z0-9-_]/gi, '_'); // Sanitize filename
    
    if (oldId === newId) {
      setShowRenameModal(null);
      return;
    }
    
    try {
      const response = await fetch(`/api/images/${userId}/${oldId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newImageId: newId }),
      });
      
      if (response.ok) {
        setShowRenameModal(null);
        setNewName('');
        fetchUserAssets();
      } else {
        const err = await response.json();
        alert(`Rename failed: ${err.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Rename failed:', error);
      alert('Rename failed. Please check your connection.');
    }
  };

  const filteredAssets = [...DEFAULT_ASSETS, ...userAssets].filter(asset => {
    if (activeCategory === 'All') return true;
    return asset.category === activeCategory;
  });

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-stealth-950 text-white' : 'bg-slate-50 text-slate-900'} relative overflow-hidden`}>
      {/* Background Data Stream Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.1)_0%,transparent_70%)]" />
        <div className="grid grid-cols-12 h-full w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div 
              key={i}
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 10 + Math.random() * 20, repeat: Infinity, ease: 'linear' }}
              className="w-px h-full bg-gradient-to-b from-transparent via-registry-teal to-transparent"
            />
          ))}
        </div>
      </div>

      <header className={`p-6 border-b ${isDarkMode ? 'border-white/10 bg-stealth-950/80' : 'border-slate-200 bg-white/80'} backdrop-blur-xl flex justify-between items-center relative z-10`}>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/20">
            <ImageIcon className="w-6 h-6 text-registry-teal" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Asset Library</h2>
            <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-500' : 'text-slate-800'}`}>Visual Core Repository</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {activeTab === 'user' && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleUpload} 
                className="hidden" 
                accept="image/*,video/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center space-x-2 px-4 py-2 bg-registry-teal text-stealth-950 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                <span>{uploading ? 'Uploading...' : 'Upload Asset'}</span>
              </button>
            </>
          )}
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className={`flex items-center space-x-2 p-1 rounded-2xl border w-fit ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300'}`}>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest bg-registry-teal text-stealth-950 shadow-lg shadow-registry-teal/20">
              <Folder className="w-3 h-3" />
              <span>My Library</span>
            </div>
            <a 
              href="https://iame.com/sonoworld-archive" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-slate-950 hover:bg-white'}`}
            >
              <Film className="w-3 h-3" />
              <span>Sonoworld Archive</span>
            </a>
          </div>
        </div>

        {activeTab === 'user' && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-registry-teal text-stealth-950' 
                    : isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-200 text-slate-900 hover:bg-slate-300 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && activeTab === 'user' ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-10 h-10 text-registry-teal animate-spin" />
            <p className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-800'}`}>Accessing Repository...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative aspect-video rounded-3xl overflow-hidden cursor-pointer border-2 transition-all ${
                    isDarkMode ? 'border-white/5 hover:border-registry-teal/50' : 'border-slate-200 hover:border-registry-teal/50 shadow-sm'
                  }`}
                >
                  {asset.id === 'none' ? (
                    <div 
                      onClick={() => onSelect(asset)}
                      className={`w-full h-full flex flex-col items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}
                    >
                      <X className="w-8 h-8 text-slate-400" />
                      <p className="text-[11px] font-black uppercase tracking-widest mt-2">No Background</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      {asset.type === 'video' || (asset.data && asset.data.startsWith('data:video')) ? (
                        <div 
                          onClick={() => onSelect(asset)}
                          className={`w-full h-full flex flex-col items-center justify-center ${isDarkMode ? 'bg-stealth-900' : 'bg-slate-200'}`}
                        >
                          <FileVideo className="w-10 h-10 text-registry-teal mb-2" />
                          <p className="text-[11px] font-black uppercase tracking-tighter text-white truncate max-w-[80%] px-2">{asset.id}</p>
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={asset.data} 
                          alt={asset.id} 
                          onClick={() => onSelect(asset)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 contrast-110 saturate-125"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      {/* Tech Overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-registry-teal/5 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-20" />
                        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-registry-teal/40" />
                        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-registry-teal/40" />
                        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-registry-teal/40" />
                        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-registry-teal/40" />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-stealth-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedAssetForView(asset); setZoom(1); }}
                          className="p-2 bg-white/20 hover:bg-white text-white hover:text-stealth-950 rounded-xl backdrop-blur-md transition-all"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-left">
                          <p className="text-[11px] font-black text-registry-teal uppercase tracking-widest">{asset.category}</p>
                          <p className="text-[11px] font-black text-white uppercase tracking-tighter truncate max-w-[100px]">{asset.author || asset.id}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowAttachModal(asset); }}
                            className="p-2 bg-registry-teal/20 hover:bg-registry-teal text-registry-teal hover:text-white rounded-xl transition-all"
                            title="Attach to Case Study"
                          >
                            <LinkIcon className="w-3 h-3" />
                          </button>
                          {asset.type !== 'default' && (
                            <>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setShowRenameModal({ id: asset.id, name: asset.id }); 
                                  setNewName(asset.id);
                                }}
                                className="p-2 bg-white/20 hover:bg-white text-white hover:text-stealth-950 rounded-xl transition-all"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(asset.id); }}
                                className="p-2 bg-registry-rose/20 hover:bg-registry-rose text-registry-rose hover:text-white rounded-xl transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {asset.type === 'default' && (
                    <div className="absolute top-4 right-4 p-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                      <Check className="w-3 h-3 text-registry-teal" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredAssets.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 opacity-50">
            <Folder className="w-12 h-12 text-slate-500" />
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              No Assets Found
            </p>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedAssetForView && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-stealth-950/95 backdrop-blur-2xl p-4 md:p-12"
          >
            <button 
              onClick={() => setSelectedAssetForView(null)}
              className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 z-10">
              <button 
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                className="p-3 hover:bg-white/10 text-white rounded-xl transition-all"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-black text-white uppercase tracking-widest w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button 
                onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
                className="p-3 hover:bg-white/10 text-white rounded-xl transition-all"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <button 
                onClick={() => setZoom(1)}
                className="p-3 hover:bg-white/10 text-white rounded-xl transition-all"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            <motion.div 
              className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
              drag
              dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
              dragElastic={0.1}
            >
              <div className="relative">
                {selectedAssetForView.type === 'video' || selectedAssetForView.data.startsWith('data:video') ? (
                  selectedAssetForView.data ? (
                    <motion.video 
                      src={selectedAssetForView.data.startsWith('data:video/mp4;base64,/api/video/') 
                        ? selectedAssetForView.data.replace('data:video/mp4;base64,', '') 
                        : selectedAssetForView.data} 
                      controls
                      autoPlay
                      animate={{ scale: zoom }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="max-w-full max-h-full object-contain filter brightness-90 contrast-110 saturate-125 rounded-2xl shadow-2xl"
                    />
                  ) : null
                ) : (
                  selectedAssetForView.data ? (
                    <motion.img 
                      src={selectedAssetForView.data} 
                      alt="Preview"
                      animate={{ scale: zoom }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="max-w-full max-h-full object-contain pointer-events-none select-none filter brightness-90 contrast-110 saturate-125"
                      referrerPolicy="no-referrer"
                    />
                  ) : null
                )}
                {/* Diagnostic Overlay for Viewer */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />
                  <div className="absolute inset-0 border border-registry-teal/20" />
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-px bg-registry-teal/30 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                  />
                </div>
              </div>
            </motion.div>

            {selectedAssetForView.author && (
              <div className="absolute top-8 left-8 flex items-center space-x-3">
                <div className="p-2 bg-registry-teal/10 rounded-xl border border-registry-teal/20">
                  <Camera className="w-5 h-5 text-registry-teal" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-registry-teal uppercase tracking-widest">Photographer</p>
                  <a 
                    href={selectedAssetForView.authorUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-black text-white uppercase tracking-tighter hover:text-registry-teal transition-colors"
                  >
                    {selectedAssetForView.author}
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Attach to Lesson Modal */}
      <AnimatePresence>
        {showAttachModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-stealth-950/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-[3rem] border shadow-2xl flex flex-col ${isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-registry-teal/10 to-transparent">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-registry-teal/20 rounded-2xl">
                    <LinkIcon className="w-6 h-6 text-registry-teal" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Attach Asset</h2>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Map Asset to Neural Node</p>
                  </div>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button 
                    onClick={() => setAttachTarget('lesson')}
                    className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${attachTarget === 'lesson' ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Curriculum
                  </button>
                  <button 
                    onClick={() => setAttachTarget('lexicon')}
                    className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${attachTarget === 'lexicon' ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Lexicon
                  </button>
                </div>
                <button onClick={() => setShowAttachModal(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
                  {showAttachModal.type === 'video' ? (
                    <div className="w-20 h-12 bg-stealth-950 rounded-lg flex items-center justify-center">
                      <FileVideo className="w-6 h-6 text-registry-teal" />
                    </div>
                  ) : (
                    showAttachModal.data ? (
                      <img src={showAttachModal.data} alt="Preview" className="w-20 h-12 object-cover rounded-lg" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-20 h-12 bg-stealth-950 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-slate-600" />
                      </div>
                    )
                  )}
                  <div>
                    <p className="text-[11px] font-black text-registry-teal uppercase tracking-widest">Selected Asset</p>
                    <p className="text-sm font-black uppercase tracking-tighter truncate max-w-[200px]">{showAttachModal.id}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {attachTarget === 'lesson' ? (
                    modules?.map((m, mIdx) => (
                      <div key={mIdx} className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest px-2">{m.title}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {m.lessons.map((l: any) => (
                            <button
                              key={l.id}
                              onClick={() => {
                                onAttachToLesson?.(l.id, showAttachModal);
                                setShowAttachModal(null);
                              }}
                              className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                                isDarkMode ? 'bg-white/5 border-white/5 hover:border-registry-teal/30 hover:bg-registry-teal/5' : 'bg-slate-50 border-slate-200 hover:border-registry-teal/30 hover:bg-slate-100'
                              }`}
                            >
                              <span className="text-[11px] font-bold uppercase tracking-tight truncate mr-2">{l.title}</span>
                              <Plus className="w-3 h-3 text-registry-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lexiconTerms?.map((term, tIdx) => (
                        <button
                          key={tIdx}
                          onClick={() => {
                            onAttachToLexicon?.(term.term, showAttachModal);
                            setShowAttachModal(null);
                          }}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                            isDarkMode ? 'bg-white/5 border-white/5 hover:border-registry-teal/30 hover:bg-registry-teal/5' : 'bg-slate-50 border-slate-200 hover:border-registry-teal/30 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[11px] font-bold uppercase tracking-tight truncate mr-2">{term.term}</span>
                          <Plus className="w-3 h-3 text-registry-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setShowAttachModal(null)}
                  className={`px-8 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRenameModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-stealth-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-sm p-8 rounded-[2.5rem] border shadow-2xl ${isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            >
              <div className="w-16 h-16 bg-registry-teal/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Edit2 className="w-8 h-8 text-registry-teal" />
              </div>
              <h3 className="text-xl font-black uppercase italic text-center mb-2">Rename Asset</h3>
              <p className="text-xs text-center opacity-60 mb-6 leading-relaxed">Enter a new name for your asset.</p>
              
              <div className="mb-8">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Asset Name"
                  className={`w-full px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none border transition-all ${
                    isDarkMode ? 'bg-white/5 border-white/10 focus:border-registry-teal' : 'bg-slate-50 border-slate-200 focus:border-registry-teal'
                  }`}
                  autoFocus
                />
              </div>

              <div className="flex space-x-3">
                <button onClick={() => setShowRenameModal(null)} className={`flex-1 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
                <button onClick={handleRename} className="flex-1 py-4 bg-registry-teal text-stealth-950 rounded-xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-registry-teal/20 active:scale-95 transition-all">Rename</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-stealth-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-sm p-8 rounded-[2.5rem] border shadow-2xl ${isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            >
              <div className="w-16 h-16 bg-registry-rose/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Trash2 className="w-8 h-8 text-registry-rose" />
              </div>
              <h3 className="text-xl font-black uppercase italic text-center mb-2">Delete Asset?</h3>
              <p className="text-xs text-center opacity-60 mb-8 leading-relaxed">This will permanently remove this image from your library. This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button onClick={() => setShowDeleteConfirm(null)} className={`flex-1 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-4 bg-registry-rose text-white rounded-xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-registry-rose/20 active:scale-95 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
