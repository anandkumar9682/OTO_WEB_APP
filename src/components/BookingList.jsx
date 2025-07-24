import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
import Toast from './Toast';
import { fetchBookings, downloadInvoice } from '../api/userService';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadBookings = async (page) => {
    setLoading(true);
    try {
      const response = await fetchBookings(page);
      const data = response.data;
      setBookings(data.recentBookingList || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage ?? page);
    } catch (error) {
      console.error(error);
      setToastMsg('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings(0);
  }, []);

  const generateInvoice = async (bookingRequestId) => {
    try {
      const res = await downloadInvoice(bookingRequestId);

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const contentDisposition = res.headers['content-disposition'];
      let filename = 'invoice.pdf';

      if (contentDisposition && contentDisposition.includes('attachment')) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match?.[1]) filename = match[1].replace(/['"]/g, '');
      }

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setToastMsg('Invoice downloaded successfully');
    } catch (error) {
      console.error(error);
      setToastMsg('Failed to download invoice');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1: return <span className="label-tag1">Pending</span>;
      case 2: return <span className="label-tag2">Reject</span>;
      case 3: return <span className="label-tag3">Approved</span>;
      case 4: return <span className="label-tag4">Booked</span>;
      default: return <span>Unknown</span>;
    }
  };

  return (
    <div className="report-container" style={{ padding: '1rem' }}>
      <div className="report-header">
        <h1 className="recent-Articles">Bookings History</h1>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <>
          <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Booking No</th>
                <th>Company Name</th>
                <th>GST No</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((item) => (
                  <tr key={item.bookingRequestId}>
                    <td>{item.bookingNo}</td>
                    <td>{item.companyName}</td>
                    <td>{item.gstNo}</td>
                    <td>{item.apartmentCharge}</td>
                    <td>{item.requestedDate}</td>
                    <td>{getStatusLabel(item.bookingStatus)}</td>
                    <td>
                      {item.bookingStatus === 4 && (
                        <button
                          onClick={() => generateInvoice(item.bookingRequestId)}
                          style={{
                            backgroundColor: '#0c007d',
                            color: 'white',
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                        >
                          Download Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={loadBookings} />
        </>
      )}

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default BookingList;
