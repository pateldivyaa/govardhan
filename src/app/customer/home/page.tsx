    "use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Utensils, CalendarDays, MapPin, Clock } from "lucide-react";

export default function CustomerHomePage() {
    useEffect(() => {
        document.title = "Govardhan Thal - Authentic Gujarati Cuisine";
    }, []);

    return (
        <div className="flex flex-col">
            <div
                className="relative h-screen bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage:
                        "url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
                    marginTop: "-5rem",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/70 to-transparent"></div>
                <div className="container-custom relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                        Govardhan Thal
                    </h1>
                    <p className="text-xl text-yellow-300 mb-8 gujarati-font">
                        ગોવર્ધન થાળ
                    </p>
                    <p className="text-xl text-white mb-12 max-w-xl mx-auto">
                        Experience the authentic flavors of Gujarat in the heart of Singapore
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/customer/menu"
                            className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 w-64 flex items-center justify-center gap-3"
                        >
                            <Utensils size={20} className="transition-transform group-hover:rotate-12" />
                            <span className="text-xl font-semibold">View Menu</span>
                        </Link>

                        <Link
                            href="/customer/reservation"
                            className="group bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 w-64 flex items-center justify-center gap-3"
                        >
                            <CalendarDays size={20} className="transition-transform group-hover:rotate-12" />
                            <span className="text-xl font-semibold">Reserve Table</span>
                        </Link>
                    </div>
                </div>
            </div>


            <section className="py-16 bg-orange-50">
                <div className="container-custom">
                    <h2 className="text-4xl font-bold text-center mb-12">Our Signature Dishes</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <div className="bg-white rounded-xl shadow-lg group overflow-hidden">
                            <div className="h-60 overflow-hidden">
                                <img
                                    src="https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="Undhiyu"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-semibold">Undhiyu</h3>
                                    <span className="text-orange-600 font-semibold">$12</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 gujarati-font">ઉંધીયું</p>
                                <p className="text-gray-700">
                                    A traditional Gujarati mixed vegetable dish, typically prepared in earthen pots.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg group overflow-hidden">
                            <div className="h-60 overflow-hidden">
                                <img
                                    src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                    alt="Gujarati Thali"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-semibold">Sp. Govardhan Thali</h3>
                                    <span className="text-orange-600 font-semibold">$15</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 gujarati-font">સ્પે. ગોવર્ધન થાળી</p>
                                <p className="text-gray-700">
                                    Our signature unlimited thali with authentic Gujarati dishes including sweets, farsan, and more.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg group overflow-hidden">
                            <div className="h-60 overflow-hidden">
                                <img
                                    src="https://images.pexels.com/photos/4051783/pexels-photo-4051783.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="Kesar Lassi"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-semibold">Kesar Lassi</h3>
                                    <span className="text-orange-600 font-semibold">$15</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 gujarati-font">કેસર લસ્સી</p>
                                <p className="text-gray-700">
                                    Traditional yogurt-based drink flavored with saffron, cardamom, and topped with nuts.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/customer/menu"
                            className="btn btn-primary inline-block"
                        >
                            Explore Full Menu
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
                            <h2 className="text-3xl font-bold mb-4">Visit Us</h2>
                            <div className="flex items-start mb-4">
                                <MapPin className="text-orange-500 mt-1 mr-2" size={20} />
                                <div>
                                    <h3 className="font-semibold">Address</h3>
                                    <p className="text-gray-700">470 Serangoon Road, Singapore 218143</p>
                                </div>
                            </div>
                            <div className="flex items-start mb-8">
                                <Clock className="text-orange-500 mt-1 mr-2" size={20} />
                                <div>
                                    <h3 className="font-semibold">Opening Hours</h3>
                                    <p className="text-gray-700">Every Day: 8 AM to 11 PM</p>
                                </div>
                            </div>

                            <Link
                                href="/customer/reservation"
                                className="btn btn-primary"
                            >
                                Reserve a Table
                            </Link>
                        </div>

                        <div className="w-full md:w-1/2 h-80">
                            <div className="h-full rounded-lg overflow-hidden shadow-lg">
                                <img
                                    src="https://img.freepik.com/premium-photo/indian-hindu-veg-thali-food-platter-selective-focus_466689-36043.jpg?ga=GA1.1.494269051.1747299795&semt=ais_hybrid&w=740"
                                    alt="Restaurant Interior"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-orange-50">
                <div className="container-custom">
                    <h2 className="text-4xl font-bold text-center mb-12">What Our Customers Say</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                                    <span className="text-orange-600 font-bold">M</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold">Maya Patel</h3>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                "The authentic Gujarati thali took me back to my childhood in Gujarat. The flavors were perfect, and the service was excellent. Can't wait to come back!"
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                                    <span className="text-orange-600 font-bold">R</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold">Rajesh Kumar</h3>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                "Undhiyu here is simply outstanding! The special Govardhan thali offers amazing variety and unlimited servings. Best Gujarati food in town."
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                                    <span className="text-orange-600 font-bold">S</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold">Sarah Johnson</h3>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                "My first time trying Gujarati cuisine, and I'm hooked! The staff was so helpful explaining each dish, and the flavors were incredible. The Kesar Lassi is a must-try!"
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
