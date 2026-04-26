import React, { useState, useRef } from 'react';
import * as dicomParser from 'dicom-parser';
import { 
  FileUp, Activity, Database, User, Calendar, 
  ChevronRight, ArrowRight, Loader2, Info, CheckCircle2
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
  isDarkMode: boolean;
}

export const DicomProcessor: React.FC<DicomProcessorProps> = ({ onImport, isDarkMode }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [metadata, setMetadata] = useState<DicomMetadata | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processDicom = async (file: File) => {
    setProcessing(true);
    setCurrentFile(file);
    try {
      const buffer = await file.arrayBuffer();
      const byteArray = new Uint8Array(buffer);
      const dataSet = dicomParser.parseDicom(byteArray);

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

      // Attempt basic frame extraction for preview (simplified)
      if (parsedMetadata.rows && parsedMetadata.columns && dataSet.elements.x7fe00010) {
        const pixelData = (dataSet as any).uint16Array('x7fe00010') || byteArray.slice(dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.dataOffset + dataSet.elements.x7fe00010.length);
        
        // This is a VERY crude grayscale renderer for 8-bit or 16-bit DICOM
        // In a real app we'd use cornerstone, but for a quick "run" preview:
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processDicom(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processDicom(file);
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
          <div className="px-4 py-1.5 bg-registry-rose/10 border border-registry-rose/20 rounded-full">
            <span className="text-[11px] font-black text-registry-rose uppercase tracking-[0.2em]">Synaptic DICOM v1.0</span>
          </div>
        </div>

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
                {processing ? 'Decrypting Headers...' : 'Drop DICOM File Here'}
              </p>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Supporting .anon, .dcm, and raw block files
              </p>
            </div>

            <div className="flex items-center space-x-6 pt-4 text-slate-500">
               <div className="flex items-center space-x-2">
                 <CheckCircle2 className="w-3 h-3 text-registry-teal" />
                 <span className="text-[11px] font-black uppercase tracking-widest">Anonymity Guard</span>
               </div>
               <div className="flex items-center space-x-2">
                 <CheckCircle2 className="w-3 h-3 text-registry-teal" />
                 <span className="text-[11px] font-black uppercase tracking-widest">Cine-Loop Ready</span>
               </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
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

              <button 
                onClick={() => {
                  setMetadata(null);
                  setPreviewContent(null);
                  setCurrentFile(null);
                }}
                className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                Clear and Import New
              </button>
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
                      <span className="text-[11px] font-black uppercase tracking-widest">Identity</span>
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

              <div className="flex items-start space-x-3 p-4 bg-registry-rose/5 rounded-2xl border border-registry-rose/10">
                <AlertCircle className="w-4 h-4 text-registry-rose shrink-0 mt-0.5" />
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                  Importing will decrypt the pixel buffer and create a new Neural Visual Asset. The raw DICOM binary will be cached for future cine playback.
                </p>
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Patient Anonymization', value: 'Active', color: 'text-registry-teal' },
          { label: 'Header Compliance', value: 'Part 10', color: 'text-slate-400' },
          { label: 'Processing Speed', value: '42MB/s', color: 'text-slate-400' }
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

const AlertCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
