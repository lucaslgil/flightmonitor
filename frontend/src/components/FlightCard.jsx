import { Plane, TrendingDown, TrendingUp, Activity } from 'lucide-react';

export default function FlightCard({ flight, onClick, onDelete, onCheckNow }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getPriceChange = () => {
    if (!flight.last_price || !flight.lowest_price) return null;
    const diff = flight.last_price - flight.lowest_price;
    const percent = ((diff / flight.lowest_price) * 100).toFixed(1);
    return { diff, percent, isHigher: diff > 0 };
  };

  const priceChange = getPriceChange();

  return (
    <div className="card hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 cursor-pointer">
      <div onClick={onClick}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-lg">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {flight.origin} → {flight.destination}
              </div>
              <div className="text-sm text-gray-400">
                {formatDate(flight.departure_date)}
                {flight.return_date && ` - ${formatDate(flight.return_date)}`}
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            flight.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {flight.is_active ? 'Ativo' : 'Pausado'}
          </div>
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {flight.last_price && (
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Último Preço</div>
              <div className="text-xl font-bold text-white">
                R$ {flight.last_price.toFixed(2)}
              </div>
              {priceChange && (
                <div className={`text-xs flex items-center gap-1 mt-1 ${
                  priceChange.isHigher ? 'text-red-400' : 'text-green-400'
                }`}>
                  {priceChange.isHigher ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(priceChange.percent)}%
                </div>
              )}
            </div>
          )}
          {flight.lowest_price && (
            <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
              <div className="text-xs text-green-400 mb-1">Menor Preço</div>
              <div className="text-xl font-bold text-green-400">
                R$ {flight.lowest_price.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Target Price */}
        {(flight.min_price || flight.max_price) && (
          <div className="mb-4 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="text-xs text-purple-400">
              🎯 Faixa de Preço: 
              {flight.min_price && flight.max_price ? (
                <span className="ml-1">
                  R$ {flight.min_price.toFixed(2)} - R$ {flight.max_price.toFixed(2)}
                  {flight.last_price && 
                   flight.last_price >= flight.min_price && 
                   flight.last_price <= flight.max_price && (
                    <span className="ml-2 text-green-400">✓ Dentro da faixa!</span>
                  )}
                </span>
              ) : flight.max_price ? (
                <span className="ml-1">
                  até R$ {flight.max_price.toFixed(2)}
                  {flight.last_price && flight.last_price <= flight.max_price && (
                    <span className="ml-2 text-green-400">✓ Atingido!</span>
                  )}
                </span>
              ) : (
                <span className="ml-1">
                  a partir de R$ {flight.min_price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        )}
        {/* Legacy target_price support */}
        {!flight.min_price && !flight.max_price && flight.target_price && (
          <div className="mb-4 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="text-xs text-purple-400">
              🎯 Meta: R$ {flight.target_price.toFixed(2)}
              {flight.last_price && flight.last_price <= flight.target_price && (
                <span className="ml-2 text-green-400">✓ Atingida!</span>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span>{flight.adults} adulto(s)</span>
          <span>•</span>
          <span>{flight.travel_class}</span>
          {flight.last_checked_at && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {new Date(flight.last_checked_at).toLocaleString('pt-BR')}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCheckNow(flight.id);
          }}
          className="btn btn-secondary flex-1 text-sm"
        >
          Verificar Agora
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Tem certeza que deseja deletar este monitoramento?')) {
              onDelete(flight.id);
            }
          }}
          className="btn btn-danger text-sm"
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
