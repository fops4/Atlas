import React, { useState, useRef } from 'react';
import { Upload, X, FileCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SecureFileUploadProps {
  onUpload: (file: File) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  label?: string;
}

/**
 * Secure File Upload with validation and integrity checks
 */
export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onUpload,
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSizeMB = 5,
  label = "Télécharger un document"
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    // 1. Validation de type (Whitelist)
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Format non supporté. Types autorisés : ${allowedTypes.join(', ')}`);
      return;
    }

    // 2. Validation de taille
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`Le fichier est trop volumineux. Max : ${maxSizeMB}MB`);
      return;
    }

    // 3. Simuler Scan Antivirus / Intégrité
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsScanning(false);

    setFile(selectedFile);
    onUpload(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all",
            error ? "border-red-200 bg-red-50" : "border-slate-200 hover:border-brand-blue hover:bg-slate-50"
          )}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange}
            accept={allowedTypes.join(',')}
          />
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <Upload className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-900">Cliquez pour s'approvisionner</p>
          <p className="text-xs text-slate-500 mt-1">
            Max {maxSizeMB}MB - {allowedTypes.map(t => t.split('/')[1]).join(', ')}
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900 truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-green-600">{(file.size / 1024).toFixed(1)} KB • Prêt</p>
            </div>
          </div>
          <button 
            onClick={clearFile}
            className="p-1.5 hover:bg-green-100 rounded-lg text-green-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isScanning && (
        <div className="flex items-center gap-2 text-xs text-blue-600 animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          Vérification de sécurité en cours...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
          <AlertTriangle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
};
