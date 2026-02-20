import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Cloud,
  CloudOff,
  ArrowUpRight,
  Download,
  CreditCard,
  ShoppingCart
} from 'lucide-react';
import { useFinanceStore, Budget, IncomeEntry, SaleEntry, LedgerEntry } from '../store/financeStore';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  StatusBadge, 
  useNotification,
  Skeleton,
  FinancialInput
} from '../components/ui';
import { cn } from '../lib/utils';

type TabType = 'budget' | 'income' | 'sales' | 'synthesis';

// --- SUB-COMPONENTS FOR TABS ---

const SynthesisTab = ({ 
  budgets, 
  incomeEntries, 
  saleEntries, 
  ledger 
}: { 
  budgets: Budget[], 
  incomeEntries: IncomeEntry[], 
  saleEntries: SaleEntry[], 
  ledger: LedgerEntry[] 
}) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentBudget = budgets.find(b => b.month === currentMonth);
  const monthlyIncome = incomeEntries
    .filter(i => i.date.startsWith(currentMonth))
    .reduce((sum, i) => sum + i.amount, 0);
  const monthlySales = saleEntries
    .filter(s => s.date.startsWith(currentMonth))
    .reduce((sum, s) => sum + s.totalAmount, 0);
  
  const monthlyExpenses = Math.abs(ledger
    .filter(l => l.date.startsWith(currentMonth) && l.type === 'DEBIT')
    .reduce((sum, l) => sum + l.amount, 0));
  
  const budgetLimit = currentBudget?.totalAmount || 0;
  const consumptionRate = budgetLimit > 0 ? (monthlyExpenses / budgetLimit) * 100 : 0;
  const netBalance = (monthlyIncome + monthlySales) - monthlyExpenses;

  const chartData = [
    { name: 'Planifié', amount: budgetLimit || 0 },
    { name: 'Réel', amount: monthlyExpenses || 0 }
  ];

  const revenueDistribution = [
    { name: 'Entrées fonds', value: monthlyIncome || 0 },
    { name: 'Ventes', value: monthlySales || 0 }
  ].filter(d => d.value > 0);

  if (revenueDistribution.length === 0) {
    revenueDistribution.push({ name: 'Aucun revenu', value: 1 });
  }

  const COLORS = ['#1e3a8a', '#10b981', '#ef4444', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-brand-blue shadow-sm hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget Mensuel</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{budgetLimit.toLocaleString()} FCFA</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-brand-blue" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
              <StatusBadge status={consumptionRate > 100 ? 'OVER_BUDGET' : 'VALIDATED'} />
              <span>{currentMonth}</span>
            </div>
          </CardBody>
        </Card>

        <Card className="border-l-4 border-l-brand-green shadow-sm hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenus Totaux</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{(monthlyIncome + monthlySales).toLocaleString()} FCFA</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-brand-green" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
              <span className="text-brand-green font-bold">{(monthlyIncome + monthlySales > 0 ? '+' : '') + (monthlyIncome + monthlySales).toLocaleString()}</span>
              <span>ce mois</span>
            </div>
          </CardBody>
        </Card>

        <Card className={cn("border-l-4 shadow-sm hover:shadow-md transition-shadow", netBalance >= 0 ? "border-l-brand-green" : "border-l-brand-red")}>
          <CardBody className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Solde Net</p>
                <p className={cn("text-xl font-bold mt-1", netBalance >= 0 ? "text-slate-900" : "text-brand-red")}>
                  {netBalance.toLocaleString()} FCFA
                </p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
              <span>Reste après dépenses</span>
            </div>
          </CardBody>
        </Card>

        <Card className={cn("border-l-4 shadow-sm hover:shadow-md transition-shadow", consumptionRate <= 100 ? "border-l-brand-blue" : "border-l-brand-red")}>
          <CardBody className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Consommation Budget</p>
                <p className={cn("text-xl font-bold mt-1", consumptionRate > 100 ? "text-brand-red" : "text-slate-900")}>
                  {consumptionRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500", consumptionRate > 100 ? "bg-brand-red" : "bg-brand-blue")}
                style={{ width: `${Math.min(consumptionRate, 100)}%` }}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Comparatif Budget vs Réel" subtitle="Analyse des dépenses mensuelles" />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(val: number) => [val.toLocaleString() + ' FCFA', 'Montant']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#1e3a8a' : (consumptionRate > 100 ? '#ef4444' : '#10b981')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Répartition des Revenus" subtitle="Sources de financement" />
          <CardBody className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => val.toLocaleString() + ' FCFA'} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {consumptionRate > 100 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-brand-red animate-in fade-in slide-in-from-top-4">
          <TrendingUp className="w-5 h-5" />
          <div>
            <p className="font-bold">Alerte : Dépassement budgétaire</p>
            <p className="text-sm">Le montant total des dépenses réelles dépasse le budget planifié pour ce mois de {(monthlyExpenses - budgetLimit).toLocaleString()} FCFA.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const BudgetTab = ({ 
  budgets, 
  createBudget 
}: { 
  budgets: Budget[], 
  createBudget: (b: any) => void 
}) => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [categories, setCategories] = useState({
    labor: 0,
    inputs: 0,
    rations: 0,
    maintenance: 0,
    overhead: 0
  });

  const notify = useNotification();
  const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBudget({
      month,
      categories,
      totalAmount: total
    });
    notify.success("Budget validé et enregistré");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="Création de Budget" subtitle="Planification mensuelle des dépenses" />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mois du budget</label>
                <input 
                  type="month" 
                  className="w-full rounded-lg border-slate-300 focus:ring-brand-blue focus:border-brand-blue py-2.5 px-4"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <FinancialInput 
                label="Main d'œuvre (Permanents + Journaliers)" 
                value={categories.labor} 
                onChange={(val) => setCategories({...categories, labor: val})}
              />
              <FinancialInput 
                label="Intrants agricoles (Engrais, Semences)" 
                value={categories.inputs} 
                onChange={(val) => setCategories({...categories, inputs: val})}
              />
              <FinancialInput 
                label="Rations alimentaires" 
                value={categories.rations} 
                onChange={(val) => setCategories({...categories, rations: val})}
              />
              <FinancialInput 
                label="Maintenance & Parc technique" 
                value={categories.maintenance} 
                onChange={(val) => setCategories({...categories, maintenance: val})}
              />
              <FinancialInput 
                label="Frais généraux" 
                value={categories.overhead} 
                onChange={(val) => setCategories({...categories, overhead: val})}
              />
            </div>

            <div className="pt-6">
              <Button type="submit" fullWidth size="lg">Valider le budget de {total.toLocaleString()} FCFA</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Historique des Budgets" subtitle="Budgets validés précédemment" />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-medium">
                  <th className="py-2 text-left px-2">Mois</th>
                  <th className="py-2 text-right px-2">Montant Total</th>
                  <th className="py-2 text-right px-2">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {budgets.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-slate-900">{b.month}</td>
                    <td className="py-3 px-2 text-right text-slate-700 font-mono">{b.totalAmount.toLocaleString()} FCFA</td>
                    <td className="py-3 px-2 text-right"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
                {budgets.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400 italic">Aucun budget enregistré</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const IncomeTab = ({ 
  incomeEntries, 
  recordIncome 
}: { 
  incomeEntries: IncomeEntry[], 
  recordIncome: (i: any) => void 
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    source: 'OTHER' as any,
    description: ''
  });

  const notify = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordIncome(formData);
    notify.success("Entrée d'argent enregistrée");
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
      source: 'OTHER',
      description: ''
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader title="Enregistrer une Entrée" subtitle="Saisie de nouveaux fonds" />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full rounded-lg border-slate-300 focus:ring-brand-blue focus:border-brand-blue py-2.5 px-4"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <FinancialInput 
                label="Montant" 
                value={formData.amount} 
                onChange={(val) => setFormData({...formData, amount: val})}
                required
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                <select 
                  className="w-full rounded-lg border-slate-300 focus:ring-brand-blue focus:border-brand-blue py-2.5 px-4 bg-white"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value as any})}
                  required
                >
                  <option value="CAPITAL">Capital</option>
                  <option value="LOAN">Prêt</option>
                  <option value="GRANT">Subvention</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  className="w-full rounded-lg border-slate-300 focus:ring-brand-blue focus:border-brand-blue py-2.5 px-4 min-h-[100px]"
                  placeholder="Détails sur l'origine des fonds..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="pt-4">
              <Button type="submit" fullWidth leftIcon={<Download />}>Enregistrer l'entrée</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader title="Historique des Entrées" subtitle="Liste chronologique des fonds reçus" />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-medium">
                  <th className="py-2 text-left px-2">Date</th>
                  <th className="py-2 text-left px-2">Source</th>
                  <th className="py-2 text-left px-2 lg:block hidden">Description</th>
                  <th className="py-2 text-right px-2">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {incomeEntries.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-slate-900">{i.date}</td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                        {i.source}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-600 truncate max-w-[200px] lg:block hidden">{i.description}</td>
                    <td className="py-3 px-2 text-right font-mono text-brand-green font-bold">+{i.amount.toLocaleString()} FCFA</td>
                  </tr>
                ))}
                {incomeEntries.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 italic">Aucune entrée enregistrée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const SalesTab = ({ 
  saleEntries, 
  recordSale 
}: { 
  saleEntries: SaleEntry[], 
  recordSale: (s: any) => void 
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    product: '',
    quantity: 0,
    unitPrice: 0,
    client: '',
    paymentMode: 'CASH' as any,
    transactionId: ''
  });

  const notify = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordSale(formData);
    notify.success("Vente enregistrée et ajoutée au Ledger");
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      product: '',
      quantity: 0,
      unitPrice: 0,
      client: '',
      paymentMode: 'CASH',
      transactionId: ''
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader title="Nouvelle Vente" subtitle="Enregistrement des revenus de production" />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full rounded-lg border-slate-300 focus:ring-brand-blue focus:border-brand-blue py-2.5 px-4"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Produit</label>
                <select 
                  className="w-full rounded-lg border-slate-300 focus:ring-brand-blue focus:border-brand-blue py-2.5 px-4 bg-white"
                  value={formData.product}
                  onChange={(e) => setFormData({...formData, product: e.target.value})}
                  required
                >
                  <option value="">Sélectionner un produit...</option>
                  <option value="Tomates">Tomates</option>
                  <option value="Poivrons">Poivrons</option>
                  <option value="Maïs">Maïs</option>
                  <option value="Pommes de terre">Pommes de terre</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Qté</label>
                  <input 
                    type="number" 
                    className="w-full rounded-lg border-slate-300 focus:ring-brand-blue focus:border-brand-blue py-2.5 px-4"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                <FinancialInput 
                  label="P.U. (FCFA)" 
                  value={formData.unitPrice} 
                  onChange={(val) => setFormData({...formData, unitPrice: val})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client/Acheteur</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg border-slate-300 focus:ring-brand-blue focus:border-brand-blue py-2.5 px-4"
                  placeholder="Nom du client..."
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mode de Paiement</label>
                <select 
                  className="w-full rounded-lg border-slate-300 focus:ring-brand-blue focus:border-brand-blue py-2.5 px-4 bg-white"
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({...formData, paymentMode: e.target.value as any})}
                  required
                >
                  <option value="CASH">Cash</option>
                  <option value="MOMO">Mobile Money</option>
                  <option value="TRANSFER">Virement</option>
                </select>
              </div>
            </div>
            <div className="pt-4">
              <Button type="submit" fullWidth variant="primary"> Valider la vente</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader title="Historique des Ventes" subtitle="Suivi des ventes enregistrées" />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-medium">
                  <th className="py-2 text-left px-2">Date</th>
                  <th className="py-2 text-left px-2">Produit</th>
                  <th className="py-2 text-left px-2">Qté</th>
                  <th className="py-2 text-left px-2">Prix Total</th>
                  <th className="py-2 text-right px-2 font-semibold">Client</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {saleEntries.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-slate-900">{s.date}</td>
                    <td className="py-3 px-2">{s.product}</td>
                    <td className="py-3 px-2">{s.quantity}</td>
                    <td className="py-3 px-2 font-mono font-bold text-brand-blue">{s.totalAmount.toLocaleString()} FCFA</td>
                    <td className="py-3 px-2 text-right text-slate-600">{s.client}</td>
                  </tr>
                ))}
                {saleEntries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">Aucune vente enregistrée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function BudgetManagement() {
  const { 
    budgets, 
    incomeEntries, 
    saleEntries, 
    ledger,
    createBudget, 
    recordIncome, 
    recordSale, 
    isOnline,
    outbox
  } = useFinanceStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('synthesis');
  const [isLoading] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Offline Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion Budgétaire Mensuelle</h1>
          <p className="text-slate-500">Planification, suivi des entrées et analyse de performance financière</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300",
            isOnline ? "bg-green-50 text-brand-green border-brand-green/30" : "bg-orange-50 text-orange-600 border-orange-200"
          )}>
            {isOnline ? <Cloud className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
            {isOnline ? 'En ligne' : 'Mode Hors-ligne'}
          </div>
          {outbox.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-blue text-white animate-pulse shadow-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              {outbox.length} éléments en attente
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl w-fit shadow-inner">
        {[
          { id: 'synthesis', label: 'Synthèse', icon: TrendingUp },
          { id: 'budget', label: 'Budget Mensuel', icon: Calendar },
          { id: 'income', label: 'Entrées Fonds', icon: CreditCard },
          { id: 'sales', label: 'Ventes', icon: ShoppingCart }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === tab.id 
                ? "bg-white text-brand-blue shadow-md scale-105 z-10" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="md:block hidden">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="min-h-[500px]">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'synthesis' && (
              <SynthesisTab 
                budgets={budgets} 
                incomeEntries={incomeEntries} 
                saleEntries={saleEntries} 
                ledger={ledger} 
              />
            )}
            {activeTab === 'budget' && (
              <BudgetTab 
                budgets={budgets} 
                createBudget={createBudget} 
              />
            )}
            {activeTab === 'income' && (
              <IncomeTab 
                incomeEntries={incomeEntries} 
                recordIncome={recordIncome} 
              />
            )}
            {activeTab === 'sales' && (
              <SalesTab 
                saleEntries={saleEntries} 
                recordSale={recordSale} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
