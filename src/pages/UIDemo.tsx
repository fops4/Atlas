import { useState } from 'react';
import { Download, Plus, Trash2, Save } from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
  Checkbox,
  Radio,
  RadioGroup,
  Toggle
} from '../components/ui';

export default function UIDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [toggleValue, setToggleValue] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Composants UI Normalisés
        </h1>
        <p className="text-slate-600">
          Démonstration de tous les composants UI standardisés avec animations et interactions
        </p>
      </div>

      {/* Buttons */}
      <Card>
        <CardHeader title="Boutons" subtitle="Toutes les variantes et tailles avec animations" />
        <CardBody>
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Variantes</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Tailles</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* With Icons */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Avec Icônes</h3>
              <div className="flex flex-wrap gap-3">
                <Button leftIcon={<Plus />}>Ajouter</Button>
                <Button variant="secondary" rightIcon={<Download />}>
                  Télécharger
                </Button>
                <Button variant="danger" leftIcon={<Trash2 />}>
                  Supprimer
                </Button>
                <Button variant="outline" leftIcon={<Save />} rightIcon={<Download />}>
                  Sauvegarder
                </Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">États</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleLoadingDemo} isLoading={isLoading}>
                  {isLoading ? 'Chargement...' : 'Cliquer pour charger'}
                </Button>
                <Button isLoading loadingText="Traitement...">
                  Loading avec texte
                </Button>
                <Button disabled>Désactivé</Button>
              </div>
            </div>

            {/* Full Width */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Pleine largeur</h3>
              <Button fullWidth leftIcon={<Plus />}>
                Bouton pleine largeur
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Cards */}
      <Card>
        <CardHeader title="Cartes" subtitle="Cartes avec différents états" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="md">
              <CardHeader title="Carte Standard" subtitle="Hover pour effet" />
              <CardBody>
                <p className="text-sm text-slate-600">
                  Cette carte a un effet hover subtil.
                </p>
              </CardBody>
            </Card>

            <Card clickable onClick={() => alert('Carte cliquée!')}>
              <CardHeader title="Carte Cliquable" subtitle="Cliquez-moi" />
              <CardBody>
                <p className="text-sm text-slate-600">
                  Cette carte est interactive avec animation au clic.
                </p>
              </CardBody>
            </Card>

            <Card selected>
              <CardHeader title="Carte Sélectionnée" subtitle="État actif" />
              <CardBody>
                <p className="text-sm text-slate-600">
                  Cette carte montre l'état sélectionné.
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="mt-4">
            <Card padding="lg">
              <CardHeader
                title="Carte avec Footer"
                subtitle="Exemple complet"
                action={<Button size="sm">Action</Button>}
              />
              <CardBody>
                <p className="text-slate-600">
                  Contenu de la carte avec header, body et footer.
                </p>
              </CardBody>
              <CardFooter>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">Annuler</Button>
                  <Button size="sm">Confirmer</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </CardBody>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader title="Liens" subtitle="Différents styles de liens avec animations" />
        <CardBody>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Variantes</h3>
              <div className="flex flex-wrap gap-4">
                <Link to="/">Lien par défaut</Link>
                <Link to="/" variant="subtle">Lien subtil</Link>
                <Link to="/" variant="button">Lien bouton</Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Soulignement</h3>
              <div className="flex flex-wrap gap-4">
                <Link to="/" underline="none">Sans soulignement</Link>
                <Link to="/" underline="hover">Soulignement au hover</Link>
                <Link to="/" underline="always">Toujours souligné</Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Lien externe</h3>
              <Link href="https://example.com" external>
                Lien externe (ouvre dans un nouvel onglet)
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Form Controls */}
      <Card>
        <CardHeader title="Contrôles de Formulaire" subtitle="Checkbox, Radio et Toggle" />
        <CardBody>
          <div className="space-y-6">
            {/* Checkboxes */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Checkboxes</h3>
              <div className="space-y-3">
                <Checkbox
                  label="Checkbox simple"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <Checkbox
                  label="Avec description"
                  description="Ceci est une description d'aide pour la checkbox"
                />
                <Checkbox label="Désactivée" disabled />
                <Checkbox label="Avec erreur" error="Ce champ est requis" />
              </div>
            </div>

            {/* Radio Buttons */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Radio Buttons</h3>
              <RadioGroup name="demo" value={radioValue} onChange={setRadioValue}>
                <Radio
                  name="demo"
                  value="option1"
                  label="Option 1"
                  description="Première option"
                  checked={radioValue === 'option1'}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
                <Radio
                  name="demo"
                  value="option2"
                  label="Option 2"
                  description="Deuxième option"
                  checked={radioValue === 'option2'}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
                <Radio
                  name="demo"
                  value="option3"
                  label="Option 3 (désactivée)"
                  disabled
                />
              </RadioGroup>
            </div>

            {/* Toggles */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Toggle Switches</h3>
              <div className="space-y-3">
                <Toggle
                  label="Toggle simple"
                  checked={toggleValue}
                  onChange={(e) => setToggleValue(e.target.checked)}
                />
                <Toggle
                  label="Avec description"
                  description="Active ou désactive cette fonctionnalité"
                  size="md"
                />
                <div className="flex items-center gap-4">
                  <Toggle size="sm" label="Small" />
                  <Toggle size="md" label="Medium" />
                  <Toggle size="lg" label="Large" />
                </div>
                <Toggle label="Désactivé" disabled />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Interactions Demo */}
      <Card>
        <CardHeader
          title="Démonstration des Interactions"
          subtitle="Testez les animations et transitions"
        />
        <CardBody>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              ✨ <strong>Hover</strong> sur les boutons pour voir l'élévation (-translateY)
            </p>
            <p className="text-sm text-slate-600">
              🖱️ <strong>Clic</strong> sur les boutons pour voir l'effet scale(0.98)
            </p>
            <p className="text-sm text-slate-600">
              ⌨️ <strong>Tab</strong> pour naviguer au clavier avec focus visible
            </p>
            <p className="text-sm text-slate-600">
              🔄 <strong>Transitions</strong> fluides de 200ms sur tous les composants
            </p>
            <p className="text-sm text-slate-600">
              ♿ <strong>Accessibilité</strong> complète avec ARIA labels et support clavier
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
