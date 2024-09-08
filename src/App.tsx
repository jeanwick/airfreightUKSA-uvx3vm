import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const App: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [volume, setVolume] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showEmailPopup, setShowEmailPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestRate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEmailPopup(true);
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner during email send

    const templateParams = {
      weight: weight,
      volume: volume,
      email: email,
    };

    emailjs
      .send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        templateParams,
        'YOUR_USER_ID'
      )
      .then(
        (result) => {
          alert('Rate request sent!');
          setLoading(false);
          setShowEmailPopup(false);
        },
        (error) => {
          setError('Failed to send the email. Please try again.');
          setLoading(false);
        }
      );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Background design */}
      <div className="absolute inset-0">
        {/* Top white part */}
        <div className="bg-white h-1/2"></div>
        {/* Bottom red part with diagonal cut */}
        <div className="h-1/2 bg-customRed clip-path-bottom"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Airfreight Console
        </h1>

        {/* Origin Field (Read-only) */}
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">
            Origin:
          </label>
          <input
            type="text"
            value="Heathrow"
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Destination Field (Read-only) */}
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">
            Destination:
          </label>
          <input
            type="text"
            value="Johannesburg"
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">
            Weight (kg):
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">
            Volume (m³):
          </label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-plum text-white py-3 px-5 rounded-lg w-full hover:bg-plum-dark transition-all duration-300 ease-in-out shadow-md"
        >
          Request Rate
        </button>
      </div>

      {showEmailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ease-in-out duration-300">
          <form
            onSubmit={sendEmail}
            className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Enter Your Email Address
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
            <button
              type="submit"
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
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
