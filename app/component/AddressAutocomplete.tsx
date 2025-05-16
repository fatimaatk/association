"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Address {
  label: string;
  value: string;
  city: string;
  postcode: string;
  street: string;
}
type Feature = {
  properties: {
    label: string;
    city?: string;
    postcode?: string;
    name?: string;
  };
};

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, fullAddress: Address) => void;
  error?: string;
  className?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  error,
  className = "",
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log(suggestions)
  useEffect(() => {
    // Fermer les suggestions si on clique en dehors
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Recherche des numéros de rue
      const housenumberResponse = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          query
        )}&limit=5&type=housenumber`
      );
      const data = await housenumberResponse.json();

      if (data && data.features && Array.isArray(data.features)) {
        const formattedSuggestions: Address[] = data.features.map((feature: Feature) => ({
          label: feature.properties.label,
          value: feature.properties.label,
          city: feature.properties.city || '',
          postcode: feature.properties.postcode || '',
          street: feature.properties.name || '',
        }));
        setSuggestions(formattedSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'adresse:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue, {
      label: newValue,
      value: newValue,
      city: '',
      postcode: '',
      street: '',
    });

    // Debounce la recherche
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchAddress(newValue);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: Address) => {
    onChange(suggestion.value, suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={inputRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Entrez une adresse"
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-[#00B074] ${error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg"
          >
            {isLoading ? (
              <div className="p-2 text-center text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00B074] mx-auto"></div>
              </div>
            ) : (
              <ul className="max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    <div className="font-medium">{suggestion.street}</div>
                    <div className="text-gray-600">
                      {suggestion.postcode} {suggestion.city}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 