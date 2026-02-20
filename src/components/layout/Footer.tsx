export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm">
              © {currentYear} <span className="font-semibold text-white">ATLAS WHOLE SALE</span> - Système de Gestion Agricole
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Tous droits réservés
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-xs">
            <span className="text-slate-400">Version 1.0.0</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Développé au Cameroun</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
