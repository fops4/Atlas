# 🚀 Guide de Déploiement - Atlas Dashboard

## Installation Locale

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

1. **Cloner/Extraire le projet**
```bash
cd atlas-dashboard
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer en développement**
```bash
npm run dev
```

L'application sera accessible sur: `http://localhost:5173`

4. **Identifiants de test**
- Email: `raf@atlas.com`
- Password: `demo123`

## Build Production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`

## Déploiement

### Option 1: Vercel (Recommandé)

1. Installer Vercel CLI:
```bash
npm i -g vercel
```

2. Déployer:
```bash
vercel
```

### Option 2: Netlify

1. Build:
```bash
npm run build
```

2. Glisser-déposer le dossier `dist/` sur Netlify

### Option 3: Serveur classique (Apache/Nginx)

1. Build:
```bash
npm run build
```

2. Copier le contenu de `dist/` vers le dossier web du serveur

3. Configuration Nginx exemple:
```nginx
server {
    listen 80;
    server_name atlas.example.com;
    root /var/www/atlas-dashboard;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Variables d'Environnement

Créer un fichier `.env` à la racine:

```env
# API Backend URL (à remplacer quand le backend sera prêt)
VITE_API_URL=https://api.atlas.example.com

# Environment
VITE_ENV=production
```

## Intégration Backend (À venir)

Quand le backend sera prêt, modifier `src/services/mockApi.ts` pour utiliser les vrais endpoints:

```typescript
const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
  // ... autres endpoints
};
```

## Performance

Le build production inclut:
- ✅ Code splitting automatique
- ✅ Tree shaking
- ✅ Minification
- ✅ Compression gzip
- ✅ Lazy loading des routes

## Monitoring

Pour le monitoring en production, vous pouvez ajouter:
- Sentry pour le tracking d'erreurs
- Google Analytics pour les statistiques
- LogRocket pour les sessions utilisateurs

## Support Navigateurs

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notes Importantes

⚠️ **Actuellement en mode DEMO**: Le dashboard utilise des données mock. 
L'intégration avec le backend réel sera faite dans la prochaine phase.

✅ **Fonctionnalités implémentées**:
- Hub Financier complet (validation paiements)
- Dashboard avec KPIs et graphiques
- Authentification
- Navigation RBAC
- Design system complet

🚧 **En développement**:
- Intégration API backend
- Mode offline
- Pages RH, Opérations, Logistique, Assets
