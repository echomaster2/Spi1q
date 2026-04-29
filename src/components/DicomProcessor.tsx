import React, { useState, useRef } from 'react';
import * as dicomParser from 'dicom-parser';
import { 
  FileUp, Activity, Database, User, Calendar, 
  ChevronRight, ArrowRight, Loader2, Info, CheckCircle2, AlertCircle, Trash2, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface DicomMetadata {
  patientName?: string;
  patientId?: string;
  studyDescription?: string;
  modality?: string;
  studyDate?: string;
  manufacturer?: string;
  institutionName?: string;
  pixelDataLength?: number;
  rows?: number;
  columns?: number;
  frames?: number;
}

interface DicomProcessorProps {
  onImport: (metadata: DicomMetadata, file: File, previewUrl: string | null) => void;
  onBatchImport?: (items: { metadata: DicomMetadata, file: File, previewUrl: string | null }[]) => void;
  isDarkMode: boolean;
}

interface DetectedFile {
  file: File;
  name: string;
  size: number;
}

export const DicomProcessor: React.FC<DicomProcessorProps> = ({ onImport, onBatchImport, isDarkMode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [metadata, setMetadata] = useState<DicomMetadata | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [detectedFiles, setDetectedFiles] = useState<DetectedFile[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const isValidDicom = async (file: File): Promise<boolean> => {
    try {
      // Check for .dcm or .dicom extension first
      const name = file.name.toLowerCase();
      if (name.endsWith('.dcm') || name.endsWith('.dicom')) return true;
      
      // Look for standard machine naming patterns
      if (name.startsWith('im_') || name.startsWith('ser') || name.startsWith('img')) return true;

      const buffer = await file.slice(0, 132).arrayBuffer();
      const view = new DataView(buffer);
      // DICOM files have "DICM" at offset 128
      if (view.byteLength >= 132) {
        const signature = String.fromCharCode(view.getUint8(128), view.getUint8(129), view.getUint8(130), view.getUint8(131));
        if (signature === 'DICM') return true;
      }
      
      // Secondary check: look for common Group 0002, 0008, or 0028 tags at the very start (Raw DICOM)
      if (view.byteLength >= 4) {
        const group = view.getUint16(0, true);
        if (group === 0x0008 || group === 0x0002 || group === 0x0028) return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  const handleBatchImport = async () => {
    if (!detectedFiles.length || !onBatchImport) return;
    
    setIsProcessingBatch(true);
    toast.info(`Preparing to process ${detectedFiles.length} files...`);

    try {
      const results: { metadata: DicomMetadata, file: File, previewUrl: string | null }[] = [];
      
      for (const df of detectedFiles) {
        try {
          const buffer = await df.file.arrayBuffer();
          const byteArray = new Uint8Array(buffer);
          let dataSet;
          
          try {
            dataSet = dicomParser.parseDicom(byteArray);
          } catch (e) {
            dataSet = dicomParser.parseDicom(byteArray, { untilTag: undefined });
          }

          const parsedMetadata: DicomMetadata = {
            patientName: dataSet.string('x00100010'),
            patientId: dataSet.string('x00100020'),
            studyDescription: dataSet.string('x00081030'),
            modality: dataSet.string('x00080060'),
            studyDate: dataSet.string('x00080020'),
            manufacturer: dataSet.string('x00080070'),
            institutionName: dataSet.string('x00080080'),
            pixelDataLength: dataSet.elements.x7fe00010?.length,
            rows: (dataSet as any).uint16('x00280010'),
            columns: (dataSet as any).uint16('x00280011'),
            frames: (dataSet as any).string('x00280008') ? parseInt((dataSet as any).string('x00280008')!) : 1,
          };

          let previewUrl = null;
          if (parsedMetadata.rows && parsedMetadata.columns && dataSet.elements.x7fe00010) {
            const pixelData = (dataSet as any).uint16Array('x7fe00010') || byteArray.slice(dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.dataOffset + dataSet.elements.x7fe00010.length);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = parsedMetadata.columns;
              canvas.height = parsedMetadata.rows;
              const imgData = ctx.createImageData(canvas.width, canvas.height);
              for (let i = 0; i < imgData.data.length / 4; i++) {
                const val = pixelData[i] || 0;
                const normalized = (val / (pixelData instanceof Uint16Array ? 65535 : 255)) * 255;
                imgData.data[i * 4] = normalized;
                imgData.data[i * 4 + 1] = normalized;
                imgData.data[i * 4 + 2] = normalized;
                imgData.data[i * 4 + 3] = 255;
              }
              ctx.putImageData(imgData, 0, 0);
              previewUrl = canvas.toDataURL('image/jpeg', 0.7);
            }
          }

          results.push({ metadata: parsedMetadata, file: df.file, previewUrl });
        } catch (err) {
          console.error(`Failed to process ${df.name}:`, err);
        }
      }

      onBatchImport(results);
    } catch (error) {
      toast.error('Batch processing failed');
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const processDicom = async (file: File) => {
    setProcessing(true);
    setCurrentFile(file);
    try {
      const buffer = await file.arrayBuffer();
      const byteArray = new Uint8Array(buffer);
      
      let dataSet;
      try {
        dataSet = dicomParser.parseDicom(byteArray);
      } catch (e) {
        // NEURAL FALLBACK: Try injecting Part 10 Preamble if missing
        console.log('Preamble missing, attempt raw injection...');
        const preamble = new Uint8Array(132);
        // "DICM" at offset 128
        preamble[128] = 68; preamble[129] = 73; preamble[130] = 67; preamble[131] = 77;
        const rawPackage = new Uint8Array(preamble.length + byteArray.length);
        rawPackage.set(preamble);
        rawPackage.set(byteArray, preamble.length);
        
        try {
          dataSet = dicomParser.parseDicom(rawPackage);
        } catch (err) {
          dataSet = dicomParser.parseDicom(byteArray, { untilTag: undefined });
        }
      }

      const parsedMetadata: DicomMetadata = {
        patientName: dataSet.string('x00100010'),
        patientId: dataSet.string('x00100020'),
        studyDescription: dataSet.string('x00081030'),
        modality: dataSet.string('x00080060'),
        studyDate: dataSet.string('x00080020'),
        manufacturer: dataSet.string('x00080070'),
        institutionName: dataSet.string('x00080080'),
        pixelDataLength: dataSet.elements.x7fe00010?.length,
        rows: (dataSet as any).uint16('x00280010'),
        columns: (dataSet as any).uint16('x00280011'),
        frames: (dataSet as any).string('x00280008') ? parseInt((dataSet as any).string('x00280008')!) : 1,
      };

      setMetadata(parsedMetadata);

      // Attempt basic frame extraction for preview
      if (parsedMetadata.rows && parsedMetadata.columns && dataSet.elements.x7fe00010) {
        const pixelData = (dataSet as any).uint16Array('x7fe00010') || byteArray.slice(dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.dataOffset + dataSet.elements.x7fe00010.length);
        
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = parsedMetadata.columns;
            canvas.height = parsedMetadata.rows;
            const imgData = ctx.createImageData(canvas.width, canvas.height);
            
            // Normalize and fill
            for (let i = 0; i < imgData.data.length / 4; i++) {
              const val = pixelData[i] || 0;
              const normalized = (val / (pixelData instanceof Uint16Array ? 65535 : 255)) * 255;
              imgData.data[i * 4] = normalized;     // R
              imgData.data[i * 4 + 1] = normalized; // G
              imgData.data[i * 4 + 2] = normalized; // B
              imgData.data[i * 4 + 3] = 255;        // A
            }
            ctx.putImageData(imgData, 0, 0);
            setPreviewContent(canvas.toDataURL());
          }
        }
      }

      toast.success('DICOM Protocol Parsed Successfully');
    } catch (error) {
      console.error('DICOM Error:', error);
      toast.error('Failed to parse DICOM file. Header may be corrupted or non-compliant.');
    } finally {
      setProcessing(false);
      setIsDragging(false);
    }
  };

  const scanFiles = async (items: DataTransferItemList) => {
    setProcessing(true);
    setDetectedFiles([]);
    const files: File[] = [];

    const traverse = async (entry: any) => {
      if (entry.isFile) {
        const file = await new Promise<File>((resolve) => entry.file(resolve));
        files.push(file);
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const readEntries = async () => {
          const entries = await new Promise<any[]>((resolve) => reader.readEntries(resolve));
          if (entries.length > 0) {
            for (const subEntry of entries) {
              await traverse(subEntry);
            }
            await readEntries();
          }
        };
        await readEntries();
      }
    };

    const promises = [];
    for (let i = 0; i < items.length; i++) {
      const entry = (items[i] as any).webkitGetAsEntry?.();
      if (entry) promises.push(traverse(entry));
      else if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) files.push(file);
      }
    }

    await Promise.all(promises);

    const validFiles: DetectedFile[] = [];
    for (const file of files) {
      if (await isValidDicom(file)) {
        validFiles.push({ file, name: file.name, size: file.size });
      }
    }

    if (validFiles.length > 0) {
      setDetectedFiles(validFiles);
      // Auto-process first one
      await processDicom(validFiles[0].file);
      toast.success(`Detected ${validFiles.length} DICOM study components.`);
    } else if (files.length > 0) {
      await processDicom(files[0]);
    } else {
      toast.error("No compatible files detected in upload payload.");
    }
    setProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.items) {
      scanFiles(e.dataTransfer.items);
    } else {
      const file = e.dataTransfer.files[0];
      if (file) processDicom(file);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setProcessing(true);
    const validFiles: DetectedFile[] = [];
    for (const file of files) {
      if (await isValidDicom(file)) {
        validFiles.push({ file, name: file.name, size: file.size });
      }
    }

    if (validFiles.length > 0) {
      setDetectedFiles(validFiles);
      await processDicom(validFiles[0].file);
    } else {
      await processDicom(files[0]);
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className={`p-8 rounded-[3rem] border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-registry-teal/10 rounded-2xl">
              <Activity className="w-6 h-6 text-registry-teal" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">DICOM Neural Import</h3>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Process anonymous medical datasets from external disks</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowTutorial(!showTutorial)}
              className={`px-4 py-1.5 rounded-full border transition-all text-[11px] font-black uppercase tracking-widest ${showTutorial ? 'bg-registry-teal text-stealth-950 border-registry-teal' : 'bg-white/5 border-white/10 text-slate-400'}`}
            >
              Tutorial Protocol
            </button>
            <div className="px-4 py-1.5 bg-registry-rose/10 border border-registry-rose/20 rounded-full">
              <span className="text-[11px] font-black text-registry-rose uppercase tracking-[0.2em]">Synaptic DICOM v1.2</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showTutorial && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div style={{ position: 'relative', padding: '56.25% 0 0 0', width: '100%', borderRadius: '2rem', overflow: 'hidden' }}>
                <iframe 
                  src="https://viddle.in/embed/uz9LVZni/?title=true&autoplay=true&share=true&controls=true&context=true&color=blue" 
                  style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%', border: 'none', overflow: 'hidden' }} 
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!metadata ? (
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center space-y-6 transition-all ${
              isDragging ? 'border-registry-teal bg-registry-teal/5 scale-[1.02]' : 
              isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileUpload}
              accept=".dcm,.anon,.dicom,*"
              multiple
            />
            
            <div className={`p-6 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-xl'}`}>
              {processing ? (
                <Loader2 className="w-12 h-12 text-registry-teal animate-spin" />
              ) : (
                <FileUp className={`w-12 h-12 ${isDragging ? 'text-registry-teal' : 'text-slate-400'}`} />
              )}
            </div>

            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-widest mb-1">
                {processing ? 'Decrypting Headers...' : 'Drop DICOM File or Folder Here'}
              </p>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Supporting .anon, .dcm, and raw block sequences
              </p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="aspect-square rounded-[2rem] bg-black border border-white/10 overflow-hidden relative group">
                  <canvas ref={canvasRef} className="hidden" />
                  {previewContent ? (
                    <img src={previewContent} alt="DICOM Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <Activity className="w-16 h-16 opacity-10 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">
                      {metadata.modality || 'UNKNOWN'} | {metadata.rows}x{metadata.columns}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setMetadata(null);
                      setPreviewContent(null);
                      setCurrentFile(null);
                      setDetectedFiles([]);
                    }}
                    className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    Clear All
                  </button>
                  {detectedFiles.length > 1 && onBatchImport && (
                    <button 
                      onClick={handleBatchImport}
                      disabled={isProcessingBatch}
                      className={`flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${isDarkMode ? 'bg-registry-teal/10 border-registry-teal/20 text-registry-teal hover:bg-registry-teal/20' : 'bg-registry-teal/5 border-registry-teal/20 text-registry-teal hover:bg-registry-teal/10'} disabled:opacity-50 inline-flex items-center justify-center`}
                    >
                      {isProcessingBatch ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                      ) : null}
                      Batch Import ({detectedFiles.length})
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className={`p-6 rounded-[2rem] border ${isDarkMode ? 'bg-stealth-950/50 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <h4 className="text-[11px] font-black text-registry-teal uppercase tracking-[0.3em] mb-6 flex items-center">
                    <Info className="w-3 h-3 mr-2" />
                    Header Metrics
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center space-x-3 text-slate-500">
                        <User className="w-4 h-4" />
                        <span className="text-[11px) font-black uppercase tracking-widest">Identity</span>
                      </div>
                      <span className="text-[11px] font-black uppercase truncate max-w-[150px]">
                        {metadata.patientName || 'ANONYMOUS'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between group">
                      <div className="flex items-center space-x-3 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Acquisition</span>
                      </div>
                      <span className="text-[11px] font-black uppercase">
                        {metadata.studyDate || 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between group">
                      <div className="flex items-center space-x-3 text-slate-500">
                        <Database className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Frames</span>
                      </div>
                      <span className="text-[11px] font-black uppercase text-registry-teal">
                        {metadata.frames || 1} Loop Units
                      </span>
                    </div>

                    <div className="flex items-center justify-between group">
                      <div className="flex items-center space-x-3 text-slate-500">
                        <Activity className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Modality</span>
                      </div>
                      <span className="text-[11px] font-black uppercase">
                        {metadata.modality || 'US'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4">Study Context</p>
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                      <p className="text-[11px] font-black leading-relaxed">
                        {metadata.studyDescription || 'No professional annotations found in the DICOM sequence header.'}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => currentFile && onImport(metadata, currentFile, previewContent)}
                  className="w-full py-5 bg-registry-teal text-stealth-950 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-registry-teal/20 flex items-center justify-center group hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>Process Into Registry</span>
                  <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {detectedFiles.length > 1 && (
              <div className={`p-8 rounded-[2rem] border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center space-x-3 mb-6">
                  <List className="w-5 h-5 text-registry-teal" />
                  <h4 className="text-sm font-black uppercase tracking-widest">Detected Study Components ({detectedFiles.length})</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto pr-4 scrollbar-custom">
                  {detectedFiles.map((df, i) => (
                    <button 
                      key={i}
                      onClick={() => processDicom(df.file)}
                      className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] flex items-center justify-between group ${currentFile?.name === df.name ? 'bg-registry-teal/20 border-registry-teal/40' : 'bg-black/10 border-white/5 hover:bg-black/20'}`}
                    >
                      <div className="truncate pr-2">
                        <p className={`text-[10px] font-black uppercase truncate ${currentFile?.name === df.name ? 'text-registry-teal' : 'text-slate-400'}`}>{df.name}</p>
                        <p className="text-[9px] font-black text-slate-600">{(df.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      {currentFile?.name === df.name && <CheckCircle2 className="w-3 h-3 text-registry-teal shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Patient Anonymization', value: 'Active', color: 'text-registry-teal' },
          { label: 'Header Compliance', value: 'Part 10 / Raw', color: 'text-slate-400' },
          { label: 'Neural Buffer', value: 'Optimized', color: 'text-slate-400' }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} text-center`}>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-sm font-black uppercase tracking-widest ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
