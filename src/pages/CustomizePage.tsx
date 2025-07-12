import React, { useState } from 'react';
import { Plus, Minus, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Notes {
  top: string;
  middle: string;
  base: string;
}

const noteOptions = {
  top: ['Lemon', 'Bergamot', 'Orange', 'Grapefruit', 'Mint', 'Lavender', 'Rose Petals', 'Jasmine'],
  middle: ['Rose', 'Jasmine', 'Lily', 'Geranium', 'Ylang-Ylang', 'Freesia', 'Peony', 'Magnolia'],
  base: ['Sandalwood', 'Cedar', 'Musk', 'Amber', 'Vanilla', 'Patchouli', 'Vetiver', 'Oud']
};

const sizeMultiplier = {
  '30ml': 0.8,
  '50ml': 1,
  '100ml': 1.6
};

const CustomizePage: React.FC = () => {
  const [selectedNotes, setSelectedNotes] = useState<Notes>({
    top: '',
    middle: '',
    base: ''
  });
  const [perfumeName, setPerfumeName] = useState('');
  const [size, setSize] = useState('50ml');
  const { addToCart } = useCart();

  const handleNoteSelect = (category: keyof Notes, note: string) => {
    setSelectedNotes(prev => ({
      ...prev,
      [category]: prev[category] === note ? '' : note
    }));
  };

  const getPrice = () => {
    const basePrice = 120;
    return basePrice * sizeMultiplier[size as keyof typeof sizeMultiplier];
  };

  const handleAddToCart = () => {
    if (!selectedNotes.top || !selectedNotes.middle || !selectedNotes.base || !perfumeName) {
      alert('Please complete your perfume customization');
      return;
    }

    addToCart({
      id: `custom-${Date.now()}`,
      name: perfumeName || 'Custom Perfume',
      price: getPrice(),
      image: 'https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg',
      customNotes: selectedNotes
    });

    alert('Custom perfume added to cart!');
    
    // Reset form
    setSelectedNotes({ top: '', middle: '', base: '' });
    setPerfumeName('');
    setSize('50ml');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Signature Scent</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Design a unique fragrance that reflects your personality. Choose from premium ingredients 
            to create your perfect scent combination.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Customization Form */}
          <div className="space-y-8">
            {/* Perfume Name */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Name Your Perfume</h3>
              <input
                type="text"
                value={perfumeName}
                onChange={(e) => setPerfumeName(e.target.value)}
                placeholder="Enter a unique name for your perfume"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Note Selection */}
            {Object.entries(noteOptions).map(([category, notes]) => (
              <div key={category} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                  {category} Notes
                  <span className="text-sm text-gray-500 ml-2">
                    ({category === 'top' ? 'First impression' : 
                      category === 'middle' ? 'Heart of the fragrance' : 'Long-lasting base'})
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {notes.map(note => (
                    <button
                      key={note}
                      onClick={() => handleNoteSelect(category as keyof Notes, note)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedNotes[category as keyof Notes] === note
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Size Selection */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Size</h3>
              <div className="grid grid-cols-3 gap-4">
                {['30ml', '50ml', '100ml'].map(sizeOption => (
                  <button
                    key={sizeOption}
                    onClick={() => setSize(sizeOption)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      size === sizeOption
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-lg font-semibold">{sizeOption}</div>
                    <div className="text-sm text-gray-500">
                      ${(120 * sizeMultiplier[sizeOption as keyof typeof sizeMultiplier]).toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-8">
            {/* 3D Bottle Preview */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Your Perfume Preview</h3>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-48 bg-gradient-to-b from-purple-200 to-purple-400 rounded-t-full rounded-b-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"></div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="font-semibold text-gray-900">
                      {perfumeName || 'Your Custom Perfume'}
                    </p>
                    <p className="text-sm text-gray-500">{size}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Notes Summary */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Fragrance Profile</h3>
              <div className="space-y-4">
                {Object.entries(selectedNotes).map(([category, note]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="font-medium capitalize text-gray-700">{category} Note:</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      note 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {note || 'Not selected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-gray-900">Total Price:</span>
                <span className="text-3xl font-bold text-purple-600">${getPrice().toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Your custom perfume will be crafted by our expert perfumers and delivered within 7-10 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;