import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
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
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key not found in environment.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Actúa como un experto Gestor de Proyectos Editoriales.
        Analiza la siguiente configuración de proyecto y proporciona 3 puntos breves y de alto impacto:
        1. Un riesgo potencial en el cronograma actual.
        2. Un consejo de optimización de recursos (ej. dónde agregar/quitar personal).
        3. Una sugerencia de eficiencia (ej. uso de IA o flujos paralelos).

        Detalles del Proyecto:
        - Asignatura: ${project.subject} (Complejidad: ${project.complexity})
        - Escala: ${project.numberOfBooks} libros, ${project.pagesPerBook} páginas cada uno.
        - Duración Total Estimada: ${results.totalDays} días laborables (~${results.totalMonths} meses).
        
        Asignación de Equipo:
        - Redactores: ${team.contentDev}
        - Ilustradores: ${team.illustration}
        - Diagramadores: ${team.design}
        - Revisores: ${team.review}
        - Corrección: ${team.corrections}

        Responde en formato HTML válido (lista desordenada <ul> con etiquetas <li>), sin envoltorios \`\`\`html.
        Mantén el tono profesional, alentador y específico para la industria editorial. Responde en Español.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAdvice(response.text ?? null);

    } catch (err: any) {
      console.error(err);
      setError("No se pudo generar el consejo en este momento. Verifica tu conexión o clave API.");
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