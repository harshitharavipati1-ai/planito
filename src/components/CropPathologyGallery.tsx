import React, { useState } from 'react';
import { 
  Sprout, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Eye, 
  Sparkles, 
  X, 
  ArrowRight, 
  Info, 
  Bug, 
  Layers,
  Search
} from 'lucide-react';

export interface CropReferenceItem {
  id: string;
  name: string;
  cropType: string;
  scientificName: string;
  category: 'Fungal Disease' | 'Healthy Crop' | 'Viral Infection';
  statusLabel: string;
  badgeClass: string;
  localUrl: string;
  fallbackUrl: string;
  symptoms: string;
  pathogenOrVector: string;
  remedy: string;
  plantHint: string;
  defaultScore: number;
  diseaseName: string;
  pestName: string;
}

export const CROP_REFERENCE_LIBRARY: CropReferenceItem[] = [
  {
    id: 'tomato_early_blight',
    name: 'Tomato - Early Blight',
    cropType: 'Tomato',
    scientificName: 'Alternaria solani',
    category: 'Fungal Disease',
    statusLabel: 'Fungal Leaf Spot • High Severity',
    badgeClass: 'bg-rose-950/90 text-rose-300 border-rose-500/50',
    localUrl: '/tomato_early_blight.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    symptoms: 'Dark brown concentric "target-board" rings with a chlorotic yellow halo on older lower foliage, leading to premature defoliation.',
    pathogenOrVector: 'Fungal spores (Alternaria solani) spread via splashing rain & wind.',
    remedy: 'Apply copper-based fungicide or organic neem emulsion; prune infected lower leaves and avoid overhead sprinkler irrigation.',
    plantHint: 'Tomato Crop',
    defaultScore: 58,
    diseaseName: 'Early Blight (Alternaria solani)',
    pestName: 'None detected'
  },
  {
    id: 'healthy_paddy_rice',
    name: 'Paddy Rice - Healthy Vigorous Crop',
    cropType: 'Paddy Rice',
    scientificName: 'Oryza sativa',
    category: 'Healthy Crop',
    statusLabel: 'Optimal Health • Zero Lesions',
    badgeClass: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50',
    localUrl: '/healthy_paddy_rice.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    symptoms: 'Vibrant emerald green upright blades, vigorous tillering, uniform canopy height, zero blast lesions or sheath rot symptoms.',
    pathogenOrVector: 'None (Healthy specimen in peak vegetative growth).',
    remedy: 'Maintain balanced Nitrogen-Phosphorus-Potassium (NPK) nutrition and consistent field water level (2-3 inches).',
    plantHint: 'Paddy Rice',
    defaultScore: 98,
    diseaseName: 'Healthy Crop (No Disease)',
    pestName: 'None detected'
  },
  {
    id: 'cotton_leaf_curl_virus',
    name: 'Cotton - Leaf Curl Virus (CLCuV)',
    cropType: 'Cotton',
    scientificName: 'Begomovirus spp.',
    category: 'Viral Infection',
    statusLabel: 'Viral Epidemic • Whitefly Vector',
    badgeClass: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
    localUrl: '/cotton_leaf_curl.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    symptoms: 'Upward and downward curling of leaf margins, darkened vein thickening, leaf cup-formation, and green enations on undersides.',
    pathogenOrVector: 'Whitefly (Bemisia tabaci) insect vector transmitting Begomovirus.',
    remedy: 'Deploy yellow sticky traps for whiteflies; apply organic insecticidal soap or neem spray; utilize CLCuV-tolerant seeds.',
    plantHint: 'Cotton Crop',
    defaultScore: 45,
    diseaseName: 'Cotton Leaf Curl Virus (CLCuV)',
    pestName: 'Whitefly (Bemisia tabaci) vector'
  }
];

interface CropPathologyGalleryProps {
  onSelectSample?: (item: CropReferenceItem) => void;
  title?: string;
  subtitle?: string;
}

