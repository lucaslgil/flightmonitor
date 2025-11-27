import { useState } from 'react';
import { 
  Plane, 
  Clock, 
  Calendar, 
  Building2, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Briefcase,
  Users,
  CircleDot
} from 'lucide-react';
import { getAirlineName, getAircraftName } from '../lib/airlines';

export default function FlightOfferCard({ offer, index, isInPriceRange, isBestOffer }) {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return `${hours}h ${minutes}m`;
  };

  const calculateLayoverTime = (arrival, nextDeparture) => {
    const arrivalTime = new Date(arrival);
    const departureTime = new Date(nextDeparture);
    const diffMs = departureTime - arrivalTime;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `${hours}h ${minutes}m`;
  };

  const getTotalStops = (itinerary) => {
    return itinerary.segments.length - 1;
  };

  return (
    <div
      className={`rounded-lg border transition-all ${
        isBestOffer
          ? 'bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/50'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
      }`}
    >
      {/* Header - Sempre visível */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isBestOffer && (
                <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded">
                  ✨ MELHOR OFERTA
                </span>
              )}
              {isInPriceRange && !isBestOffer && (
                <span className="text-xs font-semibold text-purple-400 bg-purple-500/20 px-2 py-1 rounded">
                  🎯 NA FAIXA
                </span>
              )}
              <span className="text-xs text-gray-400">#{index + 1}</span>
            </div>
            
            {/* Companhia Principal */}
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-white">
                {getAirlineName(offer.validatingAirlineCodes?.[0] || offer.itineraries[0].segments[0].carrierCode)}
              </span>
            </div>

            {/* Assentos disponíveis */}
            {offer.numberOfBookableSeats && (
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-400">
                  {offer.numberOfBookableSeats} {offer.numberOfBookableSeats === 1 ? 'assento' : 'assentos'} disponível
                </span>
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              R$ {(offer.price.totalBRL || offer.price.total).toFixed(2)}
            </div>
            {offer.price.totalBRL && (
              <div className="text-xs text-gray-400">
                {offer.price.currency} {offer.price.total.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Resumo dos voos */}
        <div className="space-y-3">
          {offer.itineraries.map((itinerary, idx) => {
            const firstSegment = itinerary.segments[0];
            const lastSegment = itinerary.segments[itinerary.segments.length - 1];
            const stops = getTotalStops(itinerary);

            return (
              <div key={idx} className="bg-gray-900/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-purple-400">
                    {idx === 0 ? '✈️ IDA' : '🔄 VOLTA'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {stops === 0 ? '🟢 Direto' : `🟡 ${stops} ${stops === 1 ? 'parada' : 'paradas'}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {/* Origem */}
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-white">
                      {formatTime(firstSegment.departure.at)}
                    </div>
                    <div className="text-sm text-gray-400">{firstSegment.departure.iataCode}</div>
                    <div className="text-xs text-gray-500">{formatDate(firstSegment.departure.at)}</div>
                  </div>

                  {/* Duração e linha */}
                  <div className="flex-1 px-4">
                    <div className="text-center mb-1">
                      <span className="text-xs text-purple-400 font-medium">
                        {formatDuration(itinerary.duration)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CircleDot className="w-2 h-2 text-gray-500" />
                      <div className="flex-1 h-px bg-gray-600 mx-1"></div>
                      <Plane className="w-4 h-4 text-gray-500 rotate-90" />
                      <div className="flex-1 h-px bg-gray-600 mx-1"></div>
                      <MapPin className="w-2 h-2 text-gray-500" />
                    </div>
                  </div>

                  {/* Destino */}
                  <div className="flex-1 text-right">
                    <div className="text-2xl font-bold text-white">
                      {formatTime(lastSegment.arrival.at)}
                    </div>
                    <div className="text-sm text-gray-400">{lastSegment.arrival.iataCode}</div>
                    <div className="text-xs text-gray-500">{formatDate(lastSegment.arrival.at)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botão expandir */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Ver menos detalhes
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Ver todos os detalhes
            </>
          )}
        </button>
      </div>

      {/* Detalhes expandidos */}
      {expanded && (
        <div className="border-t border-gray-700 p-4 space-y-4">
          {offer.itineraries.map((itinerary, itinIdx) => (
            <div key={itinIdx}>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                <Calendar className="w-4 h-4 text-purple-400" />
                <h4 className="font-semibold text-white">
                  {itinIdx === 0 ? 'Detalhes da Ida' : 'Detalhes da Volta'}
                </h4>
              </div>

              <div className="space-y-4">
                {itinerary.segments.map((segment, segIdx) => (
                  <div key={segIdx}>
                    {/* Trechos do voo */}
                    <div className="bg-gray-900/70 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-600/20 p-2 rounded-lg">
                            <Plane className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {getAirlineName(segment.carrierCode)}
                            </div>
                            <div className="text-xs text-gray-400">
                              Voo {segment.carrierCode} {segment.number}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-purple-400 font-medium">
                            {formatDuration(segment.duration)}
                          </div>
                          {segment.aircraft && (
                            <div className="text-xs text-gray-500">
                              {getAircraftName(segment.aircraft)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Partida */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-green-600/20 p-1.5 rounded mt-1">
                          <CircleDot className="w-3 h-3 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-white">
                              {formatTime(segment.departure.at)}
                            </span>
                            <span className="text-sm text-gray-400">
                              {formatDate(segment.departure.at)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300">
                            {segment.departure.iataCode}
                            {segment.departure.terminal && (
                              <span className="text-gray-500 ml-2">
                                Terminal {segment.departure.terminal}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Linha de conexão */}
                      <div className="flex items-center gap-3 ml-2 my-2">
                        <div className="w-px h-8 bg-gray-700"></div>
                        <div className="text-xs text-gray-500">
                          {segment.numberOfStops > 0 && `${segment.numberOfStops} parada(s)`}
                        </div>
                      </div>

                      {/* Chegada */}
                      <div className="flex items-start gap-3">
                        <div className="bg-red-600/20 p-1.5 rounded mt-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-white">
                              {formatTime(segment.arrival.at)}
                            </span>
                            <span className="text-sm text-gray-400">
                              {formatDate(segment.arrival.at)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300">
                            {segment.arrival.iataCode}
                            {segment.arrival.terminal && (
                              <span className="text-gray-500 ml-2">
                                Terminal {segment.arrival.terminal}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conexão entre segmentos */}
                    {segIdx < itinerary.segments.length - 1 && (
                      <div className="flex items-center gap-2 py-3 px-4 bg-orange-600/10 border-l-4 border-orange-500 my-2">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <div className="text-sm">
                          <span className="text-orange-400 font-medium">Conexão em {segment.arrival.iataCode}</span>
                          <span className="text-gray-400 ml-2">
                            • Tempo de espera: {calculateLayoverTime(
                              segment.arrival.at,
                              itinerary.segments[segIdx + 1].departure.at
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Informações adicionais */}
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 mt-4">
            <div className="flex items-start gap-2">
              <Briefcase className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-xs text-gray-300">
                <div className="font-semibold text-blue-400 mb-1">Informações da Reserva</div>
                <div className="space-y-1">
                  <div>• Companhia validadora: {getAirlineName(offer.validatingAirlineCodes?.[0] || 'N/A')}</div>
                  {offer.numberOfBookableSeats && (
                    <div>• Assentos disponíveis nesta tarifa: {offer.numberOfBookableSeats}</div>
                  )}
                  <div>• Código da oferta: {offer.id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
