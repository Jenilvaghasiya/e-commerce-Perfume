import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Beaker, Palette, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { formatPrice } from '@/lib/utils';
import { createCustomization, type CreateCustomizationPayload } from '@/services/api';
import { getToken } from '@/services/api';

interface Note {
  id: string;
  name: string;
  category: 'top' | 'middle' | 'base';
  description: string;
  intensity: number;
  price: number;
}

interface CustomBlend {
  name: string;
  notes: {
    top: Note[];
    middle: Note[];
    base: Note[];
  };
  concentration: number;
  bottleSize: number;
  totalPrice: number;
}

const availableNotes: Note[] = [
  // Top Notes
  { id: '1', name: 'Bergamot', category: 'top', description: 'Citrusy and fresh', intensity: 8, price: 150 },
  { id: '2', name: 'Lemon', category: 'top', description: 'Bright and zesty', intensity: 9, price: 120 },
  { id: '3', name: 'Lavender', category: 'top', description: 'Floral and calming', intensity: 6, price: 180 },
  { id: '4', name: 'Mint', category: 'top', description: 'Cool and refreshing', intensity: 7, price: 140 },
  
  // Middle Notes
  { id: '5', name: 'Rose', category: 'middle', description: 'Classic and romantic', intensity: 7, price: 250 },
  { id: '6', name: 'Jasmine', category: 'middle', description: 'Exotic and intoxicating', intensity: 8, price: 300 },
  { id: '7', name: 'Geranium', category: 'middle', description: 'Green and rosy', intensity: 6, price: 200 },
  { id: '8', name: 'Ylang-Ylang', category: 'middle', description: 'Sweet and floral', intensity: 7, price: 280 },
  
  // Base Notes
  { id: '9', name: 'Sandalwood', category: 'base', description: 'Warm and creamy', intensity: 9, price: 400 },
  { id: '10', name: 'Vanilla', category: 'base', description: 'Sweet and comforting', intensity: 8, price: 350 },
  { id: '11', name: 'Musk', category: 'base', description: 'Sensual and deep', intensity: 9, price: 450 },
  { id: '12', name: 'Cedar', category: 'base', description: 'Woody and dry', intensity: 7, price: 320 },
];

const bottleSizes = [
  { size: 30, multiplier: 0.8, label: '30ml - Travel Size' },
  { size: 50, multiplier: 1, label: '50ml - Standard' },
  { size: 100, multiplier: 1.8, label: '100ml - Premium' },
];

const concentrations = [
  { value: 15, label: 'Eau de Toilette (15%)', multiplier: 1 },
  { value: 20, label: 'Eau de Parfum (20%)', multiplier: 1.3 },
  { value: 25, label: 'Parfum (25%)', multiplier: 1.6 },
];

