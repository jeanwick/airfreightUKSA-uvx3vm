import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const App: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [volume, setVolume] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showEmailPopup, setShowEmailPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confettiVisible, setConfettiVisible] = useState<boolean>(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState<boolean>(false);

  const { width, height } = useWindowSize(); // To get screen size for confetti

  // Validation function for email format
  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Handle the "Request Rate" button click
  const handleRequestRate = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic form validation
    if (!weight || !volume) {
      setFormError('Please fill in all fields before requesting the rate.');
      return;
    }

    // If everything is valid, show the email popup
    setFormError(null);
    setShowEmailPopup(true);
  };

  // Handle email submission
  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email before proceeding
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true); // Show loading state while sending the email

    const templateParams = {
      origin: 'Heathrow',     // Static origin value
      destination: 'Johannesburg',  // Static destination value
      weight: weight,         // Pass form weight
      volume: volume,         // Pass form volume
      email: email,           // Pass user's email
    };

    // Send email to you with form details
    emailjs.send('service_hd4chrs', 'template_5ynm0vp', templateParams, 'AXz_LUkKIdRAnqjXk')
      .then(() => {
        // Now send the confirmation email to the user
        const userTemplateParams = {
          user_email: email,  // Send confirmation to the user's email
        };
        return emailjs.send('service_hd4chrs', 'template_mpbou6k', userTemplateParams, 'AXz_LUkKIdRAnqjXk');
      })
      .then(() => {
        setLoading(false);
        setShowEmailPopup(false); // Close the pop-up after sending the email
        setConfettiVisible(true); // Show confetti when email is successfully sent
        setShowConfirmationPopup(true); // Show confirmation pop-up to the user
      })
      .catch(() => {
        setError("Failed to send the email. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Confetti */}
      {confettiVisible && <Confetti width={width} height={height} />}

      {/* Background Design */}
      <div className="absolute inset-0 w-full h-full">
        <div className="h-[50%] bg-gray-100"></div>
        <div className="h-[50%] bg-customRed" style={{ clipPath: 'polygon(0 10%, 100% 0%, 100% 100%, 0% 90%)' }}></div>
      </div>

      {/* Form Section */}
      <div className="relative z-10 bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Airfreight Rate Request</h1>

        {/* Error message if form validation fails */}
        {formError && <p className="text-red-500 mb-4">{formError}</p>}

        {/* Shipment Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Shipment Information</h2>

          {/* Origin Field (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Origin</label>
            <input
              type="text"
              value="Heathrow"
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Destination Field (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Destination</label>
            <input
              type="text"
              value="Johannesburg"
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Freight Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Freight Details</h2>

          {/* Weight Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Volume Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Volume (m³)</label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>
        </div>

        {/* Request Rate Button */}
        <button
          type="submit"
          onClick={handleRequestRate}
          className={`bg-plum hover:bg-plum-dark text-white py-3 px-5 rounded-lg w-full transition-all duration-300 ease-in-out shadow-md ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Request Rate'
          )}
        </button>
      </div>

      {/* Email Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Enter Your Email Address</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Email Input */}
            <div className="mb-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                placeholder="Email Address"
                required
              />
            </div>

            {/* Send Request Button */}
            <button
              type="submit"
              onClick={sendEmail}
              disabled={loading}
              className={`bg-plum text-white py-3 px-5 rounded-lg w-full hover:bg-plum-dark focus:ring-4 focus:ring-purple-300 active:bg-purple-800 transition-all duration-300 ease-in-out shadow-md ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Request'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Pop-up */}
      {showConfirmationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thank you!</h2>
            <p className="text-gray-600">Our pricing desk from Freitan is now working on your request and will be in touch shortly.</p>
            <button
              onClick={() => setShowConfirmationPopup(false)}
              className="bg-plum text-white py-2 px-4 rounded-lg mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;