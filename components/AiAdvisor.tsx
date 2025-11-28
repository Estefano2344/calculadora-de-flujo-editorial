import React, { useState } from 'react';
// Se elimina la importación de GoogleGenAI 
import { Sparkles, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { ProjectConfig, TeamConfig, CalculationResult } from '../types';

interface Props {
  project: ProjectConfig;
  team: TeamConfig;
  results: CalculationResult;
}

const AiAdvisor: React.FC<Props> = ({ project, team, results }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateAdvice = async () => {
    setLoading(true);
    setError(null);
    setAdvice(null);

    try {
      // **NUEVA LÓGICA: Llamada fetch al API Route de Vercel**
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Se envían los datos del proyecto al servidor
        body: JSON.stringify({ project, team, results }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      // El servidor devuelve el campo 'advice'
      setAdvice(data.advice ?? null);

    } catch (err: any) {
      console.error(err);
      // Mensaje de error genérico para el usuario
      setError("No se pudo generar el consejo en este momento. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900">Asesor de Proyecto IA</h3>
            <p className="text-xs text-indigo-600">Potenciado por Gemini 2.5 Flash</p>
          </div>
        </div>
        {!advice && !loading && (
          <button
            onClick={generateAdvice}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            Analizar Cronograma
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 text-indigo-400">
          <Loader2 className="animate-spin mb-2" size={24} />
          <span className="text-sm">Analizando complejidad del proyecto...</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg text-red-700 text-sm">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {advice && (
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-lg border border-indigo-100 shadow-sm animate-fade-in">
          <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            Reporte de Optimización
          </h4>
          <div 
            className="prose prose-sm prose-indigo text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: advice }}
          />
          <button 
            onClick={generateAdvice}
            className="mt-4 text-xs text-indigo-600 font-medium hover:underline"
          >
            Actualizar Análisis
          </button>
        </div>
      )}
    </div>
  );
};

export default AiAdvisor;