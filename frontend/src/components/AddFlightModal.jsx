import { useState } from 'react';
import { X } from 'lucide-react';
import { flightService } from '../services/flightService';
import AirportAutocomplete from './AirportAutocomplete';

export default function AddFlightModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: 'ECONOMY',
    minPrice: '',
    maxPrice: '',
    notificationEmail: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        minPrice: formData.minPrice ? parseFloat(formData.minPrice) : null,
        maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null
      };

      await flightService.create(data);
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar monitoramento');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      origin: '',
      destination: '',
      departureDate: '',
      returnDate: '',
      adults: 1,
      children: 0,
      infants: 0,
      travelClass: 'ECONOMY',
      minPrice: '',
      maxPrice: '',
      notificationEmail: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Novo Monitoramento</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Origem (IATA) *</label>
              <AirportAutocomplete
                value={formData.origin}
                onChange={(value) => setFormData({ ...formData, origin: value })}
                placeholder="GRU"
                required
              />
            </div>
            <div>
              <label className="label">Destino (IATA) *</label>
              <AirportAutocomplete
                value={formData.destination}
                onChange={(value) => setFormData({ ...formData, destination: value })}
                placeholder="JFK"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Data de Ida *</label>
              <input
                type="date"
                className="input"
                required
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Data de Volta (opcional)</label>
              <input
                type="date"
                className="input"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Adultos</label>
              <input
                type="number"
                className="input"
                min="1"
                max="9"
                value={formData.adults}
                onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="label">Crianças</label>
              <input
                type="number"
                className="input"
                min="0"
                max="9"
                value={formData.children}
                onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="label">Bebês</label>
              <input
                type="number"
                className="input"
                min="0"
                max="9"
                value={formData.infants}
                onChange={(e) => setFormData({ ...formData, infants: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="label">Classe</label>
            <select
              className="input"
              value={formData.travelClass}
              onChange={(e) => setFormData({ ...formData, travelClass: e.target.value })}
            >
              <option value="ECONOMY">Econômica</option>
              <option value="PREMIUM_ECONOMY">Econômica Premium</option>
              <option value="BUSINESS">Executiva</option>
              <option value="FIRST">Primeira Classe</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Preço Mínimo (R$)</label>
              <input
                type="number"
                className="input"
                step="0.01"
                min="0"
                placeholder="500.00"
                value={formData.minPrice}
                onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Valor mínimo desejado</p>
            </div>
            <div>
              <label className="label">Preço Máximo (R$)</label>
              <input
                type="number"
                className="input"
                step="0.01"
                min="0"
                placeholder="2000.00"
                value={formData.maxPrice}
                onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Valor máximo aceitável</p>
            </div>
          </div>

          <div>
            <label className="label">Email para Notificações *</label>
            <input
              type="email"
              className="input"
              required
              value={formData.notificationEmail}
              onChange={(e) => setFormData({ ...formData, notificationEmail: e.target.value })}
              placeholder="seu@email.com"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Monitoramento'}
            </button>
            <button type="button" onClick={handleClose} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
