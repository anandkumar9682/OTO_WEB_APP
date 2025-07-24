import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';

import {
  fetchRegisteredApartmentDates,
  fetchApartmentMapLog,
} from '../api/userService';

const TraceUserPropertyList = ({ userId, onBack }) => {
  const [dateList, setDateList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const [mapData, setMapData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const navigate = useNavigate();

  const loadDates = async (page = 0) => {
    setLoading(true);
    try {
      const response = await fetchRegisteredApartmentDates(page, userId);
      const data = response.data;
      setDateList(data.dateList || []);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage ?? page);
    } catch (error) {
      console.error(error);
      setToastMsg('Error loading registered dates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDates(0);
  }, [userId]);

  const handleViewOnMap = async (createdDate) => {
    setLoading(true);
    try {
      const resp = await fetchApartmentMapLog(userId, createdDate);
      const list = resp.data || [];
      if (!Array.isArray(list) || list.length === 0) {
        setToastMsg('No properties found for that date.');
        return;
      }
      setSelectedDate(createdDate);
      setMapData(list);
      setMapOpen(true);
    } catch (err) {
      console.error(err);
      setToastMsg('Error loading map data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      mapOpen &&
      mapData.length > 0 &&
      window.google &&
      window.google.maps
    ) {
      requestAnimationFrame(() => {
        const container = mapContainerRef.current;
        if (!(container instanceof HTMLElement)) {
          console.error('mapContainerRef.current is not an HTMLElement');
          return;
        }

        const sortedData = [...mapData].sort((a, b) => {
          const parseDate = (str) => {
            const [time, ampm, day, month, year] =
              str.match(/(\d{2}:\d{2}:\d{2}) (\w{2}) (\d{2})-(\d{2})-(\d{4})/)
                .slice(1);
            let [hours, minutes, seconds] = time.split(':').map(Number);
            if (ampm.toLowerCase() === 'pm' && hours !== 12) hours += 12;
            if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
            return new Date(
              `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${minutes}:${seconds}`
            );
          };
          return parseDate(a.createdDate) - parseDate(b.createdDate);
        });

        const first = sortedData[0];
        const center = { lat: first.latitude, lng: first.longitude };

        mapInstanceRef.current = new window.google.maps.Map(container, {
          center,
          zoom: 12,
          mapId: '85ebdf4d94584cd399ea9ecc',
        });

        const AdvancedMarkerElement =
          window.google.maps.marker?.AdvancedMarkerElement;

        sortedData.forEach((loc, idx) => {
          const position = { lat: loc.latitude, lng: loc.longitude };

         if (AdvancedMarkerElement) {
  const markerDiv = document.createElement('div');
  markerDiv.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
    <div style="
        font-size: 13px;
        font-weight: bold;
        color: rgb(255, 255, 255);
        background-color:rgb(245, 0, 0);
        padding: 2px 6px;
        border-radius: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120px;
      " title="${loc.propertyName}">
        ${loc.propertyName}
      </div>
    <div style="
        font-size: 20px;
        line-height: 1;
        margin-bottom: 4px;
      ">🏠</div>
    <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        background: #007bff;
        color: white;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        box-shadow: 0 0 3px rgba(0,0,0,0.3);
        margin-bottom: 4px;
      ">
        ${idx + 1}
      </div>
      
      
    </div>
  `;

  new AdvancedMarkerElement({
    map: mapInstanceRef.current,
    position,
    content: markerDiv,
  });
} else {
  new window.google.maps.Marker({
    position,
    map: mapInstanceRef.current,
    title: loc.propertyName,
    label: {
      text: String(idx + 1),
      color: 'white',
      fontWeight: 'bold',
    },
    icon: {
      url: 'https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
      scaledSize: new window.google.maps.Size(32, 32),
    },
  });
}

        });

        const path = sortedData.map((loc) => ({
          lat: loc.latitude,
          lng: loc.longitude,
        }));

        const lineSymbol = {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 1,
          strokeColor: '#000',
        };

        const polyline = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          icons: [
            {
              icon: lineSymbol,
              offset: '0%',
              repeat: '30px',
            },
          ],
        });

        polyline.setMap(mapInstanceRef.current);
      });
    }
  }, [mapOpen, mapData]);

  return (
    <div className="report-container" style={{ padding: '1rem' }}>
      <div
        className="report-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          justifyContent: 'flex-start',
        }}
      >
        <button
          onClick={onBack}
          style={{
            backgroundColor: '#f5f5f5',
            border: '1px solid #ccc',
            borderRadius: '999px',
            padding: '0.3rem 1rem',
            color: 'black',
            fontSize: '1.2rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="recent-Articles" style={{ margin: 0 }}>
          Registered Properties by Date
        </h1>
      </div>

      {loading && <p>Loading data...</p>}

      {!loading && (
        <>
          <table
            className="report-table"
            style={{ width: '100%', borderCollapse: 'collapse' }}
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Apartments Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dateList.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No data available.
                  </td>
                </tr>
              ) : (
                dateList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.createdDate}</td>
                    <td>{item.apartmentCount}</td>
                    <td>
                      <button
                        className="operation-btn label-tag3"
                        onClick={() => handleViewOnMap(item.createdDate)}
                      >
                        View on Map
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
            onPageChange={loadDates}
          />
        </>
      )}

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {mapOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: '80%',
              height: '80%',
              backgroundColor: 'white',
              borderRadius: '8px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                borderBottom: '1px solid #eee',
              }}
            >
              <h2 style={{ margin: 0 }}>
                Properties for {userId} on {selectedDate}
              </h2>
              <button
                onClick={() => setMapOpen(false)}
                style={{
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ccc',
                  padding: '0.3rem 1rem',
                  color: 'black',
                  borderRadius: '999px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div
              ref={mapContainerRef}
              style={{
                flex: 1,
                minHeight: '300px',
                margin: '1rem',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TraceUserPropertyList;
