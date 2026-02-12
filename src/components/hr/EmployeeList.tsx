import { useState } from 'react';
import { cn } from '../../lib/utils';
import { User, Phone, Briefcase, Search, Trash2, Edit, RefreshCw, Banknote, CheckSquare, Square } from 'lucide-react';
import { useHrStore, Employee } from '../../store/hrStore';
import { EmployeeFormModal } from './EmployeeFormModal';
import { EmployeeDetailsModal } from './EmployeeDetailsModal';
import { PayrollRunModal } from './PayrollRunModal';

export function EmployeeList() {
  const { employees, archiveEmployee, unarchiveEmployee } = useHrStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ACTIVE' | 'ARCHIVED'>('ACTIVE');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false); // Payroll Modal State
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Strict filter: Show ONLY Active OR ONLY Inactive
    const matchesStatus = emp.status === (filterStatus === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE');
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    setEmployeeToEdit(emp);
    setIsFormModalOpen(true);
  };

  const handleArchive = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Faut-il vraiment archiver cet employé ?')) {
      archiveEmployee(id);
    }
  };

  const handleUnarchive = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Restaurer cet employé ?')) {
      unarchiveEmployee(id);
    }
  };

  const handleAdd = () => {
    setEmployeeToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleRowClick = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsDetailsModalOpen(true);
  };

  // Selection Logic
  const toggleSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEmployees.map(e => e.id)));
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-semibold text-slate-900">Annuaire du Personnel</h3>
            
            <div className="flex gap-2 w-full sm:w-auto">
               {/* Payroll Button - Only visible if selection > 0 */}
               {selectedIds.size > 0 && filterStatus === 'ACTIVE' && (
                 <button 
                   onClick={() => setIsPayrollModalOpen(true)}
                   className="flex items-center gap-2 text-sm bg-brand-green text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm animate-in fade-in"
                 >
                   <Banknote className="w-4 h-4" />
                   Payer ({selectedIds.size})
                 </button>
               )}

              <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                <button
                  onClick={() => { setFilterStatus('ACTIVE'); setSelectedIds(new Set()); }}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    filterStatus === 'ACTIVE' ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Actifs
                </button>
                <button
                  onClick={() => { setFilterStatus('ARCHIVED'); setSelectedIds(new Set()); }}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    filterStatus === 'ARCHIVED' ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Archivés
                </button>
              </div>
              <button 
                onClick={handleAdd}
                className="text-sm text-brand-blue font-medium hover:underline bg-blue-50 px-3 py-1.5 rounded-lg whitespace-nowrap"
              >
                Ajouter +
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Rechercher un employé..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="w-10 px-4 py-3 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedIds.size === filteredEmployees.length && filteredEmployees.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-brand-blue" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Employé</th>
                <th className="px-4 py-3 hidden sm:table-cell">Poste</th>
                <th className="px-4 py-3 hidden sm:table-cell">Contact</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const isSelected = selectedIds.has(emp.id);
                return (
                  <tr 
                    key={emp.id} 
                    onClick={() => handleRowClick(emp)}
                    className={cn(
                      "hover:bg-slate-50 transition-colors cursor-pointer",
                      isSelected ? "bg-blue-50/50" : ""
                    )}
                  >
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => toggleSelection(e, emp.id)} className="text-slate-400 hover:text-slate-600 block mx-auto">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-brand-blue" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-slate-500 sm:hidden">{emp.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        {emp.position}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {emp.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={(e) => handleEdit(e, emp)}
                          className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-brand-blue transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        {emp.status === 'ACTIVE' ? (
                          <button 
                            onClick={(e) => handleArchive(e, emp.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-slate-500 hover:text-red-600 transition-colors"
                            title="Archiver"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => handleUnarchive(e, emp.id)}
                            className="p-1.5 hover:bg-green-50 rounded text-slate-500 hover:text-green-600 transition-colors"
                            title="Restaurer"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Aucun employé trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        employeeToEdit={employeeToEdit}
      />
      
      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        employee={selectedEmployee}
      />

      <PayrollRunModal 
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        selectedEmployees={employees.filter(e => selectedIds.has(e.id))}
        onSuccess={() => setSelectedIds(new Set())}
      />
    </>
  );
}
