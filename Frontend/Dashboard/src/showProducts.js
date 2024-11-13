import { useEffect, useState } from "react";

export const SHOW = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deptData, setDeptData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [specifiedItem, setSpecifiedItem] = useState(null);

  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  const fetchProducts = async () => {
    try {
      const response = await fetch("api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
      });

      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData.data);
        setLoading(false);
      } else {
        setError("Failed to fetch products. Try again later.");
        setLoading(false);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const fetchSpecificProduct = async (id) => {
    try {
      const response = await fetch(`api/products/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
      });

      if (response.ok) {
        const getData = await response.json();
        setSpecifiedItem(getData.data);
        setShowDetails(true);
        setEditedData(getData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token here
        },
      });

      if (response.ok) {
        fetchProducts(); // Refresh the product list after deletion
      } else {
        setError("Failed to delete product.");
      }
    } catch (error) {
      setError("Error deleting product.");
    }
  };

  const editProduct = async () => {
    console.log(editedData);
    try {
      const res = await fetch(`api/products`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
        method: "PUT",
        body: JSON.stringify(editedData),
      });

      if (res.ok) {
        console.log("The product was edited!");
        setShowDetails(false);
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Store token in localStorage
        console.log("Token stored:", data.token);
        fetchDepartments();
      } else {
        const errorData = await response.json();
        setError(`Login failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      setError("Error during login: " + error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogin("admin", "password"); // Replace with real credentials for testing
    } else {
      fetchDepartments();
    }
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("api/departments", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token here
        },
      });

      if (response.ok) {
        const result = await response.json();
        setDeptData(result); // Assuming the response is an array
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDepartments();
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-lg text-gray-700">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!showDetails ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data && data.length > 0 ? (
              data.map((item) => (
                <div
                  className="relative bg-white shadow-lg rounded-lg p-4 transform hover:scale-105 transition duration-300 cursor-pointer"
                  key={item.id}
                  onClick={() => fetchSpecificProduct(item.id)}
                >
                  <div className="relative mb-4">
                    <img
                      src={`api${item.image.slice(1)}`}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <div
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full text-xs font-bold cursor-pointer hover:bg-red-600 transition duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(item.id);
                      }}
                    >
                      حذف
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="text-lg font-bold text-gray-800 truncate">{item.name}</h2>
                    <p className="text-xl text-green-600 font-semibold mt-2">${item.price}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-3">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">{item.department}</p>
                  </div>
                </div>
              ))
            ) : (
              <h1 className="text-xl text-gray-600">No Products Available.</h1>
            )}
          </div>
        ) : (
          <h1 className="text-xl text-gray-600"></h1>
        )}
      </div>

      {showDetails && specifiedItem && (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">تعديل الاعلان</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">:الاسم</label>
              <input
                type="text"
                className="w-full border border-gray-300 p-3 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-300"
                value={editedData.name}
                onChange={(event) =>
                  setEditedData((prevData) => ({ ...prevData, name: event.target.value }))
                }
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">:الوصف</label>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-300 resize-none"
                value={editedData.description}
                onChange={(event) =>
                  setEditedData((prevData) => ({ ...prevData, description: event.target.value }))
                }
                placeholder="Enter product description"
                rows="3"
              />
            </div>

            <select
              id="department"
              name="department"
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
              onChange={(e) => setEditedData((prev) => ({ ...prev, department: e.target.value }))}
              value={editedData.department}
            >
            
              {deptData.data.length > 0 &&
                deptData.data.map((department, index) => (
                  <option key={index} value={department.name}>
                    {department.name}
                  </option>
                ))}
            </select>

            <div>
              <label className="block text-gray-700 font-medium mb-2">:السعر</label>
              <input
                type="text"
                className="w-full border border-gray-300 p-3 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-300"
                value={editedData.price}
                onChange={(event) =>
                  setEditedData((prevData) => ({ ...prevData, price: event.target.value }))
                }
                placeholder="Enter product price"
              />
            </div>

  
            <div className="flex justify-between">
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  editProduct();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-300"
              >
                حفظ
              </button>

              <button
              
                onClick={() => setShowDetails(false)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition duration-300"
              >
                رجوع
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
