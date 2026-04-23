import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Edit2, Save, Video, Image as ImageIcon, 
  ChevronRight, Search, LayoutDashboard, Database, Shield,
  CheckCircle2, AlertCircle, Loader2, Play, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { VideoItem, VisualItem, Question } from '../src/mediaData';

interface AdminDashboardProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'visuals'>('videos');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [visuals, setVisuals] = useState<VisualItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
        setVisuals(data.visuals || []);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
      toast.error('Failed to load media data');
    } finally {
      setLoading(false);
    }
  };

  const saveMedia = async (updatedVideos: VideoItem[], updatedVisuals: VisualItem[]) => {
    setSaving(true);
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: updatedVideos, visuals: updatedVisuals }),
      });
      if (response.ok) {
        toast.success('Media library updated successfully');
        setVideos(updatedVideos);
        setVisuals(updatedVisuals);
      }
    } catch (error) {
      console.error('Failed to save media:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = () => {
    const newItem = activeTab === 'videos' ? {
      id: `vid-${Date.now()}`,
      title: 'New Video Lecture',
      description: 'Enter description here...',
      citation: '',
      embedUrl: '',
      thumbnail: '',
      duration: '0:00',
      script: '',
      assessment: []
    } : {
      id: `vis-${Date.now()}`,
      title: 'New Visual Asset',
      description: 'Enter description here...',
      imageUrl: '',
      category: 'Physics Basics',
      assessment: []
    };
    
    setEditingItem(newItem);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    if (file.size > 200 * 1024 * 1024) {
      toast.error('Video file too large (max 200MB)');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setEditingItem({
          ...editingItem,
          embedUrl: result.url,
          thumbnail: 'https://images.unsplash.com/photo-1576091160399-11ba23d2e0a3?auto=format&fit=crop&w=1920&q=80' // Tech medical placeholder for uploaded video
        });
        toast.success('Video uploaded successfully');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to upload video');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading video');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    if (activeTab === 'videos') {
      const updated = videos.filter(v => v.id !== id);
      saveMedia(updated, visuals);
    } else {
      const updated = visuals.filter(v => v.id !== id);
      saveMedia(videos, updated);
    }
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    if (activeTab === 'videos') {
      const index = videos.findIndex(v => v.id === editingItem.id);
      let updated;
      if (index >= 0) {
        updated = [...videos];
        updated[index] = editingItem;
      } else {
        updated = [...videos, editingItem];
      }
      saveMedia(updated, visuals);
    } else {
      const index = visuals.findIndex(v => v.id === editingItem.id);
      let updated;
      if (index >= 0) {
        updated = [...visuals];
        updated[index] = editingItem;
      } else {
        updated = [...visuals, editingItem];
      }
      saveMedia(videos, updated);
    }
    setEditingItem(null);
  };

  const filteredItems = activeTab === 'videos' 
    ? videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : visuals.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col ${isDarkMode ? 'bg-stealth-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`p-6 border-b ${isDarkMode ? 'border-white/10 bg-stealth-950/80' : 'border-slate-200 bg-white/80'} backdrop-blur-xl flex justify-between items-center relative z-10`}>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-registry-rose/10 rounded-2xl border border-registry-rose/20">
            <Shield className="w-6 h-6 text-registry-rose" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Admin Dashboard</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Media Content Management</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleAddItem}
            className="flex items-center space-x-2 px-4 py-2 bg-registry-teal text-stealth-950 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>Add {activeTab === 'videos' ? 'Video' : 'Visual'}</span>
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Tabs & Search */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5">
          <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'videos' ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Video className="w-3 h-3 inline-block mr-2" />
              Lectures
            </button>
            <button
              onClick={() => setActiveTab('visuals')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'visuals' ? 'bg-registry-teal text-stealth-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <ImageIcon className="w-3 h-3 inline-block mr-2" />
              Visuals
            </button>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all outline-none border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-10 h-10 text-registry-teal animate-spin" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessing Media Vault...</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className={`group relative rounded-3xl border overflow-hidden transition-all ${isDarkMode ? 'bg-white/5 border-white/10 hover:border-registry-teal/30' : 'bg-white border-slate-200 hover:shadow-xl'}`}
                >
                  <div className="aspect-video relative bg-black">
                    {(activeTab === 'videos' ? (item as VideoItem).thumbnail : (item as VisualItem).imageUrl) ? (
                      <img 
                        src={activeTab === 'videos' ? (item as VideoItem).thumbnail : (item as VisualItem).imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover opacity-60"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        {activeTab === 'videos' ? <Video className="w-8 h-8 text-slate-600" /> : <ImageIcon className="w-8 h-8 text-slate-600" />}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingItem(item)}
                          className="p-3 bg-registry-teal text-stealth-950 rounded-xl shadow-lg hover:scale-110 transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-3 bg-registry-rose text-white rounded-xl shadow-lg hover:scale-110 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-black text-registry-teal uppercase tracking-widest">
                        {activeTab === 'videos' ? (item as VideoItem).duration : (item as VisualItem).category}
                      </span>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">ID: {item.id}</span>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-tighter truncate mb-2">{item.title}</h3>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-stealth-950/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] border shadow-2xl flex flex-col ${isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-registry-teal/10 to-transparent">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-registry-teal/20 rounded-2xl">
                    <Edit2 className="w-6 h-6 text-registry-teal" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Edit {activeTab === 'videos' ? 'Lecture' : 'Visual'}</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Modify Core Media Data</p>
                  </div>
                </div>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Title</label>
                      <input 
                        type="text" 
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                        className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Description</label>
                      <textarea 
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                        className={`w-full h-32 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors resize-none`}
                      />
                    </div>

                    {activeTab === 'videos' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Duration</label>
                          <input 
                            type="text" 
                            value={editingItem.duration}
                            onChange={(e) => setEditingItem({...editingItem, duration: e.target.value})}
                            className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Video Source</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => setEditingItem({...editingItem, isLocal: false})}
                              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${!editingItem.isLocal ? 'bg-registry-teal/10 border-registry-teal text-registry-teal' : 'bg-white/5 border-white/5 text-slate-500'}`}
                            >
                              YouTube
                            </button>
                            <button 
                              onClick={() => setEditingItem({...editingItem, isLocal: true})}
                              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${editingItem.isLocal ? 'bg-registry-teal/10 border-registry-teal text-registry-teal' : 'bg-white/5 border-white/5 text-slate-500'}`}
                            >
                              Upload File
                            </button>
                          </div>
                        </div>

                        {editingItem.isLocal ? (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Upload Video File</label>
                            <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${uploading ? 'opacity-50' : 'hover:border-registry-teal/50'}`}>
                              <input 
                                type="file" 
                                accept="video/*"
                                onChange={handleVideoUpload}
                                disabled={uploading}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <div className="flex flex-col items-center">
                                {uploading ? (
                                  <Loader2 className="w-8 h-8 text-registry-teal animate-spin mb-2" />
                                ) : (
                                  <Plus className="w-8 h-8 text-slate-500 mb-2" />
                                )}
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                  {editingItem.embedUrl?.startsWith('/api/video/') ? 'Video Uploaded' : 'Click to Upload Video'}
                                </p>
                                {editingItem.embedUrl?.startsWith('/api/video/') && (
                                  <p className="text-[8px] font-mono text-registry-teal mt-1 truncate max-w-full px-4">
                                    {editingItem.embedUrl.split('/').pop()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">YouTube ID</label>
                            <input 
                              type="text" 
                              value={editingItem.embedUrl?.includes('youtube.com') ? editingItem.embedUrl.split('/').pop() : ''}
                              onChange={(e) => setEditingItem({
                                ...editingItem, 
                                isLocal: false,
                                embedUrl: `https://www.youtube.com/embed/${e.target.value}`,
                                thumbnail: `https://img.youtube.com/vi/${e.target.value}/hqdefault.jpg`
                              })}
                              className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Citation (Optional)</label>
                            <input 
                              type="text" 
                              value={editingItem.citation || ''}
                              onChange={(e) => setEditingItem({...editingItem, citation: e.target.value})}
                              placeholder="e.g. Source: Radiology Tutorials"
                              className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                            />
                          </div>
                        </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Category</label>
                        <select 
                          value={editingItem.category}
                          onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                          className={`w-full ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                        >
                          <option value="Physics Basics">Physics Basics</option>
                          <option value="Transducers">Transducers</option>
                          <option value="Image Formation">Image Formation</option>
                          <option value="Artifacts">Artifacts</option>
                          <option value="Doppler">Doppler</option>
                          <option value="Hemodynamics">Hemodynamics</option>
                          <option value="OB/GYN">OB/GYN</option>
                          <option value="Vascular">Vascular</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">
                        {activeTab === 'videos' ? 'Thumbnail Preview' : 'Image URL'}
                      </label>
                      {activeTab === 'visuals' && (
                        <input 
                          type="text" 
                          value={editingItem.imageUrl}
                          onChange={(e) => setEditingItem({...editingItem, imageUrl: e.target.value})}
                          className={`w-full mb-4 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors`}
                        />
                      )}
                      <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black relative group">
                        {(activeTab === 'videos' ? editingItem.thumbnail : editingItem.imageUrl) ? (
                          <img 
                            src={activeTab === 'videos' ? editingItem.thumbnail : editingItem.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-80"
                            referrerPolicy="no-referrer"
                          />
                        ) : null}
                        {!(activeTab === 'videos' ? editingItem.thumbnail : editingItem.imageUrl) && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                            <ImageIcon className="w-12 h-12 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Preview Available</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {activeTab === 'videos' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Lecture Script</label>
                        <textarea 
                          value={editingItem.script}
                          onChange={(e) => setEditingItem({...editingItem, script: e.target.value})}
                          className={`w-full h-48 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-2xl py-4 px-4 text-sm font-bold outline-none focus:border-registry-teal transition-colors resize-none`}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Assessment Section */}
                <div className="space-y-6 pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Assessment Questions</h3>
                    <button 
                      onClick={() => {
                        const newQuestion: Question = {
                          id: `q-${Date.now()}`,
                          question: 'New Question',
                          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                          correctAnswer: 0,
                          explanation: 'Explanation here...'
                        };
                        setEditingItem({
                          ...editingItem,
                          assessment: [...(editingItem.assessment || []), newQuestion]
                        });
                      }}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <Plus className="w-3 h-3 inline-block mr-2" />
                      Add Question
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {editingItem.assessment?.map((q: Question, qIdx: number) => (
                      <div key={q.id} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} space-y-4`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-2">
                            <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest ml-2">Question {qIdx + 1}</label>
                            <input 
                              type="text" 
                              value={q.question}
                              onChange={(e) => {
                                const updated = [...editingItem.assessment];
                                updated[qIdx].question = e.target.value;
                                setEditingItem({...editingItem, assessment: updated});
                              }}
                              className={`w-full ${isDarkMode ? 'bg-stealth-950 border-white/10' : 'bg-white border-slate-200'} border rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-registry-teal transition-colors`}
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const updated = editingItem.assessment.filter((_: any, i: number) => i !== qIdx);
                              setEditingItem({...editingItem, assessment: updated});
                            }}
                            className="p-2 text-registry-rose hover:bg-registry-rose/10 rounded-lg ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center space-x-2">
                              <button 
                                onClick={() => {
                                  const updated = [...editingItem.assessment];
                                  updated[qIdx].correctAnswer = oIdx;
                                  setEditingItem({...editingItem, assessment: updated});
                                }}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${q.correctAnswer === oIdx ? 'border-registry-teal bg-registry-teal text-stealth-950' : 'border-slate-500'}`}
                              >
                                {q.correctAnswer === oIdx && <CheckCircle2 className="w-4 h-4" />}
                              </button>
                              <input 
                                type="text" 
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...editingItem.assessment];
                                  updated[qIdx].options[oIdx] = e.target.value;
                                  setEditingItem({...editingItem, assessment: updated});
                                }}
                                className={`flex-1 ${isDarkMode ? 'bg-stealth-950 border-white/10' : 'bg-white border-slate-200'} border rounded-xl py-2 px-4 text-[10px] font-bold outline-none focus:border-registry-teal transition-colors`}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest ml-2">Explanation</label>
                          <textarea 
                            value={q.explanation}
                            onChange={(e) => {
                              const updated = [...editingItem.assessment];
                              updated[qIdx].explanation = e.target.value;
                              setEditingItem({...editingItem, assessment: updated});
                            }}
                            className={`w-full h-20 ${isDarkMode ? 'bg-stealth-950 border-white/10' : 'bg-white border-slate-200'} border rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-registry-teal transition-colors resize-none`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 flex justify-end space-x-4 bg-white/5">
                <button 
                  onClick={() => setEditingItem(null)}
                  className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="px-12 py-4 bg-registry-teal text-stealth-950 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-registry-teal/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center space-x-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
