import { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Calendar, 
  MapPin, 
  TrendingDown,
  Plane,
  Clock,
  Loader2,
  ChevronRight
} from 'lucide-react';
import AirportAutocomplete from './AirportAutocomplete';

export default function SmartSearch({ onFlightSelect }) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    travelClass: 'ECONOMY'
  });

  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setResults(null);

    try {
      const response = await fetch('http://localhost:3001/api/flights/search/smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originLocationCode: formData.origin,
          destinationLocationCode: formData.destination,
          departureDate: formData.departureDate,
          returnDate: formData.returnDate || null,
          adults: parseInt(formData.adults),
          travelClass: formData.travelClass
        })
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Erro na busca:', error);
      alert('Erro ao buscar voos. Tente novamente.');
    } finally {
      setSearching(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Busca Inteligente</h2>
            <p className="text-sm text-gray-400">Encontre os voos mais baratos com IA</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origem */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Origem
              </label>
              <AirportAutocomplete
                value={formData.origin}
                onChange={(value) => setFormData({ ...formData, origin: value })}
                placeholder="De onde?"
                allowCities={true}
              />
            </div>

            {/* Destino */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Destino
              </label>
              <AirportAutocomplete
                value={formData.destination}
                onChange={(value) => setFormData({ ...formData, destination: value })}
                placeholder="Para onde?"
                allowCities={true}
              />
            </div>

            {/* Data Ida */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data de Ida
              </label>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                className="input"
                required
              />
            </div>

            {/* Data Volta */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data de Volta (opcional)
              </label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="input"
              />
            </div>

            {/* Passageiros */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Passageiros
              </label>
              <input
                type="number"
                min="1"
                max="9"
                value={formData.adults}
                onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                className="input"
              />
            </div>

            {/* Classe */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Classe
              </label>
              <select
                value={formData.travelClass}
                onChange={(e) => setFormData({ ...formData, travelClass: e.target.value })}
                className="input"
              >
                <option value="ECONOMY">Econômica</option>
                <option value="PREMIUM_ECONOMY">Econômica Premium</option>
                <option value="BUSINESS">Executiva</option>
                <option value="FIRST">Primeira Classe</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={searching || !formData.origin || !formData.destination || !formData.departureDate}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            {searching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Buscando as melhores ofertas...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Buscar Voos Mais Baratos
              </>
            )}
          </button>
        </form>
      </div>

      {/* Resultados */}
      {results && (
        <div className="space-y-4">
          {/* Resumo */}
          {results.summary.bestPrice && (
            <div className="card bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-400 mb-1">✨ Melhor Oferta Encontrada</div>
                  <div className="text-3xl font-bold text-white">
                    {formatPrice(results.summary.bestPrice)}
                  </div>
                  {results.summary.savings > 0 && (
                    <div className="text-sm text-green-400 mt-1">
                      💰 Economia de {formatPrice(results.summary.savings)} ({results.summary.savingsPercent}%)
                    </div>
                  )}
                </div>
                <TrendingDown className="w-12 h-12 text-green-400" />
              </div>
            </div>
          )}

          {/* Datas Flexíveis */}
          {results.recommendations.flexibleDates?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Datas Alternativas
              </h3>
              <div className="space-y-2">
                {results.recommendations.flexibleDates.slice(0, 5).map((option, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => onFlightSelect && onFlightSelect(option.offer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          idx === 0 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {idx === 0 ? 'MAIS BARATO' : `#${idx + 1}`}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {formatDate(option.departureDate)}
                            {option.returnDate && ` - ${formatDate(option.returnDate)}`}
                          </div>
                          {option.savings !== null && option.savings !== 0 && (
                            <div className={`text-xs ${
                              option.savings > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {option.savings > 0 ? '↓' : '↑'} {formatPrice(Math.abs(option.savings))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          {formatPrice(option.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aeroportos Próximos */}
          {results.recommendations.nearbyAirports?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Aeroportos Alternativos
              </h3>
              <div className="space-y-2">
                {results.recommendations.nearbyAirports.map((option, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => onFlightSelect && onFlightSelect(option.offer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Plane className="w-5 h-5 text-blue-400 rotate-90" />
                        <div>
                          <div className="text-white font-medium">
                            {option.origin} → {option.destination}
                          </div>
                          <div className="text-xs text-gray-400">
                            Aeroporto alternativo
                          </div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {formatPrice(option.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classes de Serviço */}
          {results.recommendations.differentClasses?.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Comparação de Classes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.recommendations.differentClasses.map((option, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => onFlightSelect && onFlightSelect(option.offer)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-300">
                        {option.class === 'ECONOMY' && '🪑 Econômica'}
                        {option.class === 'PREMIUM_ECONOMY' && '✨ Premium Economy'}
                        {option.class === 'BUSINESS' && '💼 Executiva'}
                        {option.class === 'FIRST' && '👑 Primeira Classe'}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(option.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totais */}
          <div className="card bg-gray-800/30">
            <div className="text-center text-gray-400">
              <div className="text-sm">
                🔍 {results.summary.totalOptions} opções encontradas
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
