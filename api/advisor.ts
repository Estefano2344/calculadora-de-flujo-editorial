import { GoogleGenAI } from "@google/genai";
import { ProjectConfig, TeamConfig, CalculationResult } from '../types';

// Usamos tipos 'any' para req y res para evitar errores de compilación si no tienes @vercel/node instalado.
// En Vercel, req es VercelRequest y res es VercelResponse.
export default async function handler(req: any, res: any) {
    // 1. Manejo de CORS (Opcional pero recomendado si hay problemas de origen)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Responder OK a las peticiones OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Validar método POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // CORRECCIÓN PRINCIPAL:
        // No usamos req.json(). Vercel ya parseó el body automáticamente en req.body
        const { project, team, results } = req.body as {
            project: ProjectConfig;
            team: TeamConfig;
            results: CalculationResult;
        };

        // Verificación de datos
        if (!project || !team || !results) {
            return res.status(400).json({ error: "Missing required data in request body." });
        }

        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            console.error("Server Error: GEMINI_API_KEY not found in environment.");
            return res.status(500).json({ 
                error: "Configuration Error. GEMINI_API_KEY is missing on the server." 
            });
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

        // CORRECCIÓN DE RESPUESTA:
        // Usamos res.status().json() en lugar de return new Response()
        return res.status(200).json({ advice });

    } catch (err: any) {
        console.error("API Route Error:", err);
        return res.status(500).json({ 
            error: "Internal Server Error while generating advice." 
        });
    }
}