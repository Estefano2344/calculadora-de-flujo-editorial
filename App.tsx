import React, { useState, useEffect, useMemo } from 'react';
import { 
  Book, 
  Users, 
  Settings, 
  Calendar, 
  ChevronRight, 
  Clock, 
  FileText,
  Briefcase
} from 'lucide-react';
import { 
  ProjectConfig, 
  TeamConfig, 
  RateConfig, 
  Complexity 
} from './types';
import { RATES_SIMPLE, RATES_COMPLEX } from './constants';
import { calculateTimeline } from './utils';
import ResultsChart from './components/ResultsChart';
import AiAdvisor from './components/AiAdvisor';

const App: React.FC = () => {
  // --- State ---
  const [project, setProject] = useState<ProjectConfig>({
    name: 'Nueva Colección',
    subject: 'Matemáticas',
    complexity: Complexity.SIMPLE,
    numberOfBooks: 3,
    pagesPerBook: 160,
  });

  const [team, setTeam] = useState<TeamConfig>({
    contentDev: 2,
    illustration: 1,
    design: 1,
    review: 1,
    corrections: 1,
    finalReview: 1,
  });

  // Rates are editable but initialize based on complexity
  const [rates, setRates] = useState<RateConfig>(RATES_SIMPLE);

  // Update defaults when complexity changes, but allow user override afterwards
  useEffect(() => {
    if (project.complexity === Complexity.SIMPLE) {
      setRates(RATES_SIMPLE);
    } else {
      setRates(RATES_COMPLEX);
    }
  }, [project.complexity]);

  // --- Calculations ---
  const results = useMemo(() => calculateTimeline(project, team, rates), [project, team, rates]);

  // --- Handlers ---
  const handleProjectChange = (field: keyof ProjectConfig, value: any) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  const handleTeamChange = (field: keyof TeamConfig, value: number) => {
    setTeam(prev => ({ ...prev, [field]: Math.max(1, value) }));
  };

  const handleRateChange = (field: keyof RateConfig, value: number) => {
    setRates(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Book size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              Calculadora de Flujo Editorial
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="hidden sm:flex items-center gap-1">
              <Calendar size={16} /> Hoy: {new Date().toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Project Details Card */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Briefcase size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-slate-800">Definición del Proyecto</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Nombre del Proyecto</label>
                  <input 
                    type="text" 
                    value={project.name}
                    onChange={(e) => handleProjectChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Asignatura</label>
                    <select 
                      value={project.subject}
                      onChange={(e) => handleProjectChange('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Literatura">Literatura</option>
                      <option value="Matemáticas">Matemáticas</option>
                      <option value="Ciencias">Ciencias</option>
                      <option value="Historia">Historia</option>
                      <option value="Arte">Arte</option>
                      <option value="Idiomas">Idiomas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Complejidad</label>
                    <select 
                      value={project.complexity}
                      onChange={(e) => handleProjectChange('complexity', e.target.value as Complexity)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value={Complexity.SIMPLE}>{Complexity.SIMPLE}</option>
                      <option value={Complexity.COMPLEX}>{Complexity.COMPLEX}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Cant. de Libros</label>
                    <input 
                      type="number" 
                      min="1" max="50"
                      value={project.numberOfBooks}
                      onChange={(e) => handleProjectChange('numberOfBooks', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Páginas / Libro</label>
                    <input 
                      type="number" 
                      min="10" max="1000"
                      value={project.pagesPerBook}
                      onChange={(e) => handleProjectChange('pagesPerBook', parseInt(e.target.value) || 160)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Volumen Total:</span>
                    <span className="font-semibold text-slate-800">{project.numberOfBooks * project.pagesPerBook} Páginas</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Team Allocation Card */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-slate-800">Equipo de Trabajo</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'Desarrolladores Contenido', key: 'contentDev' },
                  { label: 'Ilustradores', key: 'illustration' },
                  { label: 'Diagramadores', key: 'design' },
                  { label: 'Revisores', key: 'review' },
                  { label: 'Corrección Estilo/Diseño', key: 'corrections' },
                  { label: 'Revisores Finales', key: 'finalReview' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <label className="text-sm text-slate-600 max-w-[150px]">{item.label}</label>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleTeamChange(item.key as keyof TeamConfig, team[item.key as keyof TeamConfig] - 1)}
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                      >-</button>
                      <span className="w-4 text-center text-sm font-semibold">{team[item.key as keyof TeamConfig]}</span>
                      <button 
                        onClick={() => handleTeamChange(item.key as keyof TeamConfig, team[item.key as keyof TeamConfig] + 1)}
                        className="w-6 h-6 rounded bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors"
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Advanced Rates Card */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Settings size={18} className="text-slate-500" />
                <h2 className="font-semibold text-slate-800">Configuración de Rendimiento</h2>
              </div>
              <div className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">Contenido (Pág/Día)</label>
                      <input 
                        type="number"
                        value={rates.contentPagesPerDay}
                        onChange={(e) => handleRateChange('contentPagesPerDay', parseFloat(e.target.value))}
                        className="w-full p-2 border border-slate-200 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Diagramación (Pág/Día)</label>
                      <input 
                        type="number"
                        value={rates.designPagesPerDay}
                        onChange={(e) => handleRateChange('designPagesPerDay', parseFloat(e.target.value))}
                        className="w-full p-2 border border-slate-200 rounded"
                      />
                    </div>
                 </div>
                 <p className="text-xs text-slate-400 italic">Ajustar estos valores sobrescribe los valores por defecto de complejidad.</p>
              </div>
            </section>

          </div>

          {/* Right Column: Visualization & Results */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="text-slate-500 text-sm font-medium mb-2">Duración Total Estimada</div>
                <div className="text-3xl font-bold text-slate-900">{results.totalDays} <span className="text-lg font-normal text-slate-400">Días</span></div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                   <Clock size={12} /> Días laborables
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="text-slate-500 text-sm font-medium mb-2">Tiempo en Meses</div>
                <div className="text-3xl font-bold text-indigo-600">{results.totalMonths} <span className="text-lg font-normal text-indigo-300">Meses</span></div>
                <div className="text-xs text-slate-400 mt-2">Basado en prom. 21.6 días/mes</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div className="text-slate-500 text-sm font-medium mb-2">Productividad</div>
                <div className="text-3xl font-bold text-emerald-600">{(results.totalDays / project.numberOfBooks).toFixed(1)} <span className="text-lg font-normal text-emerald-300">Días/Libro</span></div>
                <div className="text-xs text-slate-400 mt-2">Rendimiento promedio por unidad</div>
              </div>
            </div>

            {/* Chart */}
            <ResultsChart results={results} />

            {/* Breakdown List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Desglose de Etapas</h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">Flujo Secuencial</span>
              </div>
              <div className="divide-y divide-slate-50">
                {results.stages.map((stage) => (
                  <div key={stage.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }}></div>
                      <div>
                        <div className="font-medium text-slate-800">{stage.name}</div>
                        <div className="text-xs text-slate-400">Día {stage.startDate} - Día {stage.endDate}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-700">{stage.durationDays}</span>
                      <span className="text-xs text-slate-500 ml-1">días</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Advisor */}
            <AiAdvisor project={project} team={team} results={results} />

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;