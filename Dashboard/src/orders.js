import { useEffect, useState } from "react";


export const ORDERS = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch("api/orders");

            if (response.ok) {
                const result = await response.json();
                setOrders(result.data);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "فشل في جلب الطلبات.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCopyPhoneNumber = (phoneNumber) => {
        navigator.clipboard.writeText(phoneNumber)
            .then(() => {
                alert("رقم الهاتف تم نسخه إلى الحافظة!");
            })
            .catch(err => {
                console.error("فشل نسخ رقم الهاتف:", err);
            });
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
                <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
                    لوحة تحكم إدارة الطلبات
                </h1>


                <div className="p-6 rounded-2xl shadow-md">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <svg
                                className="animate-spin h-12 w-12 text-gray-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <p className="ml-3 text-gray-700">جاري تحميل الطلبات...</p>
                        </div>
                    ) : error ? (
                        <p className="text-red-600 text-center">{error}</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <div
                                        key={order.productID}
                                        className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                                        onClick={() => handleCopyPhoneNumber(order.accPhone)} // Copy phone number on card click
                                    >
                                        <div className="flex flex-col justify-between h-full">
                                            <div>
                                                <h3 className="text-xl font-bold text-blue-600 mb-2">
                                                    {order.name}
                                                </h3>
                                                <p className="text-gray-600 mb-1">
                                                    <span className="font-semibold">القسم:</span> {order.department}
                                                </p>
                                                <p className="text-gray-600 mb-4">
                                                    <span className="font-semibold">السعر:</span> ${order.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="border-t pt-2 mt-4 text-sm text-gray-600">
                                                <p><span className="font-semibold">اسم الحساب:</span> {order.accName}</p>
                                                <p><span className="font-semibold">هاتف الحساب:</span> {order.accPhone}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 col-span-full">
                                    لم يتم العثور على طلبات.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
