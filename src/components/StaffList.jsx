// StaffList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import Toast from './Toast';
import { fetchStaffList, deleteStaffUser } from '../api/userService';

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const navigate = useNavigate();

  const loadStaff = async (page = 0) => {
    setLoading(true);
    try {
      const response = await fetchStaffList(page);
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

  const performAction = async (user, actionType) => {
    if (actionType === 'delete') {
      const confirmed = window.confirm('Are you sure you want to delete this user?');
      if (!confirmed) return;

      try {
        await deleteStaffUser(user.userId);
        setToastMsg('User deleted successfully');
        if (staffList.length === 1 && currentPage > 0) {
          loadStaff(currentPage - 1);
        } else {
          loadStaff(currentPage);
        }
      } catch (error) {
        console.error(error);
        setToastMsg(error.response?.data?.message || 'Delete failed');
      }
    } else if (actionType === 'update') {
      navigate('/add-user', {
        state: { userId: user.userId, isUpdate: true }
      });
    }
  };

  return (
    <div className="report-container" style={{ padding: '1rem' }}>
      <div className="report-header">
        <h1 className="recent-Articles">Registered Staff</h1>
      </div>

      {loading ? (
        <p>Loading staff data...</p>
      ) : (
        <>
          <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Mobile No.</th>
                <th>Email</th>
                <th>Is Active</th>
                <th>Is RWA Partner</th>
                <th>Apartment ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
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
                    <td>
                      <span className={item.isActive ? 'label-tag3' : 'label-tag2'}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <span className={item.isRWAPartner ? 'label-tag3' : 'label-tag2'}>
                        {item.isRWAPartner ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{item.apartmentId}</td>
                    <td>
                      <button
                        className="operation-btn label-tag3"
                        onClick={() => performAction(item, 'delete')}
                        style={{ marginRight: '0.5rem' }}
                      >
                        Delete
                      </button>
                      <button
                        className="operation-btn label-tag2"
                        onClick={() => performAction(item, 'update')}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={loadStaff} />
        </>
      )}

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default StaffList;
