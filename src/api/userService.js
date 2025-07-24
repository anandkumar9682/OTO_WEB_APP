// src/api/userService.js
import axiosInstance from './axiosInstance';

export const login = (credentials) => {
  return axiosInstance.post('/auth/login', credentials).then(res => res.data);
};

export const changeAdminPassword = (userId,oldPassword, newPassword) => {
  return axiosInstance.post('/auth/admin_user_change_password', {
    userId,
    oldPassword,
    newPassword,
  });
};

export const fetchDashboardTotals = () => {
  return axiosInstance.get('/dashboard/total_counts');
};

export const fetchApartments = (pageNo = 0) => {
  return axiosInstance.get(`/apartments/fetch?pageNo=${pageNo}`);
};

export const toggleApartmentStatus = (apartmentId) => {
  return axiosInstance.post(`/apartments/status/${apartmentId}/toggle`);
};

export const fetchBookings = async (pageNo = 0) => {
  return axiosInstance.get(`/booking/fetch?pageNo=${pageNo}`);
};

export const downloadInvoice = async (bookingRequestId) => {
  return axiosInstance.get(
    `/oto_lead/users/generate_invoice?bookingRequestId=${bookingRequestId}`,
    {
      responseType: 'blob',
    }
  );
};


// Cities API
export const fetchCities = (page = 0) => {
  return axiosInstance.get(`/cities/fetch?pageNo=${page}`);
};

export const createCity = (cityName) => {
  return axiosInstance.post('/cities/create', { cityName });
};

export const updateCity = (cityId, cityName) => {
  return axiosInstance.put(`/cities/update/${cityId}`, { cityName });
};

export const deleteCity = (cityId) => {
  return axiosInstance.delete(`/cities/delete/${cityId}`);
};


// Staff (Partner App Users) APIs
export const fetchStaffList = (page = 0) => {
  return axiosInstance.get(`/partner_app_users/fetch_all?pageNo=${page}`);
};

export const deleteStaffUser = (userId) => {
  return axiosInstance.delete(`/delete_partner_app_user?id=${userId}`);
};


// Partner App User APIs
export const getUserById = (userId) =>
  axiosInstance.get(`/partner_app_users/fetch_by_id?userId=${userId}`);


export function saveOrUpdateUser(payload) {
  const { isUpdate, ...data } = payload;
  return axiosInstance.post(`/partner_app_users/create_or_update?isUpdate=${isUpdate}`, data);
}



export const searchApartments = (query) =>
  axiosInstance.get(`/partner_app_users/search_apartment_list?text=${query}`);


export const fetchPropertyRegisteredStaffList = (page = 0) => {
  return axiosInstance.get(`/partner_app_users/fetch_property_registered_users?pageNo=${page}`);
};


export const fetchRegisteredApartmentDates = (page = 0, createdBy) => {
  const params = { pageNo: page };
  if (createdBy !== undefined && createdBy !== null) {
    params.createdBy = createdBy;
  }
  return axiosInstance.get('/apartments/registered_dates', { params });
};


export const fetchApartmentMapLog = (createdBy, dateStr) => {
  return axiosInstance.get('/apartments/map_log', {
    params: { createdBy, date: dateStr },
  });
};