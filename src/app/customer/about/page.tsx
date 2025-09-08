
import { MapPin, Phone, Clock, Mail, Utensils, Award, Users, ThumbsUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Govardhan Thal",
  description: "Discover the story behind Govardhan Thal - Authentic Gujarati Restaurant in Singapore",
};

export default function AboutPage() {
  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/delicious-food-table_23-2150857814.jpg?ga=GA1.1.1086018748.1736231792&semt=ais_hybrid&w=740')",
        }}
      >
        <div className="absolute inset-0 bg-opacity-50"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">About Us</h1>
          <p className="text-lg text-yellow-300 mb-4 gujarati-font">અમારા વિશે</p>
          <p className="text-white">Discover the story behind Govardhan Thal</p>
        </div>
      </div>

      <div className="container-custom pt-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-center text-sm text-yellow-800">
          Please note: The images displayed alongside our menu items are for illustration and reference purposes only.
          Actual dishes may vary in appearance. We appreciate your understanding. Thank you!
        </div>
      </div>

      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2">
                <Image
                  src="https://img.freepik.com/premium-photo/indian-hindu-veg-thali-food-platter-selective-focus_466689-36037.jpg?ga=GA1.1.1086018748.1736231792&semt=ais_hybrid&w=740"
                  alt="Restaurant Founder"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>

              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Govardhan Thal began as a humble dream in 1990 moved from kadi, Gujarat situated in India to the
                  Singapore. Bringing generations-old recipes and a passion for authentic Gujarati cuisine, they
                  established what has now become one of the most beloved Gujarati restaurants in the area.
                </p>
                <p className="text-gray-700 mb-4">
                  The name "Govardhan" is inspired by the sacred Govardhan hill in India, symbolizing abundance and
                  nourishment - values we bring to every plate we serve.
                </p>
                <p className="text-gray-700">
                  Our mission is simple: to provide an authentic taste of Gujarat through carefully crafted dishes made
                  with traditional methods and the finest ingredients, creating a dining experience that transports you
                  directly to the heart of Gujarat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Makes Us Special</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-orange-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Authentic Recipes</h3>
              <p className="text-gray-600">
                Our recipes have been passed down through generations, preserving the authentic flavors of Gujarat.
              </p>
            </div>

            <div className="text-center p-6 border border-orange-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quality Ingredients</h3>
              <p className="text-gray-600">
                We use only the freshest, highest-quality ingredients to ensure every dish meets our high standards.
              </p>
            </div>

            <div className="text-center p-6 border border-orange-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Family Atmosphere</h3>
              <p className="text-gray-600">
                We treat every guest like family, offering warm hospitality and a welcoming dining environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
              <div className="md:w-1/2">
                <Image
                  src="https://images.pexels.com/photos/3771120/pexels-photo-3771120.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Chef"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>

              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Chef</h2>
                <p className="text-gray-700 mb-4">
                  Chef Priya Patel brings over 25 years of culinary expertise to Govardhan Thal. Born and raised in
                  Gujarat, she learned the art of traditional cooking from her grandmother, mastering the subtle balance
                  of spices that defines Gujarati cuisine.
                </p>
                <p className="text-gray-700 mb-4">
                  "Every dish tells a story of our culture and heritage. When you dine with us, you're not just eating
                  food; you're experiencing generations of tradition."
                </p>
                <p className="text-gray-700 italic">- Chef Priya Patel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-orange-100">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The authentic Gujarati thali took me back to my childhood in Gujarat. The flavors were perfect, and the service was excellent.",
                name: "Maya Patel",
              },
              {
                text: "Undhiyu here is simply outstanding! The special Govardhan thali offers amazing variety and unlimited servings. Best Gujarati food in town.",
                name: "Rajesh Kumar",
              },
              {
                text: "My first time trying Gujarati cuisine, and I'm hooked! The staff was so helpful explaining each dish, and the flavors were incredible. The Kesar Lassi is a must-try!",
                name: "Sarah Johnson",
              },
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <ThumbsUp size={20} className="text-yellow-500 mr-2" />
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">"{review.text}"</p>
                <p className="font-semibold">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Visit Us</h2>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 space-y-6">
                <div className="flex items-start">
                  <MapPin size={24} className="text-orange-600 mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Address</h3>
                    <p className="text-gray-700">470 Serangoon Road, Singapore 218143</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock size={24} className="text-orange-600 mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
                    <p className="text-gray-700">Every Day: 8 AM to 11 PM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone size={24} className="text-orange-600 mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Phone</h3>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail size={24} className="text-orange-600 mr-4 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                    <p className="text-gray-700">info@govardhanthal.com</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/customer/reservation"
                    className="inline-block py-3 px-6 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Book a Table
                  </Link>
                </div>
              </div>

              <div className="md:w-1/2 h-64 md:h-auto">
                <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Map location would appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
