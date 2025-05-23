import { useState, useEffect } from "react"
import axios from "axios"

export const usePatientData = () => {
  const [loading, setLoading] = useState(true)
  const [patientId, setPatientId] = useState(null)
  const [today, setToday] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [past, setPast] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [error, setError] = useState("")
  const [patientInfo, setPatientInfo] = useState(null)
const [patientInfoError, setPatientInfoError] = useState("")

  const [todayError, setTodayError] = useState("")
  const [upcomingError, setUpcomingError] = useState("")
  const [pastError, setPastError] = useState("")
  const [prescriptionsError, setPrescriptionsError] = useState("")

  const userId = localStorage.getItem("id")
  const patientName = localStorage.getItem("name") || "Patient"

  const apiClient = axios.create({
    baseURL: "http://localhost:5186/api/Patient",
    headers: {
      "Content-Type": "application/json",
    },
  })

  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  const fetchTodaysAppointments = async (id) => {
    const res = await apiClient.get(`/GetTodaysAppointmentsByPatient/${id}`)
    return res.data
  }

  const fetchUpcomingAppointments = async (id) => {
    const res = await apiClient.get(`/GetUpcomingAppointments/${id}`)
     console.log("Ressstttt",res);
    return res.data
  }

  const fetchPastAppointments = async (id) => {
    const res = await apiClient.get(`/GetPastAppointments/${id}`)
    return res.data
  }

  const fetchPrescriptions = async (id) => {
    const res = await apiClient.get(`/GetPrescriptionsByPatientId/${id}`)
    return res.data
  }

  const getPatientIdByUserId = async (userId) => {
    const res = await apiClient.get(`/GetPatientIdByUserId/${userId}`)
    return res.data.patientId || res.data.id || res.data
  }

  const fetchPatientDetails = async (id) => {
  const res = await apiClient.get(`/GetPatientById/${id}`)
  return res.data
}

  const fetchConsultation = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(
        `http://localhost:5186/api/Patient/GetConsultationByAppointmentId/${appointmentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const text = await response.text()
      if (!text) {
        throw new Error("Empty response received.")
      }

      return JSON.parse(text)
    } catch (error) {
      console.error("Error fetching consultation:", error)
      return { error: "Failed to fetch consultation details." }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          setError("User not logged in.")
          return
        }

        setLoading(true)
        const fetchedPatientId = await getPatientIdByUserId(userId)
        setPatientId(fetchedPatientId)

        const safeFetch = async (fn, setData, setErr) => {
          try {
            const result = await fn(fetchedPatientId)
            setData(result)
            setErr("")
          } catch (e) {
            setData([])
            setErr("Failed to load this section.")
          }
        }

        await Promise.all([
          safeFetch(fetchTodaysAppointments, setToday, setTodayError),
          safeFetch(fetchUpcomingAppointments, setUpcoming, setUpcomingError),
          safeFetch(fetchPastAppointments, setPast, setPastError),
          safeFetch(fetchPrescriptions, setPrescriptions, setPrescriptionsError),
          safeFetch(fetchPatientDetails, setPatientInfo, setPatientInfoError),
        ])
      } catch (err) {
        setError("Something went wrong. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  return {
    loading,
    error,
    patientId,
    patientName,
    today,
    patientInfo,         
    patientInfoError, 
    upcoming,
    past,
    prescriptions,
    todayError,
    upcomingError,
    pastError,
    prescriptionsError,
    fetchConsultation,
  }
}
