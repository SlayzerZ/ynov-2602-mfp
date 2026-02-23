import { useState, useEffect } from 'react';
import { Address } from '../lib/users_address';
import { ArrowLeft, MapPin, Package } from 'lucide-react';

interface MapViewProps {
  onBack: () => void;
}

export default function MapView({ onBack }: MapViewProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://localhost:3000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      let data = fetch(`${API_URL}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // if (error) throw error;
      // setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerPosition = (lat: number, lon: number) => {
    const centerLat = addresses.length > 0
      ? addresses.reduce((sum, addr) => sum + Number(addr.lat), 0) / addresses.length
      : 0;
    const centerLon = addresses.length > 0
      ? addresses.reduce((sum, addr) => sum + Number(addr.lng), 0) / addresses.length
      : 0;

    const scale = 100;
    const x = 50 + (Number(lon) - centerLon) * scale;
    const y = 50 - (Number(lat) - centerLat) * scale;

    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Location Map</h2>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Loading map...
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No addresses to display on the map.
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="relative w-full aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border border-gray-400" />
                  ))}
                </div>

                {addresses.map((address) => {
                  const pos = getMarkerPosition(Number(address.lat), Number(address.lng));
                  return (
                    <div
                      key={address.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ left: pos.x, top: pos.y }}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="relative">
                        <MapPin
                          className={`w-8 h-8 transition-all ${selectedAddress?.id === address.id
                            ? 'text-red-600 scale-125'
                            : 'text-blue-600 group-hover:scale-110'
                            }`}
                          fill="currentColor"
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {address.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Click on markers to view details. Map shows relative positions of all addresses.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-4">
                {selectedAddress ? 'Location Details' : 'All Locations'}
              </h3>

              {selectedAddress ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{selectedAddress.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{selectedAddress.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Coordinates</div>
                        <div className="text-gray-600">
                          Lat: {Number(selectedAddress.lat).toFixed(4)}
                          <br />
                          Lon: {Number(selectedAddress.lng).toFixed(4)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Package className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Stock</div>
                        {/* <div className="text-gray-600">{selectedAddress.stock} units</div> */}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAddress(null)}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                  >
                    Clear Selection
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => setSelectedAddress(address)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="font-semibold text-sm">{address.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {/* Stock: {address.stock} */}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
