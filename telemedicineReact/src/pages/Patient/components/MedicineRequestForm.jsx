import { useState, useEffect, useRef } from "react";
import { MapPin, CreditCard, Banknote, X, Navigation, AlertCircle } from "lucide-react";

const MedicineRequestForm = ({ prescription, onClose }) => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [paymentOption, setPaymentOption] = useState("Cash on Delivery");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  // Replace with your actual Google Maps API key
  const GOOGLE_MAPS_API_KEY = "AIzaSyCBvOD3zembO-NuXr9yPacN33EI_jS_0no";

  // Load Google Maps API
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Global callback function
    window.initMap = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      setMapError(true);
      console.error('Failed to load Google Maps API');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, []);

  // Initialize map when loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      // Default center: Kathmandu, Nepal
      const kathmandu = { lat: 27.7172, lng: 85.3240 };
      
      // Initialize map
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: kathmandu,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi.business",
            stylers: [{ visibility: "on" }]
          },
          {
            featureType: "poi.medical",
            stylers: [{ visibility: "on" }]
          }
        ]
      });

      // Initialize geocoder
      geocoderRef.current = new window.google.maps.Geocoder();

      // Add click listener to map
      mapInstanceRef.current.addListener('click', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        setCoordinates({ lat, lng });
        
        // Update marker position
        updateMarker(lat, lng);
        
        // Get address from coordinates
        reverseGeocode(lat, lng);
      });

      // Try to get user's current location on load
      getCurrentLocation();

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }
  }, [mapLoaded]);

  const updateMarker = (lat, lng) => {
    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }
    
    // Create new marker
    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      title: 'Delivery Location',
      animation: window.google.maps.Animation.DROP,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="#10b981"/>
            <circle cx="15" cy="15" r="8" fill="white"/>
            <circle cx="15" cy="15" r="4" fill="#10b981"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(30, 40),
        anchor: new window.google.maps.Point(15, 40)
      }
    });
  };

  const reverseGeocode = (lat, lng) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      }
    );
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setCoordinates({ lat, lng });
          
          // Center map on user location
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng });
            mapInstanceRef.current.setZoom(16);
            
            // Update marker
            updateMarker(lat, lng);
            
            // Get address
            reverseGeocode(lat, lng);
          }
          
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoadingLocation(false);
          
          // Show user-friendly error message
          let errorMessage = 'Unable to get your location. ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Please select your location on the map.';
              break;
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutes
        }
      );
    } else {
      setIsLoadingLocation(false);
      alert('Geolocation is not supported by your browser. Please select your location on the map.');
    }
  };

  const handleSubmit = () => {
    if (!address || !coordinates) {
      alert('Please select a delivery location on the map');
      return;
    }

    const requestData = {
      prescriptionId: prescription?.prescriptionId || 'demo-prescription',
      deliveryAddress: address,
      coordinates: {
        latitude: coordinates.lat,
        longitude: coordinates.lng
      },
      paymentMethod: paymentOption,
      timestamp: new Date().toISOString()
    };

    console.log("Medicine Delivery Request:", requestData);
    
    // Here you would typically send this data to your backend
    // Example: 
    // fetch('/api/medicine-requests', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(requestData)
    // });

    alert('Request submitted successfully!');
    onClose();
  };

  const paymentOptions = [
    { 
      value: "Cash on Delivery", 
      icon: Banknote, 
      color: "text-green-600",
      description: "Pay when medicine is delivered"
    },
    { 
      value: "Khalti Payment", 
      icon: CreditCard, 
      color: "text-purple-600",
      description: "Pay online with Khalti wallet"
    },
  ];

  if (mapError) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Map Loading Error</h2>
            <p className="text-gray-600 mb-4">
              Unable to load Google Maps. Please check your API key configuration.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold mb-2">Request Medicine Delivery</h2>
          <p className="text-emerald-100">Select your delivery location and payment method</p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Delivery Location Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <MapPin className="text-emerald-600" size={20} />
                Delivery Location
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors disabled:opacity-50"
              >
                <Navigation size={14} />
                {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
              </button>
            </div>

            {/* Map Container */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner">
              {mapLoaded ? (
                <div
                  ref={mapRef}
                  className="w-full h-80"
                  style={{ minHeight: '320px' }}
                />
              ) : (
                <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 font-medium">Loading Google Maps...</p>
                    <p className="text-gray-500 text-sm mt-1">Please wait</p>
                  </div>
                </div>
              )}
            </div>

            {/* Address Display - Coordinates line removed */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Selected Address
              </label>
              <textarea
                required
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-emerald-500 focus:ring-0 resize-none transition-colors"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Click on the map to select your delivery location or enter address manually"
              />
            </div>
          </div>

          {/* Payment Options Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <CreditCard className="text-emerald-600" size={20} />
              Payment Method
            </label>
            
            <div className="grid gap-3">
              {paymentOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentOption === option.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={paymentOption === option.value}
                      onChange={(e) => setPaymentOption(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-full ${paymentOption === option.value ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      <IconComponent size={24} className={option.color} />
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-gray-800">{option.value}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        paymentOption === option.value 
                          ? 'border-emerald-500 bg-emerald-500' 
                          : 'border-gray-300'
                      }`}>
                        {paymentOption === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!address || !coordinates}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineRequestForm;