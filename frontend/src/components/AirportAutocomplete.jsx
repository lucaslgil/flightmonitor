import { useState, useEffect, useRef } from 'react';
import { Search, Plane } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AirportAutocomplete({ value, onChange, placeholder, required }) {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/flights/airports/search`, {
          params: { q: inputValue }
        });
        setSuggestions(response.data);
        setIsOpen(response.data.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Erro ao buscar aeroportos:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce menor para busca mais responsiva
    const debounceTimer = setTimeout(searchAirports, 200);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  const handleSelect = (airport) => {
    setInputValue(airport.iataCode);
    onChange(airport.iataCode);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
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

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((airport, index) => (
            <button
              key={airport.iataCode}
              type="button"
              onClick={() => handleSelect(airport)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-start gap-3 ${
                index === selectedIndex ? 'bg-gray-700' : ''
              }`}
            >
              <Plane className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-purple-400">{airport.iataCode}</span>
                  <span className="text-gray-400 text-xs">{airport.type}</span>
                </div>
                <div className="text-sm text-white truncate">{airport.name}</div>
                {airport.city && (
                  <div className="text-xs text-gray-400">
                    {airport.city}{airport.country ? `, ${airport.country}` : ''}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