const PerfumeCustomizer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [customBlend, setCustomBlend] = useState<CustomBlend>({
    name: '',
    notes: { top: [], middle: [], base: [] },
    concentration: 20,
    bottleSize: 50,
    totalPrice: 0
  });
  const [saving, setSaving] = useState(false);

  const steps = [
    { id: 0, title: 'Name Your Perfume', icon: Palette },
    { id: 1, title: 'Select Notes', icon: Beaker },
    { id: 2, title: 'Choose Concentration', icon: Sparkles },
    { id: 3, title: 'Select Bottle Size', icon: Package },
  ];

  useEffect(() => {
    calculatePrice();
  }, [customBlend.notes, customBlend.concentration, customBlend.bottleSize]);

  const calculatePrice = () => {
    const basePrice = 500;
    const notesPrice = [
      ...customBlend.notes.top,
      ...customBlend.notes.middle,
      ...customBlend.notes.base
    ].reduce((sum, note) => sum + note.price, 0);
    
    const concentrationMultiplier = concentrations.find(c => c.value === customBlend.concentration)?.multiplier || 1;
    const sizeMultiplier = bottleSizes.find(s => s.size === customBlend.bottleSize)?.multiplier || 1;
    
    const totalPrice = (basePrice + notesPrice) * concentrationMultiplier * sizeMultiplier;
    
    setCustomBlend(prev => ({ ...prev, totalPrice }));
  };

  const addNote = (note: Note) => {
    const category = note.category;
    const currentNotes = customBlend.notes[category];
    
    if (currentNotes.length < 3 && !currentNotes.find(n => n.id === note.id)) {
      setCustomBlend(prev => ({
        ...prev,
        notes: {
          ...prev.notes,
          [category]: [...currentNotes, note]
        }
      }));
    }
  };

  const removeNote = (noteId: string, category: 'top' | 'middle' | 'base') => {
    setCustomBlend(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [category]: prev.notes[category].filter(note => note.id !== noteId)
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return customBlend.name.trim().length > 0;
      case 1:
        return customBlend.notes.top.length > 0 && 
               customBlend.notes.middle.length > 0 && 
               customBlend.notes.base.length > 0;
      default:
        return true;
    }
  };

  const handleAddToCart = async () => {
    if (!canProceed()) return;
    // Require login (token in localStorage)
    const token = getToken();
    if (!token) {
      alert('Please login to save your customization.');
      return;
    }
    const payload: CreateCustomizationPayload = {
      name: customBlend.name,
      notes: {
        top: customBlend.notes.top.map(n => ({ id: n.id, name: n.name, category: 'top', intensity: n.intensity, price: n.price })),
        middle: customBlend.notes.middle.map(n => ({ id: n.id, name: n.name, category: 'middle', intensity: n.intensity, price: n.price })),
        base: customBlend.notes.base.map(n => ({ id: n.id, name: n.name, category: 'base', intensity: n.intensity, price: n.price })),
      },
      concentration: customBlend.concentration,
      bottleSize: customBlend.bottleSize,
      totalPrice: customBlend.totalPrice,
    };
    try {
      setSaving(true);
      await createCustomization(payload);
      alert('Customization saved!');
    } catch (e: any) {
      console.error('Failed to save customization', e);
      alert(e?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <step.icon className="w-6 h-6" />
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-4 ${
                    index < currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Name Your Perfume */}
              {currentStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Give Your Perfume a Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Enter a unique name for your custom perfume"
                      value={customBlend.name}
                      onChange={(e) => setCustomBlend(prev => ({ ...prev, name: e.target.value }))}
                      className="text-lg p-4"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Choose a name that reflects your personality and style
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Step 1: Select Notes */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Build Your Fragrance Pyramid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="top" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="top">Top Notes</TabsTrigger>
                        <TabsTrigger value="middle">Middle Notes</TabsTrigger>
                        <TabsTrigger value="base">Base Notes</TabsTrigger>
                      </TabsList>
                      
                      {(['top', 'middle', 'base'] as const).map((category) => (
                        <TabsContent key={category} value={category} className="mt-4">
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2 capitalize">
                              {category} Notes ({customBlend.notes[category].length}/3)
                            </h4>
                            <p className="text-sm text-gray-600">
                              {category === 'top' && 'First impression - fresh and light (lasts 15-30 minutes)'}
                              {category === 'middle' && 'Heart of the fragrance - main character (lasts 2-4 hours)'}
                              {category === 'base' && 'Foundation - deep and lasting (lasts 6+ hours)'}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableNotes
                              .filter(note => note.category === category)
                              .map((note) => {
                                const isSelected = customBlend.notes[category].find(n => n.id === note.id);
                                const canAdd = customBlend.notes[category].length < 3;
                                
                                return (
                                  <motion.div
                                    key={note.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <Card
                                      className={`cursor-pointer transition-all duration-200 ${
                                        isSelected
                                          ? 'ring-2 ring-purple-500 bg-purple-50'
                                          : canAdd
                                          ? 'hover:shadow-md'
                                          : 'opacity-50 cursor-not-allowed'
                                      }`}
                                      onClick={() => {
                                        if (isSelected) {
                                          removeNote(note.id, category);
                                        } else if (canAdd) {
                                          addNote(note);
                                        }
                                      }}
                                    >
                                      <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                          <h5 className="font-semibold">{note.name}</h5>
                                          <Badge variant="outline">
                                            {formatPrice(note.price)}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                          {note.description}
                                        </p>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs text-gray-500">Intensity:</span>
                                          <div className="flex space-x-1">
                                            {[...Array(10)].map((_, i) => (
                                              <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full ${
                                                  i < note.intensity ? 'bg-purple-500' : 'bg-gray-300'
                                                }`}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                );
                              })}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Choose Concentration */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Concentration Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {concentrations.map((conc) => (
                        <motion.div
                          key={conc.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-200 ${
                              customBlend.concentration === conc.value
                                ? 'ring-2 ring-purple-500 bg-purple-50'
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => setCustomBlend(prev => ({ ...prev, concentration: conc.value }))}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h5 className="font-semibold">{conc.label}</h5>
                                  <p className="text-sm text-gray-600">
                                    {conc.value === 15 && 'Light and fresh, perfect for daily wear'}
                                    {conc.value === 20 && 'Balanced intensity, suitable for most occasions'}
                                    {conc.value === 25 && 'Rich and long-lasting, for special moments'}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  +{Math.round((conc.multiplier - 1) * 100)}%
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Select Bottle Size */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Your Bottle Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {bottleSizes.map((bottle) => (
                        <motion.div
                          key={bottle.size}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-200 text-center ${
                              customBlend.bottleSize === bottle.size
                                ? 'ring-2 ring-purple-500 bg-purple-50'
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => setCustomBlend(prev => ({ ...prev, bottleSize: bottle.size }))}
                          >
                            <CardContent className="p-6">
                              <div className="w-16 h-20 mx-auto mb-4 bg-gradient-to-b from-purple-200 to-purple-400 rounded-t-full rounded-b-lg"></div>
                              <h5 className="font-semibold mb-2">{bottle.label}</h5>
                              <Badge variant="outline">
                                {bottle.multiplier === 1 ? 'Standard Price' : `${bottle.multiplier}x Price`}
                              </Badge>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Next
              </Button>
            ) : (
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={!canProceed() || saving}
                onClick={handleAddToCart}
              >
                {saving ? 'Saving...' : `Add to Cart - ${formatPrice(customBlend.totalPrice)}`}
              </Button>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Your Custom Perfume</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 3D Bottle Preview */}
              <div className="text-center mb-6">
                <motion.div
                  className="w-24 h-32 mx-auto bg-gradient-to-b from-purple-200 to-purple-400 rounded-t-full rounded-b-lg shadow-xl"
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-6 h-6 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full relative top-2"></div>
                </motion.div>
                <h4 className="font-semibold mt-4">
                  {customBlend.name || 'Your Custom Perfume'}
                </h4>
                <p className="text-sm text-gray-600">
                  {customBlend.bottleSize}ml - {concentrations.find(c => c.value === customBlend.concentration)?.label.split(' ')[0]}
                </p>
              </div>

              {/* Selected Notes */}
              <div className="space-y-4 mb-6">
                {(['top', 'middle', 'base'] as const).map((category) => (
                  <div key={category}>
                    <h5 className="font-semibold capitalize mb-2">{category} Notes</h5>
                    <div className="space-y-1">
                      {customBlend.notes[category].length > 0 ? (
                        customBlend.notes[category].map((note) => (
                          <div key={note.id} className="flex justify-between items-center text-sm">
                            <span>{note.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {formatPrice(note.price)}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No notes selected</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>{formatPrice(500)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notes</span>
                    <span>
                      {formatPrice([
                        ...customBlend.notes.top,
                        ...customBlend.notes.middle,
                        ...customBlend.notes.base
                      ].reduce((sum, note) => sum + note.price, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Concentration</span>
                    <span>
                      {concentrations.find(c => c.value === customBlend.concentration)?.multiplier}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bottle Size</span>
                    <span>
                      {bottleSizes.find(s => s.size === customBlend.bottleSize)?.multiplier}x
                    </span>
                  </div>
                </div>
                <div className="border-t mt-2 pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-purple-600">
                      {formatPrice(customBlend.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerfumeCustomizer;