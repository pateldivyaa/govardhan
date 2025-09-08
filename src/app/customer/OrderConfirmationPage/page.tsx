"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, AlertTriangle } from "lucide-react";
import { useAppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";

const OTP_TTL_SECONDS = 10 * 60;

const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

type CartItem = {
    id: string;
    _id?: string;
    name: { english: string } | string;
    price: number;
    quantity: number;
    image?: string;
};

export default function OrderConfirmationPage() {
    const { cart, clearCart } = useAppContext(); // Assuming you have clearCart function
    const router = useRouter();

    const [customerName, setCustomerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [includeTax, setIncludeTax] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpCountdown, setOtpCountdown] = useState(0);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [generatedOTP, setGeneratedOTP] = useState<string>("");

    const subtotal = cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
    const tax = includeTax ? subtotal * 0.1 : 0;
    const total = subtotal + tax;

    const otpIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (cart.length === 0) {
            toast.error("Your cart is empty. Please add items to order.");
            router.push("/customer/menu");
        }
        document.title = "Confirm Order - Govardhan Thal";
        return () => {
            if (otpIntervalRef.current) window.clearInterval(otpIntervalRef.current);
        };
    }, [cart, router]);

    useEffect(() => {
        if (showOTPModal && otpCountdown > 0) {
            if (otpIntervalRef.current) window.clearInterval(otpIntervalRef.current);
            otpIntervalRef.current = window.setInterval(() => {
                setOtpCountdown((prev) => {
                    if (prev <= 1) {
                        if (otpIntervalRef.current) {
                            window.clearInterval(otpIntervalRef.current);
                            otpIntervalRef.current = null;
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (!showOTPModal && otpIntervalRef.current) {
                window.clearInterval(otpIntervalRef.current);
                otpIntervalRef.current = null;
            }
        };
    }, [showOTPModal, otpCountdown]);

    const getItemName = (item: CartItem): string => (typeof item.name === "string" ? item.name : item.name.english);

    const postOrderRequest = async () => {
        const items = cart.map((item) => ({
            item: item._id ?? item.id,
            name: getItemName(item),
            price: item.price,
            quantity: item.quantity,
        }));

        const payload = { 
            customerName, 
            mobile: phoneNumber, 
            tableNumber, 
            items, 
            subtotal, 
            tax, 
            total, 
            includeTax 
        };

        try {
            setIsSubmitting(true);
            const res = await fetch("/api/guest/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData?.message || "Unable to create order");
            }

            const data = await res.json();
            const returnedOrderId = data?.orderId;
            const demoOTP = data?.otp; // Get OTP from response

            if (!returnedOrderId) throw new Error("No orderId returned from server");

            setGeneratedOTP(demoOTP);
            setOrderId(returnedOrderId);
            setShowOTPModal(true);
            setOtp("");
            setOtpCountdown(OTP_TTL_SECONDS);
            
            // Show OTP in toast message
            toast.success(`Order created! Your OTP is: ${demoOTP}`, {
                autoClose: 15000, // Show for 15 seconds
                position: "top-center",
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    backgroundColor: '#f0f9ff',
                    color: '#0369a1',
                    border: '2px solid #0ea5e9'
                }
            });
            
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Server error while creating order");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return toast.error("Cannot place an empty order");
        if (!customerName.trim() || !phoneNumber.trim() || !tableNumber.trim())
            return toast.error("Please fill in all fields");
        await postOrderRequest();
    };

    const handleOTPVerification = async () => {
        if (!orderId) return toast.error("No order to verify");
        if (otp.length !== 6) return toast.error("Enter a 6-digit OTP");

        try {
            setIsVerifying(true);
            const res = await fetch("/api/guest/order/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, otp }),
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData?.message || "OTP verification failed");
            }

            toast.success("Order confirmed successfully! Your order is now being processed.");
            setShowOTPModal(false);
            
            // Clear cart after successful order
            if (clearCart) {
                clearCart();
            }
            
            // Redirect with success message
            setTimeout(() => {
                router.push("/customer/menu");
            }, 2000);
            
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "OTP verification failed");
        } finally {
            setIsVerifying(false);
        }
    };

    const resendOTP = async () => {
        if (!orderId) return postOrderRequest();

        setIsResending(true);
        try {
            const res = await fetch("/api/guest/order/resend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });
            
            if (res.ok) {
                const data = await res.json();
                const newOTP = data?.otp;
                
                if (newOTP) {
                    setGeneratedOTP(newOTP);
                    
                    toast.success(`New OTP sent! Your OTP is: ${newOTP}`, {
                        autoClose: 15000,
                        position: "top-center",
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                            backgroundColor: '#f0f9ff',
                            color: '#0369a1',
                            border: '2px solid #0ea5e9'
                        }
                    });
                    setOtpCountdown(OTP_TTL_SECONDS);
                    setOtp("");
                    return;
                }
            }
            
            const errorData = await res.json();
            throw new Error(errorData?.message || "Failed to resend OTP");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Failed to resend OTP");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="bg-orange-50 min-h-screen py-12">
            <div className="container-custom">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-orange-600 p-6 text-white">
                        <h1 className="text-2xl font-bold">Confirm Your Order</h1>
                        <p className="mt-2 opacity-90">Please fill in your details to place your order</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label
                                        htmlFor="customerName"
                                        className="block text-gray-700 font-medium mb-2"
                                    >
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="customerName"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Enter your name"
                                        required
                                        disabled={isSubmitting || showOTPModal}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phoneNumber"
                                        className="block text-gray-700 font-medium mb-2"
                                    >
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Enter your phone number"
                                        required
                                        disabled={isSubmitting || showOTPModal}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="tableNumber"
                                        className="block text-gray-700 font-medium mb-2"
                                    >
                                        Table Number *
                                    </label>
                                    <input
                                        type="text"
                                        id="tableNumber"
                                        value={tableNumber}
                                        onChange={(e) => setTableNumber(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Enter your table number"
                                        required
                                        disabled={isSubmitting || showOTPModal}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-b border-gray-200 py-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                {cart.length === 0 ? (
                                    <div className="text-center py-6 flex flex-col items-center">
                                        <AlertTriangle size={32} className="text-orange-400 mb-2" />
                                        <p className="text-gray-500">Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.map((item: CartItem) => (
                                            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    {item.image && (
                                                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                                            <img src={item.image} alt={getItemName(item)} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-800">{getItemName(item)}</p>
                                                        <p className="text-sm text-gray-500">Quantity: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-orange-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="flex items-center gap-2 text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={includeTax}
                                            onChange={(e) => setIncludeTax(e.target.checked)}
                                            className="rounded text-orange-600 focus:ring-orange-500"
                                            disabled={isSubmitting || showOTPModal}
                                        />
                                        Include Tax (10%):
                                    </label>
                                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="text-lg font-semibold">Total Amount:</span>
                                    <span className="text-2xl font-bold text-orange-600">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/customer/menu')}
                                    className="py-3 px-6 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50 transition-colors"
                                    disabled={isSubmitting || showOTPModal}
                                >
                                    Back to Menu
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || cart.length === 0}
                                    className={`py-3 px-6 rounded-md text-white font-semibold flex items-center justify-center gap-2
                    ${(isSubmitting || cart.length === 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} transition-colors`}
                                >
                                    <ShoppingBag size={20} />
                                    <span>{isSubmitting ? 'Creating Order...' : 'Confirm Order'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {showOTPModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Order</h2>
                        <p className="text-gray-600 mb-4">
                            Enter the 6-digit OTP shown in the message above to confirm your order.
                        </p>
                        {generatedOTP && (
                            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
                                <p className="text-sm text-blue-800 text-center">
                                    <strong>Your OTP:</strong> <span className="text-xl font-mono bg-blue-100 px-2 py-1 rounded">{generatedOTP}</span>
                                </p>
                                <p className="text-xs text-blue-600 mt-2 text-center">
                                    (Demo mode - no SMS sent)
                                </p>
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="otp" className="block text-gray-700 font-medium mb-2">Enter OTP Code</label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center text-2xl tracking-widest font-mono"
                                placeholder="000000"
                                maxLength={6}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                aria-label="OTP code"
                                disabled={isVerifying}
                            />
                            {otpCountdown > 0 ? (
                                <p className="text-sm text-gray-500 mt-2 text-center">OTP expires in: <span className="font-mono">{formatTime(otpCountdown)}</span></p>
                            ) : (
                                <p className="text-sm text-red-500 mt-2 text-center">OTP expired. Please request a new one.</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleOTPVerification} 
                                disabled={isVerifying || otp.length !== 6} 
                                className={`w-full py-3 rounded-md text-white font-semibold ${(isVerifying || otp.length !== 6) ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} transition-colors`}
                            >
                                {isVerifying ? 'Verifying...' : 'Confirm Order'}
                            </button>
                            <button 
                                onClick={resendOTP} 
                                disabled={isResending || otpCountdown > 0} 
                                className={`w-full py-2 rounded-md font-semibold ${isResending || otpCountdown > 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                            >
                                {isResending ? 'Sending New OTP...' : otpCountdown > 0 ? `Resend OTP (${formatTime(otpCountdown)})` : 'Resend OTP'}
                            </button>
                            <button 
                                onClick={() => setShowOTPModal(false)} 
                                className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors" 
                                disabled={isVerifying}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}