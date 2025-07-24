import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
import Toast from './Toast';
import { fetchApartments, toggleApartmentStatus } from "../api/userService";
const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadApartments = async (page) => {
    setLoading(true);
    try {
      const response = await fetchApartments(page);
      const data = response.data;

      setApartments(data.apartmentList || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage ?? page);
    } catch (error) {
      console.error(error);
      setToastMsg('Error loading apartments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApartments(0);
  }, []);

  const performAction = async (apartmentId) => {
    const confirmed = window.confirm("Are you sure you want to toggle this apartment's status?");
    if (!confirmed) return;

    try {
      const response = await toggleApartmentStatus(apartmentId);
      setToastMsg(response.data.message || 'Apartment status updated successfully.');
      loadApartments(currentPage);
    } catch (error) {
      console.error(error);
      setToastMsg('Failed to update apartment status.');
    }
  };

  return (
    <div className="report-container" style={{ padding: '1rem' }}>
      <div className="report-header">
        <h1 className="recent-Articles">Total Registered Property</h1>
      </div>

      {loading ? (
        <p>Loading apartments...</p>
      ) : (
        <>
          <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Property ID</th>
                <th>Property Name</th>
                <th>City</th>
                <th>Charges</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {apartments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No apartments found.
                  </td>
                </tr>
              ) : (
                apartments.map((item) => (
                  <tr key={item.apartmentId}>
                    <td>
                      <img
                        src={`${item.imageBaseUrl}/${item.apartmentId}_0.png`}
                        alt="Apartment"
                        style={{ maxWidth: 100 }}
                      />
                    </td>
                    <td>{item.apartmentId}</td>
                    <td>{item.propertyName}</td>
                    <td>{item.city}</td>
                    <td>{item.charges}</td>
                    <td>{item.location}</td>
                    <td>
                      <button
                        className={`operation-btn ${item.isActive ? 'label-tag2' : 'label-tag3'}`}
                        onClick={() => performAction(item.apartmentId)}
                        style={{
                          backgroundColor: item.isActive ? '#ff6666' : '#4CAF50',
                          border: 'none',
                          padding: '5px 10px',
                          color: 'white',
                          cursor: 'pointer',
                          borderRadius: 4,
                        }}
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={loadApartments} />
        </>
      )}

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default ApartmentList;
