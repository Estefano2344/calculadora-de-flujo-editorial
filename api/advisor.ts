import { ProjectConfig, TeamConfig, CalculationResult } from '../types'; 
import { GoogleGenAI } from "@google/genai";

// Esta función es reconocida por Vercel como un API Route.
// Se recomienda usar el API de Request/Response para compatibilidad.
export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const { project, team, results } = await req.json() as {
            project: ProjectConfig;
            team: TeamConfig;
            results: CalculationResult;
        };

        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            console.error("Server Error: GEMINI_API_KEY not found in environment.");
            return new Response(JSON.stringify({ 
                error: "Configuration Error. GEMINI_API_KEY is missing on the server." 
            }), { status: 500 });
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

        const advice = response.text ?? 'No se pudo generar el consejo.';

        return new Response(JSON.stringify({ advice }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' } 
        });

    } catch (err: any) {
        console.error("API Route Error:", err);
        return new Response(JSON.stringify({ 
            error: "Internal Server Error while generating advice." 
        }), { status: 500 });
    }
}