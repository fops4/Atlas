# Atlas Dashboard - Frontend Web

Système de gestion intégré pour exploitation agricole - Interface web React.js

## 🎯 Objectif

Dashboard de pilotage stratégique, financière et opérationnelle pour le système Atlas.

## 🎨 Design Philosophy

- **Approche**: Data-First - Interface propre, professionnelle, rassurante sur la précision des chiffres
- **Code Couleur**:
  - 🔵 **Bleu Holding** (Confiance/Sérieux) - `holding-*`
  - 🟢 **Vert** (Rentabilité/Validation) - `profit-*`
  - 🔴 **Rouge** (Alerte Fraude/Surcoût/Rejet) - `alert-*`

## 📦 Stack Technique

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## 🗂️ Structure du Projet

```
atlas-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/              # Composants réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── EvidenceCard.tsx
│   │   │   ├── FinancialInput.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Skeleton.tsx
│   │   └── layout/          # Layout components
│   │       ├── Layout.tsx
│   │       └── Sidebar.tsx
│   ├── pages/               # Pages principales
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FinancialHub.tsx
│   │   └── PlaceholderPages.tsx
│   ├── services/            # API services
│   │   └── mockApi.ts
│   ├── store/               # State management
│   │   └── authStore.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── format.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚀 Démarrage Rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build Production

```bash
npm run build
```

### Preview Production

```bash
npm run preview
```

## 🔐 Authentification

Le système utilise JWT pour l'authentification. Les identifiants de démonstration sont :

- **Email**: `raf@atlas.com`
- **Mot de passe**: `demo123`

## 📱 Pages Implémentées

### ✅ 1. Hub Financier (Priorité 1)

**Route**: `/finance`

**Fonctionnalités**:
- ✅ File d'attente des paiements en attente
- ✅ Evidence Viewer (panneau latéral)
- ✅ Affichage des preuves (photo + GPS + timestamp)
- ✅ Validation GPS (alerte si hors périmètre)
- ✅ Actions: Valider / Rejeter
- ✅ Modale de rejet avec saisie du motif
- ✅ Vue Ledger (registre comptable immuable)

**Rôles autorisés**: ADMIN, RAF, RH

### ✅ 2. Dashboard / Vue d'ensemble (Priorité 2)

**Route**: `/`

**Fonctionnalités**:
- ✅ Widgets KPI avec skeletons loading
  - Coût de revient global (YTD)
  - Marge brute estimée (%)
  - Taux de rejet des tâches
  - Personnel actif
- ✅ Graphique Coûts Réels vs Budget
- ✅ Liste des parcelles avec statuts colorés
- ✅ Statistiques rapides

### ✅ 3. Authentification (Priorité 3)

**Route**: `/login`

**Fonctionnalités**:
- ✅ Formulaire de connexion (Email/Tel + Password)
- ✅ Gestion des erreurs
- ✅ Stockage sécurisé du token JWT
- ✅ Redirection automatique après login

### 🚧 4. Pages En Développement

- **Ressources Humaines** (`/hr`) - Placeholder
- **Exploitation Agricole** (`/operations`) - Placeholder
- **Logistique & Stocks** (`/logistics`) - Placeholder
- **Parc Technique** (`/assets`) - Placeholder

## 🎨 Composants Réutilisables

### StatusBadge

Badge de statut avec code couleur automatique.

```tsx
<StatusBadge status="PAID" />
<StatusBadge status="REJECTED" />
```

### EvidenceCard

Carte affichant les preuves de tâche (photo + GPS + timestamp).

```tsx
<EvidenceCard evidence={task.evidence} />
```

### FinancialInput

Input pour montants en FCFA avec séparateurs de milliers.

```tsx
<FinancialInput
  value={amount}
  onChange={setAmount}
  label="Montant"
/>
```

### Button

Bouton avec variants et loading state.

```tsx
<Button variant="success" loading={isLoading}>
  Valider
</Button>
```

### Modal

Modale réutilisable avec header et footer.

```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Titre"
  footer={<Button>Action</Button>}
>
  Contenu
</Modal>
```

## 🔒 Contrôle d'Accès (RBAC)

Les rôles utilisateur contrôlent l'accès aux pages :

- **ADMIN**: Accès complet
- **RAF** (Responsable Administratif et Financier): Dashboard + Hub Financier
- **RH**: Dashboard + Hub Financier + RH
- **MANAGER**: Dashboard + Opérations
- **STAFF**: Dashboard + Opérations (lecture seule)

## 📊 Données Mock

Le fichier `src/services/mockApi.ts` contient des données de démonstration réalistes :

- Tâches en attente de paiement avec preuves GPS
- Entrées du ledger comptable
- KPIs avec tendances
- Parcelles avec coordonnées GPS
- Données de graphiques

## 🎯 Prochaines Étapes

### Phase 1: Intégration Backend
- [ ] Remplacer mockApi par vrais appels API
- [ ] Gérer les erreurs réseau
- [ ] Ajouter refresh automatique des données
- [ ] Implémenter les notifications temps réel

### Phase 2: Fonctionnalités Avancées
- [ ] Carte satellite interactive (PostGIS)
- [ ] Gestion complète RH (paie, sanctions, bonus)
- [ ] Module exploitation agricole complet
- [ ] Gestion des stocks avec alertes
- [ ] Module parc technique

### Phase 3: Optimisations
- [ ] Mode offline (Outbox Pattern)
- [ ] PWA support
- [ ] Optimisation performances
- [ ] Tests unitaires et E2E

## 🛠️ Développement

### Ajout d'une nouvelle page

1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `src/App.tsx`
3. Ajouter le lien dans `src/components/layout/Sidebar.tsx`

### Ajout d'un nouveau composant UI

1. Créer le composant dans `src/components/ui/`
2. Exporter depuis le fichier
3. Documenter les props avec TypeScript

### Modification du thème

Les couleurs sont définies dans `tailwind.config.js` :

```javascript
colors: {
  holding: { ... },  // Bleu
  profit: { ... },   // Vert
  alert: { ... },    // Rouge
}
```

## 📝 Conventions de Code

- **TypeScript strict mode** activé
- **Composants fonctionnels** avec hooks
- **Props typées** avec interfaces
- **CSS-in-JS** via Tailwind
- **Nommage**: PascalCase pour composants, camelCase pour fonctions

## 🤝 Contribution

Maintenir la cohérence du design system et respecter les conventions de code établies.

## 📄 Licence

Propriété d'Atlas Whole Sale - Tous droits réservés © 2026
