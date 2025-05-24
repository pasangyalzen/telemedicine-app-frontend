import React, { useEffect, useState } from 'react';
import { verifyPayment, confirmAppointment } from '../../Doctor/services/PaymentService';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const VerifyPayment = () => {
  const navigate = useNavigate();
  
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  
  const pidx = searchParams.get('pidx');       // ?pidx=abc123
  const amount = parseFloat(searchParams.get('amount')); // ?amount=200
  
  useEffect(() => {
    const verifyAndConfirm = async () => {
      const appointmentId = localStorage.getItem('appointmentId');
      console.log("Appointment ID", appointmentId)
      
      if (!pidx || !amount || !appointmentId) {
        setMessage('❌ Missing pidx, amount, or appointment ID.');
        return;
      }
      
      try {
        // Step 1: Verify the payment
        await verifyPayment(pidx, amount);
        setMessage('✅ Payment verified successfully.');
        
        // Step 2: Confirm the appointment
        await confirmAppointment(appointmentId);
        setMessage(prev => `${prev}\n✅ Appointment confirmed.`);
        
        // Step 3: Remove appointmentId from localStorage
        localStorage.removeItem('appointmentId');
      } catch (error) {
        console.error(error);
        setMessage(`❌ Operation failed: ${error.message}`);
      }
    };
    
    verifyAndConfirm();
  }, [pidx, amount]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Verification</h1>
            <p className="text-teal-100">Processing your transaction securely</p>
          </div>
          
          {/* Content */}
          <div className="p-8">
            {/* Message Display */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 mb-8 border-2 border-teal-100">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-teal-800 mb-2">Status Update</h3>
                  <pre className="text-sm whitespace-pre-wrap text-teal-700 font-medium leading-relaxed">
                    {message || 'Initializing verification process...'}
                  </pre>
                </div>
              </div>
            </div>
            
            
            {/* Back Button */}
            <button
              onClick={() => navigate('/patientdashboard')}
              className="w-full py-4 px-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-teal-600/70 text-sm">
          <p className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure payment processing</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPayment;