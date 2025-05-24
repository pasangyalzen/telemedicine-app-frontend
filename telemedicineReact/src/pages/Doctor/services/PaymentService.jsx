// import axios from 'axios';

// export const initiatePayment = async (paymentData) => {
//   try {
//     const response = await axios.post('http://localhost:5186/api/payment/initiate', {
//       amount: paymentData.amount,
//       orderId: paymentData.orderId,
//       orderName: paymentData.orderName,
//       customerName: paymentData.customerName,
//       customerEmail: paymentData.customerEmail,
//       customerPhone: paymentData.customerPhone
//     });

//     const paymentUrl = response.data.paymentUrl;
//     console.log('Payment URL:', paymentUrl);
//     // Optionally redirect
//     // window.location.href = paymentUrl;
//   } catch (error) {
//     if (error.response) {
//       console.error('API Error:', error.response.data.message);
//     } else {
//       console.error('Request Error:', error.message);
//     }
//   }
// };

import axios from 'axios';

export const initiatePayment = async (paymentData) => {
  try {
    const response = await axios.post('http://localhost:5186/api/payment/initiate', {
      amount: paymentData.amount,
      orderId: paymentData.orderId,
      orderName: paymentData.orderName,
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,
      customerPhone: paymentData.customerPhone
    });

    const paymentUrl = response.data.paymentUrl;
    if (paymentUrl) {
      window.location.href = paymentUrl; // ✅ Redirect to Khalti
    } else {
      console.error("No payment URL received.");
    }
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data.message);
    } else {
      console.error('Request Error:', error.message);
    }
  }
};


export const verifyPayment = async (pidx, amount) => {
  try {
    const response = await axios.post('http://localhost:5186/api/payment/verify-payment', {
      pidx,
      amount,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Optional, only if endpoint is secured
      },
    });

    console.log("✅ Payment verified:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Payment verification error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Payment verification failed");
  }
};


export const confirmAppointment = async (appointmentId) => {
  try {
    const response = await axios.put(
      `http://localhost:5186/api/Patient/ConfirmAppointment/${appointmentId}`,
      {}, // PUT body is empty
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Appointment Confirmed:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 Error confirming appointment:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to confirm appointment");
  }
};