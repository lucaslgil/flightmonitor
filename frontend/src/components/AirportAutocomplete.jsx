import { useState, useEffect, useRef } from 'react';
import { Search, Plane, MapPin } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AirportAutocomplete({ value, onChange, placeholder, required, allowCities = false }) {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState({ cities: [], airports: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedSection, setSelectedSection] = useState('cities'); // 'cities' ou 'airports'
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar aeroportos conforme digita
  useEffect(() => {
    const searchAirports = async () => {
      if (!inputValue || inputValue.length < 1) {
        setSuggestions({ cities: [], airports: [] });
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/flights/airports/search-with-cities`, {
          params: { q: inputValue }
        });
        setSuggestions(response.data);
        const hasResults = response.data.cities.length > 0 || response.data.airports.length > 0;
        setIsOpen(hasResults);
        setSelectedIndex(-1);
        setSelectedSection(response.data.cities.length > 0 ? 'cities' : 'airports');
      } catch (error) {
        console.error('Erro ao buscar aeroportos:', error);
        setSuggestions({ cities: [], airports: [] });
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce menor para busca mais responsiva
    const debounceTimer = setTimeout(searchAirports, 200);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  const handleSelect = (item) => {
    if (item.type === 'city') {
      if (allowCities) {
        // Se permite cidades, mostra o nome da cidade
        setInputValue(`${item.city} (Todos)`);
        // Envia os códigos IATA de todos os aeroportos da cidade
        onChange(item.airports.map(a => a.iataCode).join(','), item);
      } else {
        // Se não permite cidades, seleciona o primeiro aeroporto principal
        const mainAirport = item.airports[0];
        setInputValue(mainAirport.iataCode);
        onChange(mainAirport.iataCode, mainAirport);
      }
    } else {
      // Se selecionou aeroporto específico
      setInputValue(item.iataCode);
      onChange(item.iataCode, item);
    }
    setIsOpen(false);
    setSuggestions({ cities: [], airports: [] });
  };

  const getAllSuggestions = () => {
    return [
      ...suggestions.cities.map(c => ({ ...c, section: 'cities' })),
      ...suggestions.airports.map(a => ({ ...a, section: 'airports' }))
    ];
  };

  const handleKeyDown = (e) => {
    const allSuggestions = getAllSuggestions();
    if (!isOpen || allSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(allSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    // Atualiza imediatamente para permitir busca dinâmica
    onChange(value);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          required={required}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>

      {isOpen && (suggestions.cities.length > 0 || suggestions.airports.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {/* Seção de Cidades */}
          {allowCities && suggestions.cities.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-750 border-b border-gray-700 text-xs font-semibold text-purple-400 uppercase">
                🏙️ Buscar em todos os aeroportos da cidade
              </div>
              {suggestions.cities.map((city, index) => (
                <button
                  key={`city-${city.city}-${city.country}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-start gap-3 border-b border-gray-750 ${
                    index === selectedIndex ? 'bg-gray-700' : ''
                  }`}
                >
                  <MapPin className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-400">{city.city}</span>
                      <span className="text-gray-400 text-xs">{city.country}</span>
                    </div>
                    <div className="text-sm text-white">
                      Todos os aeroportos ({city.totalAirports})
                    </div>
                    <div className="text-xs text-gray-400">
                      {city.airports.map(a => a.iataCode).join(', ')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Seção de Aeroportos */}
          {suggestions.airports.length > 0 && (
            <div>
              {allowCities && suggestions.cities.length > 0 && (
                <div className="px-4 py-2 bg-gray-750 border-b border-gray-700 text-xs font-semibold text-purple-400 uppercase">
                  ✈️ Aeroportos específicos
                </div>
              )}
              {suggestions.airports.map((airport, index) => {
                const globalIndex = allowCities ? suggestions.cities.length + index : index;
                return (
                  <button
                    key={`airport-${airport.iataCode}`}
                    type="button"
                    onClick={() => handleSelect(airport)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-start gap-3 ${
                      globalIndex === selectedIndex ? 'bg-gray-700' : ''
                    }`}
                  >
                    <Plane className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-purple-400">{airport.iataCode}</span>
                        {airport.type && <span className="text-gray-400 text-xs">{airport.type}</span>}
                      </div>
                      <div className="text-sm text-white truncate">{airport.name}</div>
                      {airport.city && (
                        <div className="text-xs text-gray-400">
                          {airport.city}{airport.country ? `, ${airport.country}` : ''}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
