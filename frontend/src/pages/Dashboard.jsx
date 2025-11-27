import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { flightService } from '../services/flightService';
import FlightCard from '../components/FlightCard';
import AddFlightModal from '../components/AddFlightModal';
import SmartSearch from '../components/SmartSearch';

export default function Dashboard() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSmartSearch, setShowSmartSearch] = useState(false);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      setLoading(true);
      const data = await flightService.getAll();
      setFlights(data);
    } catch (error) {
      console.error('Error loading flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await flightService.delete(id);
      await loadFlights();
    } catch (error) {
      alert('Erro ao deletar voo');
    }
  };

  const handleCheckNow = async (id) => {
    try {
      const loadingToast = 'Verificando preços...';
      console.log(loadingToast);
      
      const result = await flightService.checkNow(id);
      
      if (result.success) {
        alert(`✅ Preço verificado!\n\nPreço atual: ${result.currency} ${result.price}\n${result.shouldNotify ? '🎉 Notificação enviada!' : ''}`);
      } else {
        alert(`⚠️ ${result.message || 'Nenhuma oferta encontrada no momento'}`);
      }
      
      await loadFlights();
    } catch (error) {
      console.error('Check error:', error);
      alert('❌ Erro ao verificar voo. Tente novamente.');
    }
  };

  const stats = {
    total: flights.length,
    active: flights.filter(f => f.is_active).length,
    withTarget: flights.filter(f => f.target_price && f.last_price && f.last_price <= f.target_price).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando voos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
          <div className="text-3xl font-bold text-white mb-2">{stats.total}</div>
          <div className="text-gray-300">Voos Monitorados</div>
        </div>
        <div className="card bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
          <div className="text-3xl font-bold text-white mb-2">{stats.active}</div>
          <div className="text-gray-300">Ativos</div>
        </div>
        <div className="card bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
          <div className="text-3xl font-bold text-white mb-2">{stats.withTarget}</div>
          <div className="text-gray-300">Metas Atingidas</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Seus Voos</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSmartSearch(!showSmartSearch)} 
            className="btn btn-secondary flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {showSmartSearch ? 'Ocultar Busca' : 'Busca Inteligente'}
          </button>
          <button onClick={loadFlights} className="btn btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Monitoramento
          </button>
        </div>
      </div>

      {/* Smart Search */}
      {showSmartSearch && (
        <div className="mb-6">
          <SmartSearch />
        </div>
      )}

      {/* Flight List */}
      {flights.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum voo monitorado</h3>
          <p className="text-gray-400 mb-6">Comece adicionando seu primeiro monitoramento</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Voo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {flights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              onClick={() => navigate(`/flight/${flight.id}`)}
              onDelete={handleDelete}
              onCheckNow={handleCheckNow}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddFlightModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadFlights}
      />
    </div>
  );
}
