import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Edit, Package, MapPin, Search } from 'lucide-react';
import { Address } from '../lib/users_address';

interface AddressesProps {
  onViewMap: () => void;
}

export default function Addresses({ onViewMap }: AddressesProps) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'mine' | 'all'>('mine');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Address[]>([]);
  const [searching, setSearching] = useState(false);
  const API_URL = 'http://localhost:3000/api';
  const [formData, setFormData] = useState({
    searchWord: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, [viewMode, user]);
  const fetchAddresses = async () => {

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let query = await fetch(`${API_URL}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let query2 = await fetch(`${API_URL}/addresses/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = await query.json();

      if (viewMode === 'mine' && user) {
        data = await query2.json();
      }
      // if (error) throw error;
      // console.log("Data:", data)
      setAddresses(data.items || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/addresses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "searchWord": formData.searchWord, "name": formData.name, "description": formData.description }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data };
      }

      window.location.reload();

      return { error: null };
    } catch (error) {
      return { "Error adding address": error };
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      // const { error } = await supabase.from('addresses').delete().eq('id', id);
      // if (error) throw error;
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  // const findNearest = async () => {
  //   if (!searchQuery.trim()) return;

  //   setSearching(true);
  //   try {
  //     const coords = searchQuery.split(',').map(s => parseFloat(s.trim()));
  //     if (coords.length !== 2 || coords.some(isNaN)) {
  //       alert('Please enter coordinates in format: latitude, longitude');
  //       return;
  //     }

  //     const [searchLat, searchLon] = coords;

  //     const { data, error } = await supabase.from('addresses').select('*');

  //     if (error) throw error;

  //     const sorted = (data || [])
  //       .map((addr) => ({
  //         ...addr,
  //         distance: calculateDistance(
  //           searchLat,
  //           searchLon,
  //           addr.latitude,
  //           addr.longitude
  //         ),
  //       }))
  //       .sort((a, b) => a.distance - b.distance)
  //       .slice(0, 5);

  //     setSearchResults(sorted);
  //   } catch (error) {
  //     console.error('Error searching:', error);
  //   } finally {
  //     setSearching(false);
  //   }
  // };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Address Management</h2>
        <div className="flex gap-2">
          <button
            onClick={onViewMap}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            View Map
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Find Nearest Address</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter coordinates (e.g., 40.7128, -74.0060)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            // onClick={findNearest}
            disabled={searching}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Nearest Addresses:</h4>
            <div className="space-y-2">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-3 border border-gray-200 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {/* Stock: {result.stock} | Distance: {result.distance?.toFixed(2)} km */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SearchWord
              </label>
              <input
                type="text"
                value={formData.searchWord}
                onChange={(e) => setFormData({ ...formData, searchWord: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="WaffleHouse Texas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Warehouse A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Stupid Building"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Address
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Addresses</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('mine')}
              className={`px-4 py-2 rounded-lg transition ${viewMode === 'mine'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              My Addresses
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg transition ${viewMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              All Addresses
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No addresses found. Add your first address!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(addresses) && addresses.map((address) => (
              <div
                key={address.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-lg">{address.name}</h4>
                  {/* {address.user_id === user?.id && (
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )} */}
                </div>
                <p className="text-gray-600 text-sm mb-3">{address.description}</p>
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {address.lat.toFixed(4)}, {address.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {/* <span>Stock: {address.stock}</span> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
