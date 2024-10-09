import React, { useState, Fragment } from 'react';
import emailjs from 'emailjs-com';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Dialog, Transition } from '@headlessui/react'; // Tailwind UI modal component
import { FaPlane, FaTimes } from 'react-icons/fa'; // Import the plane and times (X) icons

import Logo from './assets/logo.png'; // Adjust the path based on the actual file location

const App: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [volume, setVolume] = useState<string>('');
  const [cargoReadyDate, setCargoReadyDate] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>(''); // Combined Full Name
  const [companyName, setCompanyName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showEmailPopup, setShowEmailPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confettiVisible, setConfettiVisible] = useState<boolean>(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState<boolean>(false);

  const { width, height } = useWindowSize(); // To get screen size for confetti

  // List of disallowed email domains
  const disallowedDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'aol.com',
    'live.com',
    'msn.com',
    'comcast.net',
    'me.com',
    'mail.com',
    'protonmail.com',
    // Add any other domains as needed
  ];

  // Validation function for email format and domain
  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return false;
    }

    const domain = email.split('@')[1].toLowerCase();
    if (disallowedDomains.includes(domain)) {
      return false;
    }

    return true;
  };

  // Handle the "Get Started" button click
  const handleRequestRate = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic form validation
    if (!weight || !volume || !cargoReadyDate) {
      setFormError('Please fill in all fields before proceeding.');
      return;
    }

    // Convert weight and volume to numbers for validation
    const weightValue = parseFloat(weight);
    const volumeValue = parseFloat(volume);

    if (weightValue < 45) {
      setFormError('Weight must be at least 45 kg.');
      return;
    }

    if (volumeValue < 1) {
      setFormError('Volume must be at least 1 CBM.');
      return;
    }

    // If everything is valid, show the email popup
    setFormError(null);
    setShowEmailPopup(true);
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      // Validate Step 1 fields
      if (!fullName || !email) {
        setError('Please fill in all the required fields.');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid work email address.');
        return;
      }

      setError(null);
      setCurrentStep(2); // Proceed to next step
    } else if (currentStep === 2) {
      // Validate Step 2 fields
      if (!companyName || !contactNumber) {
        setError('Please fill in all the required fields.');
        return;
      }

      setError(null);
      sendEmail(); // All validations passed, send the email
    }
  };

  // Send email function
  const sendEmail = () => {
    setLoading(true); // Show loading state while sending the email

    const templateParams = {
      origin: 'Heathrow', // Static origin value
      destination: 'Johannesburg', // Static destination value
      weight: weight, // Pass form weight
      volume: volume, // Pass form volume
      cargoReadyDate: cargoReadyDate, // Pass Cargo Ready Date
      email: email, // Pass user's email
      fullName: fullName, // Pass Full Name
      companyName: companyName, // Pass Company Name
      contactNumber: contactNumber, // Pass Contact Number
    };

    // Send email to you with form details
    emailjs
      .send('service_hd4chrs', 'template_5ynm0vp', templateParams, 'AXz_LUkKIdRAnqjXk')
      .then(() => {
        // Now send the confirmation email to the user
        const userTemplateParams = {
          user_email: email, // Send confirmation to the user's email
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
        setError('Failed to send the email. Please try again.');
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col min-h-screen justify-between items-center bg-gray-50">
      {/* Confetti */}
      {confettiVisible && <Confetti width={width} height={height} />}

      {/* Background Design */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="h-[50%] bg-gray-100"></div>
        <div
          className="h-[50%] bg-customRed"
          style={{ clipPath: 'polygon(0 10%, 100% 0%, 100% 100%, 0% 90%)' }}
        ></div>
      </div>

      {/* Form Section */}
      <div className="relative z-10 bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md mx-auto mt-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Tell Us About Your Shipment</h1>

        {/* Error message if form validation fails */}
        {formError && <p className="text-red-500 mb-4">{formError}</p>}

        {/* Shipment Information */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">Your Air Freight Shipment</h2>

          {/* Origin Field (Read-only) */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">Origin</label>
            <input
              type="text"
              value="Heathrow"
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Destination Field (Read-only) */}
          <div className="mb-3">
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
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">Cargo Details</h2>

          {/* Weight Input */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Chargeable Weight (kg) <span className="text-xs text-gray-500">(Minimum 45 kg)</span>
            </label>
            <input
              type="number"
              min="45"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-customRed"
              required
            />
          </div>

          {/* Volume Input */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Volume (CBM) <span className="text-xs text-gray-500">(Minimum 1 CBM)</span>
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-customRed"
              required
            />
          </div>
        </div>

        {/* Cargo Ready Date */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">Cargo Ready Date</h2>
          <label className="block text-sm font-medium text-gray-600 mb-1">Select Date</label>
          <input
            type="date"
            value={cargoReadyDate}
            onChange={(e) => setCargoReadyDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-plum"
            required
          />
        </div>

        {/* Get Started Button */}
        <button
          type="submit"
          onClick={handleRequestRate}
          className={`bg-plum hover:bg-plum-dark text-white py-2 px-5 sm:py-3 rounded-lg w-full transition-all duration-300 ease-in-out shadow-md group ${
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
            <span className="flex items-center justify-center">
              <span className="block group-hover:hidden">Get Started</span>
              <FaPlane className="hidden group-hover:block w-6 h-6" />
            </span>
          )}
        </button>
      </div>

      {/* Footer Section */}
      <footer className="relative w-full bg-white py-4 z-20">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <span className="text-sm text-gray-500 mr-2">Powered by</span>
          <img src={Logo} alt="Freitan Logo" className="w-16 h-auto" />
        </div>
      </footer>

      {/* Multi-Step Email Popup */}
      <Transition appear show={showEmailPopup} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowEmailPopup(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {/* Close Icon */}
                  <button
                    onClick={() => setShowEmailPopup(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>

                  {/* Progress Indicator */}
                  <div className="mb-4 mt-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentStep >= 1 ? 'bg-plum text-white' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        1
                      </div>
                      <div className={`h-1 w-8 ${currentStep > 1 ? 'bg-plum' : 'bg-gray-200'}`}></div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          currentStep >= 2 ? 'bg-plum text-white' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        2
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-red-500 mb-4">{error}</p>}

                  <form onSubmit={handleFormSubmit}>
                    {currentStep === 1 && (
                      <>
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Step 1: Basic Information
                        </Dialog.Title>

                        {/* Full Name Input */}
                        <div className="mt-4">
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-customRed"
                            placeholder="Full Name"
                            required
                            autoFocus
                          />
                        </div>

                        {/* Email Input */}
                        <div className="mt-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-customRed"
                            placeholder="Work Email Address"
                            required
                          />
                        </div>
                      </>
                    )}

                    {currentStep === 2 && (
                      <>
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Step 2: Additional Details
                        </Dialog.Title>

                        {/* Company Name Input */}
                        <div className="mt-4">
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-customRed"
                            placeholder="Company Name"
                            required
                            autoFocus
                          />
                        </div>

                        {/* Contact Number Input */}
                        <div className="mt-2">
                          <input
                            type="tel"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-customRed"
                            placeholder="Cell or Office Number"
                            required
                          />
                        </div>
                      </>
                    )}

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex justify-center rounded-md border border-transparent bg-plum px-4 py-2 text-sm font-medium text-white hover:bg-plum-dark transition-all duration-300 ease-in-out group ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          'Processing...'
                        ) : (
                          <span className="flex items-center">
                            <span className="block group-hover:hidden">
                              {currentStep === 1 ? 'Next' : 'Submit'}
                            </span>
                            <FaPlane className="hidden group-hover:block w-5 h-5" />
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Confirmation Popup (Tailwind UI Modal) */}
      <Transition appear show={showConfirmationPopup} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowConfirmationPopup(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Thank You!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Our pricing desk is working on your request. You'll receive a response soon.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-plum px-4 py-2 text-sm font-medium text-white hover:bg-plum-dark focus:outline-none focus:ring-2 focus:ring-plum focus:ring-offset-2"
                      onClick={() => setShowConfirmationPopup(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default App;