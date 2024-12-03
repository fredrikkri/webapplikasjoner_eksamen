import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">


      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-cover bg-center py-24"  >
        <div className="text-center p-6 bg-white rounded-lg">
          <h2 className="text-4xl font-semibold text-gray-900 mb-4 p-22">
            Eksamen gruppe 18
          </h2>
          <a
            href="http://localhost:4000/events"
            className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg font-medium shadow-lg hover:bg-blue-500 transition-all duration-300"
          >
            Utforsk arrangementer
          </a>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-center text-white py-6">
        <p>© Gruppe 18 | All Rights Reserved</p>
      </footer>
    </div>
  );
}
