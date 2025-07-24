import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import { fetchPropertyRegisteredStaffList } from '../api/userService';

const TraceUserActivity = ({ onViewUser }) => {
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadStaff = async (page = 0) => {
    setLoading(true);
    try {
      const response = await fetchPropertyRegisteredStaffList(page);
      const data = response.data;
      setStaffList(data.partnerAppUsers || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage ?? page);
    } catch (error) {
      console.error(error);
      setToastMsg('Error loading staff data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff(0);
  }, []);

  const handleView = (userId) => {
    if (onViewUser) {
      onViewUser(userId); // trigger Dashboard to switch to TraceUserDate view
    }
  };

  return (
    <div className="report-container" style={{ padding: '1rem' }}>
      <div className="report-header">
        <h1 className="recent-Articles">Property Registered by Staffs</h1>
      </div>

      {loading ? (
        <p>Loading staff data...</p>
      ) : (
        <>
          <table
            className="report-table"
            style={{ width: '100%', borderCollapse: 'collapse' }}
          >
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Mobile No.</th>
                <th>Email</th>
                <th>Total Properties</th>
                <th>Is Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No registered staff available.
                  </td>
                </tr>
              ) : (
                staffList.map((item) => (
                  <tr key={item.userId}>
                    <td>{item.userId}</td>
                    <td>{item.name}</td>
                    <td>{item.mobileNo}</td>
                    <td>{item.email}</td>
                    <td>{item.propertyCount ?? 0}</td>
                    <td>
                      <span
                        className={item.isActive ? 'label-tag3' : 'label-tag2'}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="operation-btn label-tag3"
                        onClick={() => handleView(item.userId)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={loadStaff}
          />
        </>
      )}

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default TraceUserActivity;
