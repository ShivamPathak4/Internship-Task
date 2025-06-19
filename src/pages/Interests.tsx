
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { interestsData, Interest } from '../utils/interestsData';
import { ChevronLeft, ChevronRight, Divide } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const Interests = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load saved interests from localStorage
    const saved = localStorage.getItem(`interests_${user?.id}`);
    if (saved) {
      setSelectedInterests(new Set(JSON.parse(saved)));
    }
  }, [isAuthenticated, navigate, user?.id]);

  const handleInterestToggle = (interestId: string) => {
    const newSelected = new Set(selectedInterests);
    if (newSelected.has(interestId)) {
      newSelected.delete(interestId);
    } else {
      newSelected.add(interestId);
    }
    setSelectedInterests(newSelected);
    
    // Save to localStorage
    localStorage.setItem(`interests_${user?.id}`, JSON.stringify([...newSelected]));
  };

  const totalPages = Math.ceil(interestsData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentInterests = interestsData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-black mb-3">
                Please mark your interests!
              </h2>
              <p className="text-black">We will keep you notified.</p>
            </div>
            <hr className=" mb-8   "/>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                My saved interests!
              </h3>
              
              <div className="space-y-4">
                {currentInterests.map((interest) => (
                  <label
                    key={interest.id}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedInterests.has(interest.id)}
                        onChange={() => handleInterestToggle(interest.id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 border-2 rounded-sm transition-all duration-200 flex items-center justify-center ${
                          selectedInterests.has(interest.id)
                            ? 'bg-black border-black'
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}
                      >
                        {selectedInterests.has(interest.id) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-900 group-hover:text-black transition-colors">
                      {interest.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="text-gray-400 flex hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                <ChevronLeft size={16} className="-ml-2" />
                 <ChevronLeft size={16} />
              </button>
              
              {getPaginationNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  disabled={page === '...'}
                  className={`w-8 h-8 text-sm rounded transition-colors ${
                    page === currentPage
                      ? 'bg-black text-white'
                      : page === '...'
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="text-gray-400 flex hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
                <ChevronRight size={16} />
                <ChevronRight size={16} className="-ml-2" />
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Selected: {selectedInterests.size} interests
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interests;
