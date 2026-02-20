import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EvidenceCardProps {
  url: string;
  name?: string;
  date?: string;
  className?: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ url, name, date, className }) => {
  const isImage = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url.toLowerCase()) || url.includes('images.unsplash.com');

  return (
    <div className={cn("bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm", className)}>
      <div className="aspect-video bg-slate-100 flex items-center justify-center relative group">
        {isImage ? (
          <img src={url} alt={name || "Justificatif"} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <FileText className="w-12 h-12 mb-2" />
            <span className="text-xs font-medium uppercase">Document PDF/Fichier</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 bg-white rounded-full text-slate-900 hover:bg-slate-100 transition-colors"
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <a 
            href={url} 
            download
            className="p-2 bg-white rounded-full text-slate-900 hover:bg-slate-100 transition-colors"
            title="Télécharger"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      {(name || date) && (
        <div className="p-3">
          {name && <p className="text-sm font-medium text-slate-900 truncate">{name}</p>}
          {date && <p className="text-xs text-slate-500 mt-0.5">{date}</p>}
        </div>
      )}
    </div>
  );
};
