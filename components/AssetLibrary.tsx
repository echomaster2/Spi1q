import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Upload, Trash2, Grid, Folder, Plus, X, Loader2, Check, Search, Filter } from 'lucide-react';

interface Asset {
  id: string;
  data: string;
  type: 'user' | 'default';
  category?: string;
}

interface AssetLibraryProps {
  userId: string;
  isDarkMode: boolean;
  onSelect: (asset: Asset) => void;
  onClose: () => void;
}

const DEFAULT_ASSETS: Asset[] = [
  { id: 'none', data: '', type: 'default', category: 'Abstract' },
  { id: 'def-1', data: 'https://picsum.photos/seed/ultrasound1/1920/1080', type: 'default', category: 'Medical' },
  { id: 'def-2', data: 'https://picsum.photos/seed/anatomy/1920/1080', type: 'default', category: 'Medical' },
  { id: 'def-3', data: 'https://picsum.photos/seed/abstract-wave/1920/1080', type: 'default', category: 'Abstract' },
  { id: 'def-4', data: 'https://picsum.photos/seed/tech-grid/1920/1080', type: 'default', category: 'Abstract' },
  { id: 'def-5', data: 'https://picsum.photos/seed/nature-calm/1920/1080', type: 'default', category: 'Nature' },
  { id: 'def-6', data: 'https://picsum.photos/seed/deep-sea/1920/1080', type: 'default', category: 'Nature' },
];

const CATEGORIES = ['All', 'Medical', 'Abstract', 'Nature', 'User Uploads'];

export const AssetLibrary: React.FC<AssetLibraryProps> = ({ userId, isDarkMode, onSelect, onClose }) => {
  const [userAssets, setUserAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserAssets();
  }, [userId]);

  const fetchUserAssets = async () => {
    try {
      const response = await fetch(`/api/images/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserAssets(data.map((img: any) => ({ ...img, type: 'user', category: 'User Uploads' })));
      }
    } catch (error) {
      console.error('Failed to fetch user assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
        }
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setUploading(false);
      }
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

  const filteredAssets = [...DEFAULT_ASSETS, ...userAssets].filter(asset => {
    if (activeCategory === 'All') return true;
    return asset.category === activeCategory;
  });

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-stealth-950 text-white' : 'bg-slate-50 text-slate-900'} relative overflow-hidden`}>
      <header className={`p-6 border-b ${isDarkMode ? 'border-white/10 bg-stealth-950/80' : 'border-slate-200 bg-white/80'} backdrop-blur-xl flex justify-between items-center relative z-10`}>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-registry-teal/10 rounded-2xl border border-registry-teal/20">
            <ImageIcon className="w-6 h-6 text-registry-teal" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Asset Library</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Visual Core Repository</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2 px-4 py-2 bg-registry-teal text-stealth-950 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
            <span>{uploading ? 'Uploading...' : 'Upload Asset'}</span>
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-registry-teal text-stealth-950' 
                  : isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-10 h-10 text-registry-teal animate-spin" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessing Repository...</p>
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
                  onClick={() => onSelect(asset)}
                  className={`group relative aspect-video rounded-3xl overflow-hidden cursor-pointer border-2 transition-all ${
                    isDarkMode ? 'border-white/5 hover:border-registry-teal/50' : 'border-slate-200 hover:border-registry-teal/50 shadow-sm'
                  }`}
                >
                  {asset.id === 'none' ? (
                    <div className={`w-full h-full flex flex-col items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                      <X className="w-8 h-8 text-slate-400" />
                      <p className="text-[8px] font-black uppercase tracking-widest mt-2">No Background</p>
                    </div>
                  ) : (
                    <img 
                      src={asset.data} 
                      alt={asset.id} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stealth-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-left">
                      <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest">{asset.category}</p>
                      <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate max-w-[100px]">{asset.id}</p>
                    </div>
                    {asset.type === 'user' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(asset.id); }}
                        className="p-2 bg-registry-rose/20 hover:bg-registry-rose text-registry-rose hover:text-white rounded-xl transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

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
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Assets Found in Category</p>
          </div>
        )}
      </div>
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
                <button onClick={() => setShowDeleteConfirm(null)} className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-4 bg-registry-rose text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-registry-rose/20 active:scale-95 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
