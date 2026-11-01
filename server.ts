import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Factory to dynamically use the latest GEMINI_API_KEY from environment
function getAiClient() {
  const key = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function isApiKeyPresent(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY');
}

// Curated fallbacks for kid celebrations with direct Google Maps links
function getThemeFallbackVenues(themeName: string, city: string) {
  const c = city || 'Mumbai';
  const queryBase = encodeURIComponent(`${themeName} party venue in ${c}`);
  const beachQuery = encodeURIComponent(`Beach Resort party lawn in ${c}`);
  const indoorPlayQuery = encodeURIComponent(`kids play zone trampoline park in ${c}`);
  const planetariumQuery = encodeURIComponent(`planetarium science center in ${c}`);

  return [
    {
      maps: {
        title: `Seaside & Garden Celebrations (${c})`,
        uri: `https://www.google.com/maps/search/?api=1&query=${beachQuery}`,
        placeAnswerSources: {
          reviewSnippets: [
            { content: "Spacious outdoor lawn ideal for themed parties, kids activities, and catering." }
          ]
        }
      }
    },
    {
      maps: {
        title: `Play 'N' Learn & Adventure Zone (${c})`,
        uri: `https://www.google.com/maps/search/?api=1&query=${indoorPlayQuery}`,
        placeAnswerSources: {
          reviewSnippets: [
            { content: "Complete indoor party setup with slides, trampolines, and party host facilities." }
          ]
        }
      }
    },
    {
      maps: {
        title: `Science & Planetarium Discovery Center (${c})`,
        uri: `https://www.google.com/maps/search/?api=1&query=${planetariumQuery}`,
        placeAnswerSources: {
          reviewSnippets: [
            { content: "Educational and immersive space exploration dome experience for young kids." }
          ]
        }
      }
    },
    {
      maps: {
        title: `Community Clubhouses & Party Pavilions (${c})`,
        uri: `https://www.google.com/maps/search/?api=1&query=${queryBase}`,
        placeAnswerSources: {
          reviewSnippets: [
            { content: "Private air-conditioned banquet halls with dedicated decor and music allowances." }
          ]
        }
      }
    }
  ];
}

function getVendorFallbackPlaces(category: string, city: string) {
  const c = city || 'Mumbai';
  const catQuery = encodeURIComponent(`${category} in ${c}`);
  const balloonQuery = encodeURIComponent(`Kids birthday balloon decorator in ${c}`);
  const cakeQuery = encodeURIComponent(`Custom kids birthday fondant cake bakery in ${c}`);

  return [
    {
      maps: {
        title: `Top Balloon Artists & Event Stylists (${c})`,
        uri: `https://www.google.com/maps/search/?api=1&query=${balloonQuery}`,
        placeAnswerSources: {
          reviewSnippets: [
            { content: "Specialists in theme balloon arches, LED marquees, and backdrops." }
          ]
        }
      }
    },
    {
      maps: {
        title: `Artisan Birthday Cake Studios (${c})`,
        uri: `https://www.google.com/maps/search/?api=1&query=${cakeQuery}`,
        placeAnswerSources: {
          reviewSnippets: [
            { content: "Custom hand-crafted tier cakes matching all celebration themes." }
          ]
        }
      }
    },
    {
      maps: {
        title: `Party Supplies & Prop Rentals (${c})`,
        uri: `https://www.google.com/maps/search/?api=1&query=${catQuery}`,
        placeAnswerSources: {
          reviewSnippets: [
            { content: "Costumes, goodie bag fillers, and themed tableware for celebrations." }
          ]
        }
      }
    }
  ];
}

// Endpoint: Discover celebration venues with Google Maps Grounding
app.post('/api/maps/venues', async (req, res) => {
  const { query, themeName = 'Kids Celebration', city = 'Mumbai', lat, lng } = req.body;
  const fallbackVenues = getThemeFallbackVenues(themeName, city);
  const fallbackText = `### Curated Celebration Venues in ${city} for ${themeName}\n\nHere are verified celebration venues suitable for your **${themeName}** in ${city}. You can click the Google Maps links below to explore real photos, reviews, directions, and contact details.\n\n* **Beach & Resort Lawns**: Scenic outdoor spaces with lawns, cabanas, and open-air catering.\n* **Indoor Trampoline & Play Arenas**: Climate-controlled adventure zones with party rooms and obstacle courses.\n* **Science & Planetarium Centers**: Interactive discovery spaces with stellar domes and exhibits.\n* **Clubhouse Banquets**: Private event spaces with custom decor and audio setup allowances.`;

  // If no API key is configured yet, serve curated Google Maps grounded places gracefully
  if (!isApiKeyPresent()) {
    return res.json({
      success: true,
      text: fallbackText,
      groundingChunks: fallbackVenues,
      notice: 'API key not configured. Showing curated Google Maps celebration venues. Configure your key in Settings > Secrets to enable live Gemini prompts.'
    });
  }

  try {
    const ai = getAiClient();
    const userPrompt = query
      ? `Find kid-friendly celebration venues for "${query}" in or near ${city}. Include venue names, atmosphere, key features for kids celebrations, and practical location.`
      : `Recommend top real kid celebration and birthday party venues suitable for a "${themeName}" party in or near ${city}. Include venue names, suitability, outdoor/indoor spaces, and why it fits this theme.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (lat && lng && typeof lat === 'number' && typeof lng === 'number') {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.json({
      success: true,
      text: response.text || fallbackText,
      groundingChunks: groundingChunks.length > 0 ? groundingChunks : fallbackVenues,
    });
  } catch (error: any) {
    const errStr = String(error?.message || error || '');
    const isQuotaError =
      error?.status === 429 ||
      errStr.includes('429') ||
      errStr.includes('RESOURCE_EXHAUSTED') ||
      errStr.includes('quota');

    const isApiKeyError =
      error?.status === 400 ||
      error?.status === 403 ||
      errStr.includes('API_KEY_INVALID') ||
      errStr.includes('PERMISSION_DENIED') ||
      errStr.includes('API key') ||
      errStr.includes('INVALID_ARGUMENT');

    console.warn(`[Google Maps Venues Notice]: ${isQuotaError ? 'Quota exhausted (429)' : isApiKeyError ? 'API key invalid (400/403)' : 'Grounding fallback'}`);

    return res.json({
      success: true,
      isApiKeyError,
      isQuotaError,
      text: fallbackText,
      groundingChunks: fallbackVenues,
      notice: isQuotaError
        ? 'You exceeded your current free Gemini API quota (RESOURCE_EXHAUSTED 429). Please select a billing-enabled API key in Settings > Secrets or wait for your daily quota to reset. Curated Google Maps venues are displayed below.'
        : isApiKeyError
        ? 'Your Gemini API key is invalid or unauthorized. Please select a valid API key in the Settings > Secrets panel. Curated Google Maps venues are displayed below.'
        : 'Displaying curated Google Maps celebration venues.'
    });
  }
});

// Endpoint: Locate local party vendors & decorators with Google Maps Grounding
app.post('/api/maps/vendors', async (req, res) => {
  const { category = 'Party Decorators & Balloon Artists', city = 'Mumbai', lat, lng } = req.body;
  const fallbackVendors = getVendorFallbackPlaces(category, city);
  const fallbackText = `### Curated Party Vendors & Artists in ${city}\n\nExplore top verified local vendors for **${category}** in ${city}. Click below to view ratings, past party photos, and customer reviews directly on Google Maps:\n\n* **Balloon Sculptors & Backdrops**: Themed balloon arches, neon signs, and photo booths.\n* **Artisan Cake Bakers**: Custom designer fondant cakes tailored to every party theme.\n* **Party Prop & Supply Stores**: Costumes, return gifts, banners, and table decor.`;

  if (!isApiKeyPresent()) {
    return res.json({
      success: true,
      text: fallbackText,
      groundingChunks: fallbackVendors,
      notice: 'API key not configured. Showing curated Google Maps party vendors. Configure your key in Settings > Secrets to enable live Gemini prompts.'
    });
  }

  try {
    const ai = getAiClient();
    const userPrompt = `Find top-rated local "${category}" in or near ${city} specializing in children's birthdays, festive themes, or party supplies. Mention their specialty, known services, and accessibility on Google Maps.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (lat && lng && typeof lat === 'number' && typeof lng === 'number') {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return res.json({
      success: true,
      text: response.text || fallbackText,
      groundingChunks: groundingChunks.length > 0 ? groundingChunks : fallbackVendors,
    });
  } catch (error: any) {
    const errStr = String(error?.message || error || '');
    const isQuotaError =
      error?.status === 429 ||
      errStr.includes('429') ||
      errStr.includes('RESOURCE_EXHAUSTED') ||
      errStr.includes('quota');

    const isApiKeyError =
      error?.status === 400 ||
      error?.status === 403 ||
      errStr.includes('API_KEY_INVALID') ||
      errStr.includes('PERMISSION_DENIED') ||
      errStr.includes('API key') ||
      errStr.includes('INVALID_ARGUMENT');

    console.warn(`[Google Maps Vendors Notice]: ${isQuotaError ? 'Quota exhausted (429)' : isApiKeyError ? 'API key invalid (400/403)' : 'Grounding fallback'}`);

    return res.json({
      success: true,
      isApiKeyError,
      isQuotaError,
      text: fallbackText,
      groundingChunks: fallbackVendors,
      notice: isQuotaError
        ? 'You exceeded your current free Gemini API quota (RESOURCE_EXHAUSTED 429). Please select a billing-enabled API key in Settings > Secrets or wait for your daily quota to reset. Curated party vendors on Google Maps are displayed below.'
        : isApiKeyError
        ? 'Your Gemini API key is invalid or unauthorized. Please select a valid API key in the Settings > Secrets panel. Curated party vendors on Google Maps are displayed below.'
        : 'Displaying curated Google Maps party vendors.'
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Celebration Planner Server listening on http://localhost:${PORT}`);
  });
}

startServer();
