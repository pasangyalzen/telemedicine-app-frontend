import React, { useState, useEffect } from 'react';
import { fetchAppointments } from '../services/appointmentApi'; // Assuming your API functions are in the `api.js` file
import toast from 'react-hot-toast';// Assuming you're using `react-toastify` for toasts

const PaginationComponent = ({ currentPage, setCurrentPage, setAppointments, setTotalPages }) => {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    fetchAppointmentsData(page);
  }, [page]);

  const fetchAppointmentsData = async (page) => {
    try {
      const data = await fetchAppointments(page);
      if (data && data.appointments) {
        setAppointments(data.appointments);
        setTotalPages(data.totalPages); // Assuming `totalPages` is returned from API
      } else {
        toast.error("No data available");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching appointments");
    }
  };

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > setTotalPages) {
      return;
    }
    setPage(newPage);
    setCurrentPage(newPage);
  };

  const handleNextPage = async () => {
    if (page < setTotalPages) {
      setPage(page + 1);
      setCurrentPage(page + 1);
    }
  };

  const handlePrevPage = async () => {
    if (page > 1) {
      setPage(page - 1);
      setCurrentPage(page - 1);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handlePrevPage}
        disabled={page === 1}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg mr-2 transition-all hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <span className="text-lg font-semibold px-4 py-2">{`${page} of ${setTotalPages}`}</span>
      <button
        onClick={handleNextPage}
        disabled={page === setTotalPages}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg ml-2 transition-all hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;