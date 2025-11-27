import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingDown, TrendingUp, Clock, DollarSign, Target, RefreshCw, Plane, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { flightService } from '../services/flightService';
import FlightOfferCard from '../components/FlightOfferCard';

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadOffers();
      }, 30000); // Atualiza a cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [autoRefresh, id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [flightData, historyData, statsData] = await Promise.all([
        flightService.getById(id),
        flightService.getHistory(id),
        flightService.getStats(id)
      ]);
      setFlight(flightData);
      setHistory(historyData);
      setStats(statsData.stats);
      
      // Carrega ofertas automaticamente
      loadOffers();
    } catch (error) {
      console.error('Error loading flight details:', error);
      alert('Erro ao carregar detalhes');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadOffers = async () => {
    try {
      setLoadingOffers(true);
      const offersData = await flightService.getOffers(id);
      setOffers(offersData);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoadingOffers(false);
    }
  };

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    const hours = match[1] ? match[1].replace('H', 'h ') : '';
    const minutes = match[2] ? match[2].replace('M', 'min') : '';
    return `${hours}${minutes}`;
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!flight) return null;

  const chartData = history
    .slice()
    .reverse()
    .map(h => ({
      date: new Date(h.checked_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      price: h.price
    }));

  return (
    <div>
      {/* Back Button */}
      <button onClick={() => navigate('/')} className="btn btn-secondary mb-6 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      {/* Flight Info */}
      <div className="card mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">
          {flight.origin} → {flight.destination}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Data de Ida</div>
            <div className="text-white font-medium">
              {new Date(flight.departure_date).toLocaleDateString('pt-BR')}
            </div>
          </div>
          {flight.return_date && (
            <div>
              <div className="text-gray-400">Data de Volta</div>
              <div className="text-white font-medium">
                {new Date(flight.return_date).toLocaleDateString('pt-BR')}
              </div>
            </div>
          )}
          <div>
            <div className="text-gray-400">Passageiros</div>
            <div className="text-white font-medium">{flight.adults} adulto(s)</div>
          </div>
          <div>
            <div className="text-gray-400">Classe</div>
            <div className="text-white font-medium">{flight.travel_class}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <div className="text-sm text-gray-300">Preço Atual</div>
            </div>
            <div className="text-2xl font-bold text-white">
              R$ {stats.current.toFixed(2)}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-green-400" />
              <div className="text-sm text-gray-300">Menor Preço</div>
            </div>
            <div className="text-2xl font-bold text-green-400">
              R$ {stats.lowest.toFixed(2)}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-red-400" />
              <div className="text-sm text-gray-300">Maior Preço</div>
            </div>
            <div className="text-2xl font-bold text-red-400">
              R$ {stats.highest.toFixed(2)}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <div className="text-sm text-gray-300">Média</div>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              R$ {stats.average.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Price Range Alert */}
      {(flight.min_price || flight.max_price) && (
        <div className={`card mb-6 ${
          stats?.current && flight.min_price && flight.max_price && 
          stats.current >= flight.min_price && stats.current <= flight.max_price
            ? 'bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30'
            : stats?.current && flight.max_price && stats.current <= flight.max_price
            ? 'bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30'
            : 'bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <Target className={`w-6 h-6 ${
              stats?.current && flight.min_price && flight.max_price && 
              stats.current >= flight.min_price && stats.current <= flight.max_price
                ? 'text-green-400'
                : stats?.current && flight.max_price && stats.current <= flight.max_price
                ? 'text-green-400'
                : 'text-orange-400'
            }`} />
            <div>
              <div className="font-semibold text-white">
                Faixa de Preço: 
                {flight.min_price && flight.max_price ? (
                  <span> R$ {flight.min_price.toFixed(2)} - R$ {flight.max_price.toFixed(2)}</span>
                ) : flight.max_price ? (
                  <span> até R$ {flight.max_price.toFixed(2)}</span>
                ) : (
                  <span> a partir de R$ {flight.min_price.toFixed(2)}</span>
                )}
              </div>
              <div className="text-sm text-gray-300">
                {stats?.current && flight.min_price && flight.max_price && 
                 stats.current >= flight.min_price && stats.current <= flight.max_price
                  ? '🎉 Preço dentro da faixa desejada! Você será notificado.'
                  : stats?.current && flight.max_price && stats.current <= flight.max_price
                  ? '🎉 Preço abaixo do máximo! Você será notificado.'
                  : flight.max_price && stats?.current
                  ? `Faltam R$ ${(stats.current - flight.max_price).toFixed(2)} para atingir o preço máximo.`
                  : 'Aguardando ofertas na faixa desejada.'
                }
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Legacy target_price support */}
      {!flight.min_price && !flight.max_price && flight.target_price && (
        <div className={`card mb-6 ${
          stats?.current <= flight.target_price
            ? 'bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30'
            : 'bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <Target className={`w-6 h-6 ${
              stats?.current <= flight.target_price ? 'text-green-400' : 'text-orange-400'
            }`} />
            <div>
              <div className="font-semibold text-white">
                Preço-Alvo: R$ {flight.target_price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-300">
                {stats?.current <= flight.target_price
                  ? '🎉 Meta atingida! Você será notificado por email.'
                  : `Faltam R$ ${(stats?.current - flight.target_price).toFixed(2)} para atingir a meta.`
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Offers Section */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plane className="w-6 h-6 text-purple-400" />
            Ofertas em Tempo Real
          </h2>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded text-purple-500 focus:ring-purple-500"
              />
              Auto-atualizar (30s)
            </label>
            <button
              onClick={loadOffers}
              disabled={loadingOffers}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOffers ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>

        {loadingOffers && offers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
            Buscando ofertas...
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Nenhuma oferta encontrada no momento
          </div>
        ) : (
          <div className="space-y-4">
            {offers.slice(0, 10).map((offer, index) => {
              const isInPriceRange = flight.min_price && flight.max_price
                ? offer.price.total >= flight.min_price && offer.price.total <= flight.max_price
                : flight.max_price
                ? offer.price.total <= flight.max_price
                : flight.target_price
                ? offer.price.total <= flight.target_price
                : false;

              return (
                <FlightOfferCard
                  key={offer.id}
                  offer={offer}
                  index={index}
                  isInPriceRange={isInPriceRange}
                  isBestOffer={index === 0}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Price Chart */}
      {chartData.length > 0 && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Histórico de Preços</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="card">
        <h2 className="text-xl font-bold text-white mb-4">Verificações Recentes</h2>
        {history.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nenhuma verificação realizada ainda</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Data/Hora</th>
                  <th className="text-right py-3 px-4 text-gray-300">Preço</th>
                  <th className="text-right py-3 px-4 text-gray-300">Variação</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 20).map((item, index) => {
                  const prev = history[index + 1];
                  const change = prev ? item.price - prev.price : 0;
                  const changePercent = prev ? ((change / prev.price) * 100).toFixed(1) : 0;

                  return (
                    <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(item.checked_at).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-white">
                        {item.currency} {item.price.toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        change < 0 ? 'text-green-400' : change > 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {prev ? (
                          <>
                            {change > 0 ? '+' : ''}{change.toFixed(2)} ({changePercent}%)
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
