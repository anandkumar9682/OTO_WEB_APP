import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
import Toast from './Toast';
import '../styles/CityList.css';
import {
  fetchCities,
  createCity,
  updateCity,
  deleteCity as deleteCityApi,
} from '../api/userService';

const CityList = () => {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({ cityId: null, cityName: '', isUpdate: false });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadCities = async (page = 0) => {
    setLoading(true);
    try {
      const res = await fetchCities(page);
      const data = res.data;
      setCities(data.cityList || []);
      setCurrentPage(data.currentPage ?? page);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      setToastMsg('Error loading cities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities(0);
  }, []);

  const handleInputChange = (e) => {
    setForm(prev => ({ ...prev, cityName: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cityName.trim()) {
      setToastMsg('City name cannot be empty');
      return;
    }

    try {
      if (form.isUpdate) {
        await updateCity(form.cityId, form.cityName);
        setToastMsg('City updated successfully');
      } else {
        await createCity(form.cityName);
        setToastMsg('City added successfully');
      }

      setForm({ cityId: null, cityName: '', isUpdate: false });
      loadCities(currentPage);
    } catch (error) {
      setToastMsg(error.response?.data?.message || 'Something went wrong');
    }
  };

  const prepareUpdate = (city) => {
    setForm({ cityId: city.cityId, cityName: city.cityName, isUpdate: true });
  };

  const cancelUpdate = () => {
    setForm({ cityId: null, cityName: '', isUpdate: false });
  };

  const handleDelete = async (cityId) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;

    try {
      await deleteCityApi(cityId);
      setToastMsg('City deleted successfully');

      if (cities.length === 1 && currentPage > 0) {
        loadCities(currentPage - 1);
      } else {
        loadCities(currentPage);
      }
    } catch (error) {
      setToastMsg(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="report-container" style={{ padding: '1rem' }}>
      <div className="report-header">
        <h1 className="recent-Articles">Total Registered City</h1>
        <form onSubmit={handleSubmit} className="form_city">
          <input
            type="text"
            name="cityName"
            placeholder="Enter City name"
            value={form.cityName}
            onChange={handleInputChange}
            required
          className="input_style"
          />
          <button type="submit" disabled={loading}>
            {form.isUpdate ? 'Update' : 'Save'}
          </button>
          {form.isUpdate && (
            <button
              type="button"
              onClick={cancelUpdate}
              style={{
                backgroundColor: '#777',
                color: 'white',
                height: '38px',
                padding: '8px 15px',
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <p>Loading cities...</p>
      ) : (
        <>
          <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>City ID</th>
                <th>City Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(cities) && cities.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No City found.
                  </td>
                </tr>
              ) : (
                cities.map(city => (
                  <tr key={city.cityId}>
                    <td>{city.cityId}</td>
                    <td>{city.cityName}</td>
                    <td>
                      <button
                        className="operation-btn label-tag3"
                        onClick={() => prepareUpdate(city)}
                        style={{ marginRight: '10px' }}
                      >
                        Update
                      </button>
                      <button
                        className="operation-btn label-tag2"
                        onClick={() => handleDelete(city.cityId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={loadCities} />

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default CityList;
