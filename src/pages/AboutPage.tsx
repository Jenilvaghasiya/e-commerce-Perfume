import React from 'react';
import { Award, Users, Leaf, Heart, Star, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  const team = [
    {
      name: 'Elena Rodriguez',
      role: 'Master Perfumer',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      bio: 'With over 15 years of experience in luxury fragrance creation, Elena leads our scent development team.'
    },
    {
      name: 'Marcus Chen',
      role: 'Creative Director',
      image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
      bio: 'Marcus brings innovative design and brand vision to create unforgettable fragrance experiences.'
    },
    {
      name: 'Sarah Johnson',
      role: 'Fragrance Consultant',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      bio: 'Sarah helps customers discover their perfect scent through personalized consultations and expertise.'
    },
    {
      name: 'David Park',
      role: 'Quality Assurance',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      bio: 'David ensures every bottle meets our highest quality standards before reaching our customers.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Story</h1>
            <p className="text-xl md:text-2xl">
              Crafting unique fragrances that capture the essence of individuality
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Ignite Perfume, we believe that fragrance is the most intimate form of self-expression. 
                Our mission is to create exceptional, personalized scents that tell your unique story and 
                ignite your confidence.
              </p>
              <p className="text-lg text-gray-600">
                Founded in 2020 by a team of passionate perfumers and fragrance enthusiasts, we combine 
                traditional craftsmanship with modern innovation to deliver luxury fragrances that are 
                both timeless and contemporary.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg"
                alt="Perfume creation process"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center group hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600">
                We're committed to using only the finest ingredients and maintaining the highest standards in every aspect of our work.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center group hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Passion</h3>
              <p className="text-gray-600">
                Our love for fragrance drives us to create scents that evoke emotions and create lasting memories.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center group hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We're dedicated to ethical sourcing and environmentally responsible practices in all our operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The talented individuals behind every fragrance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12" />
              </div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg">Happy Customers</div>
            </div>

            <div>
              <div className="flex justify-center mb-4">
                <Heart className="w-12 h-12" />
              </div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg">Custom Fragrances</div>
            </div>

            <div>
              <div className="flex justify-center mb-4">
                <Star className="w-12 h-12" />
              </div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-lg">Average Rating</div>
            </div>

            <div>
              <div className="flex justify-center mb-4">
                <Globe className="w-12 h-12" />
              </div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visit Our Studio</h2>
            <p className="text-xl text-gray-600">Experience our fragrances in person</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">New York Flagship Store</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-gray-600">123 Fragrance Street, New York, NY 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Hours</p>
                    <p className="text-gray-600">Monday - Saturday: 10 AM - 8 PM</p>
                    <p className="text-gray-600">Sunday: 12 PM - 6 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Services</p>
                    <p className="text-gray-600">• Personal fragrance consultations</p>
                    <p className="text-gray-600">• Custom perfume creation sessions</p>
                    <p className="text-gray-600">• Scent layering workshops</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 text-lg">Interactive map would be here</p>
                <p className="text-gray-500">123 Fragrance Street, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;