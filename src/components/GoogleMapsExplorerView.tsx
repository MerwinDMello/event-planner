import React, { useState } from 'react';
import {
  MapPin,
  Search,
  ExternalLink,
  Navigation,
  Sparkles,
  Store,
  Compass,
  Star,
  Check,
  Building,
  RefreshCw,
  Info
} from 'lucide-react';
import { CelebrationTheme } from '../types';

interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content?: string;
        reviewUri?: string;
      }[];
    };
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

interface GoogleMapsExplorerViewProps {
  currentTheme: CelebrationTheme;
  onSelectVenueForEvent?: (venueName: string) => void;
}

export const GoogleMapsExplorerView: React.FC<GoogleMapsExplorerViewProps> = ({
  currentTheme,
  onSelectVenueForEvent,
}) => {
  const [activeMode, setActiveMode] = useState<'venues' | 'vendors'>('venues');
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string>('');
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>('');
  const [copiedVenue, setCopiedVenue] = useState<string | null>(null);

  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  // Request user geolocation if available
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      setGeoStatus('Locating...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setGeoStatus('Location pinned');
        },
        () => {
          setGeoStatus('Permission denied, using city default');
        }
      );
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResultText('');
    setGroundingChunks([]);
    setApiKeyError(null);

    try {
      const endpoint = activeMode === 'venues' ? '/api/maps/venues' : '/api/maps/vendors';
      const bodyPayload: any = {
        city,
        lat: userCoords?.lat,
        lng: userCoords?.lng,
      };

      if (activeMode === 'venues') {
        bodyPayload.query = searchQuery.trim();
        bodyPayload.themeName = currentTheme.name;
      } else {
        bodyPayload.category = searchQuery.trim() || 'Kids Party Decorators & Balloon Artists';
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (data.success) {
        setResultText(data.text);
        setGroundingChunks(data.groundingChunks || []);
      } else {
        if (data.isApiKeyError) {
          setApiKeyError(data.error);
        }
        setResultText(data.fallbackText || data.text || `Notice: ${data.error || 'Failed to fetch Google Maps data.'}`);
        setGroundingChunks(data.groundingChunks || []);
      }
    } catch (err: any) {
      setResultText(`Failed to connect to Maps grounding service: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Extract maps chunks
  const mapsPlaces = groundingChunks
    .filter((c) => c.maps && c.maps.uri)
    .map((c) => ({
      title: c.maps?.title || 'Google Maps Location',
      uri: c.maps?.uri || '#',
      reviews: c.maps?.placeAnswerSources?.reviewSnippets || [],
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <MapPin className="w-5 h-5 fill-red-400/20" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Google Maps <span className="text-amber-400">Grounding Explorer</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time verified venues & party vendors grounded with <span className="text-purple-400 font-semibold">gemini-3.8-flash</span> + Google Maps live place data
          </p>
        </div>

        {/* Mode Toggle: Venues vs Local Vendors */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-[#161730] border border-[#272948] rounded-xl text-xs">
            <button
              onClick={() => setActiveMode('venues')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeMode === 'venues' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Theme Venues</span>
            </button>
            <button
              onClick={() => setActiveMode('vendors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeMode === 'vendors' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Local Vendors</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Location Bar */}
      <div className="rounded-2xl border border-[#26284b] bg-[#14152a] p-5 shadow-xl space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Query input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeMode === 'venues'
                  ? `e.g. Beach lawns with pool in Alibaug, or indoor arcade for ${currentTheme.name}`
                  : 'e.g. Balloon decorator, themed cake bakery, magician in Bandra'
              }
              className="w-full bg-[#181934] border border-[#2d2f52] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* City selector */}
          <div className="md:col-span-3">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#181934] border border-[#2d2f52] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
            >
              <option value="Mumbai">Mumbai & Suburbs</option>
              <option value="Alibaug">Alibaug & Raigad</option>
              <option value="Goa">Goa (North & South)</option>
              <option value="Pune">Pune</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi NCR">Delhi NCR</option>
            </select>
          </div>

          {/* Action Button & GPS */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="button"
              onClick={requestLocation}
              title="Use current GPS coordinates"
              className="p-2 rounded-xl bg-[#202244] hover:bg-[#2b2e5c] text-slate-300 hover:text-white border border-[#2d3056] text-xs flex items-center justify-center shrink-0"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Grounding with Maps...</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5" />
                  <span>Search on Maps</span>
                </>
              )}
            </button>
          </div>
        </form>

        {geoStatus && (
          <span className="text-[11px] text-cyan-400 block font-medium">
            📍 {geoStatus} {userCoords ? `(${userCoords.lat.toFixed(3)}, ${userCoords.lng.toFixed(3)})` : ''}
          </span>
        )}

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1">
          <span className="text-slate-400 font-semibold shrink-0">Popular queries:</span>
          {activeMode === 'venues' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery(`Best lawns for a ${currentTheme.name}`);
                  handleSearch();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#202244] text-slate-300 hover:text-white border border-[#2d3056] whitespace-nowrap"
              >
                {currentTheme.name} Venues
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('Indoor trampoline and party parks');
                  handleSearch();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#202244] text-slate-300 hover:text-white border border-[#2d3056] whitespace-nowrap"
              >
                Indoor Adventure Play
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('Beach resort lawns with cabanas');
                  handleSearch();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#202244] text-slate-300 hover:text-white border border-[#2d3056] whitespace-nowrap"
              >
                Beach Resorts
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('Balloon arch decorators for kids birthdays');
                  handleSearch();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#202244] text-slate-300 hover:text-white border border-[#2d3056] whitespace-nowrap"
              >
                Balloon Artists
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('Custom kids fondant cake bakers');
                  handleSearch();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#202244] text-slate-300 hover:text-white border border-[#2d3056] whitespace-nowrap"
              >
                Artisan Cake Shops
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('Party prop and costume rental shops');
                  handleSearch();
                }}
                className="px-2.5 py-1 rounded-lg bg-[#202244] text-slate-300 hover:text-white border border-[#2d3056] whitespace-nowrap"
              >
                Costume Rentals
              </button>
            </>
          )}
        </div>
      </div>

      {/* API Key Alert Banner if Gemini Key was reported as leaked/invalid */}
      {apiKeyError && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-300">Gemini API Key Notice</h4>
            <p className="text-slate-300">
              The Gemini API key was reported as leaked or unauthorized (<code>PERMISSION_DENIED 403</code>).
              Please configure or select a valid API key in the <span className="font-bold text-amber-400">Settings &gt; Secrets</span> panel in AI Studio.
            </p>
            <p className="text-[11px] text-slate-400">
              In the meantime, the app is providing curated celebration venues &amp; vendors with active Google Maps search links below.
            </p>
          </div>
        </div>
      )}

      {/* Grounded Google Maps Places Cards Strip (MANDATORY per Google Maps Grounding requirements) */}
      {mapsPlaces.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Grounded Google Maps Places ({mapsPlaces.length} verified locations)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mapsPlaces.map((place, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#161732] border border-[#292b4f] hover:border-red-500/50 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {place.title}
                    </h3>
                    <span className="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {place.reviews && place.reviews.length > 0 && (
                    <div className="space-y-1.5 my-2">
                      {place.reviews.slice(0, 2).map((rev, rIdx) => (
                        <p
                          key={rIdx}
                          className="text-[11px] text-slate-400 italic bg-[#0f1022] p-2 rounded-lg border border-[#202244]"
                        >
                          "{rev.content}"
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#222445] mt-2 flex items-center justify-between gap-2">
                  <a
                    href={place.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold transition-colors"
                  >
                    <span>View on Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {onSelectVenueForEvent && (
                    <button
                      onClick={() => {
                        onSelectVenueForEvent(place.title);
                        setCopiedVenue(place.title);
                        setTimeout(() => setCopiedVenue(null), 2000);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#222447] hover:bg-[#2c3060] text-xs font-semibold text-slate-200 transition-colors"
                    >
                      {copiedVenue === place.title ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Check className="w-3 h-3" /> Selected!
                        </span>
                      ) : (
                        <span>Use Venue</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Grounded Summary & Details */}
      {resultText && (
        <div className="rounded-2xl border border-[#27294e] bg-[#14152a] p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2 border-b border-[#212344] pb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              Gemini 3.8 Flash Grounded Analysis & Recommendations
            </h3>
          </div>
          <div className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
            {resultText}
          </div>
        </div>
      )}

      {!loading && !resultText && mapsPlaces.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-[#242646] p-6 text-slate-400 space-y-2">
          <Compass className="w-8 h-8 mx-auto text-amber-400 opacity-80" />
          <h3 className="text-sm font-bold text-white">Explore Real Event Places on Google Maps</h3>
          <p className="text-xs max-w-md mx-auto">
            Click "Search on Maps" to discover live venues, ratings, reviews, and verified party vendors for{' '}
            <span className="text-amber-400 font-semibold">{currentTheme.name}</span> in {city}.
          </p>
        </div>
      )}
    </div>
  );
};