export const CropPathologyGallery: React.FC<CropPathologyGalleryProps> = ({
  onSelectSample,
  title = 'AI Crop Pathology & Reference Encyclopedia',
  subtitle = 'High-resolution diagnostic reference imagery for Tomato Early Blight, Healthy Paddy Rice, and Cotton Leaf Curl Virus.'
}) => {
  const [zoomedItem, setZoomedItem] = useState<CropReferenceItem | null>(null);
  const [imageSources, setImageSources] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    CROP_REFERENCE_LIBRARY.forEach(item => {
      initial[item.id] = item.localUrl;
    });
    return initial;
  });

  const handleImageError = (id: string, fallbackUrl: string) => {
    setImageSources(prev => ({
      ...prev,
      [id]: fallbackUrl
    }));
  };

  return (
    <div id="crop-pathology-gallery-section" className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
      {/* Section Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>3 Key Reference Pathologies</span>
          </span>
        </div>
      </div>

      {/* 3-Column Diagnostic Reference Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CROP_REFERENCE_LIBRARY.map((item) => {
          const currentSrc = imageSources[item.id] || item.localUrl;
          return (
            <div
              key={item.id}
              id={`reference-card-${item.id}`}
              className="group rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-600/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg"
            >
              <div>
                {/* Image Container with Zoom & Badge */}
                <div className="relative aspect-video overflow-hidden bg-slate-900 border-b border-slate-800">
                  <img
                    src={currentSrc}
                    alt={item.name}
                    onError={() => handleImageError(item.id, item.fallbackUrl)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Status Tag */}
                  <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[11px] font-bold border backdrop-blur-md shadow-sm ${item.badgeClass}`}>
                    {item.statusLabel}
                  </div>

                  {/* Quick Zoom Button */}
                  <button
                    type="button"
                    onClick={() => setZoomedItem(item)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-700/80 shadow-md transition-all opacity-90 hover:opacity-100"
                    title="View Full Resolution Photo & Symptoms"
                  >
                    <Eye className="w-4 h-4 text-emerald-400" />
                  </button>

                  {/* Crop Type Tag */}
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-slate-200 border border-white/10">
                    {item.cropType} • <span className="italic">{item.scientificName}</span>
                  </div>
                </div>

                {/* Card Body & Diagnostic Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  {/* Symptoms & Pathogen */}
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-300">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Key Visual Symptoms</span>
                      </p>
                      <p className="leading-relaxed">{item.symptoms}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-300">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                        <Bug className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pathogen / Vector</span>
                      </p>
                      <p className="leading-relaxed">{item.pathogenOrVector}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomedItem(item)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Inspect Details</span>
                </button>

                {onSelectSample && (
                  <button
                    type="button"
                    onClick={() => onSelectSample(item)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Diagnose</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Resolution Zoom Modal */}
      {zoomedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-950 rounded-2xl border border-emerald-500/40 max-w-3xl w-full overflow-hidden shadow-2xl my-8">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{zoomedItem.name}</h3>
                  <p className="text-xs text-slate-400 italic">{zoomedItem.scientificName} • {zoomedItem.category}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setZoomedItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Resolution Image Preview */}
            <div className="relative aspect-video bg-black flex items-center justify-center border-b border-slate-800">
              <img
                src={imageSources[zoomedItem.id] || zoomedItem.localUrl}
                alt={zoomedItem.name}
                onError={() => handleImageError(zoomedItem.id, zoomedItem.fallbackUrl)}
                className="max-h-[60vh] w-auto h-auto object-contain"
              />
              <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold border backdrop-blur-md ${zoomedItem.badgeClass}`}>
                {zoomedItem.statusLabel}
              </div>
            </div>

            {/* Comprehensive Diagnostic Notes */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Identified Symptoms</span>
                  <p className="text-slate-200 leading-relaxed font-medium">{zoomedItem.symptoms}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pathogen / Vector Mechanism</span>
                  <p className="text-slate-200 leading-relaxed font-medium">{zoomedItem.pathogenOrVector}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-1.5 text-xs">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Recommended Remediation & Field Protocol</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{zoomedItem.remedy}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setZoomedItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                >
                  Close Photo Preview
                </button>
                {onSelectSample && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSample(zoomedItem);
                      setZoomedItem(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-emerald-600/30 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Load & Diagnose This Crop Sample</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
