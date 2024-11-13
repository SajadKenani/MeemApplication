import { useEffect, useState } from "react";
import "./App.css";

export function ADD() {
  const [data, setData] = useState({
    name: "",
    price: "",
    description: "",
    department: "",
    image: null, // Store the image as a file object
  });

  const [imageURL, setImageURL] = useState(""); // State to store the image URL
  const [deptData, setDeptData] = useState([]); // Ensure deptData is initialized as an array

  // Send product data to the backend with authorization
  const sendData = async (e) => {
    e.preventDefault();

    // Create a FormData object to hold the form data
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("department", data.department);
    formData.append("image", data.image); // Append the image file

    // Retrieve the token from localStorage (assuming it's stored after login)
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: formData, // Send the FormData
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Product added successfully!");
        setImageURL(result.data.image_url); // Set the image URL in state
      } else {
        console.error("Failed to add product", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch department data from the backend with authorization
  const fetchDepartments = async () => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("api/departments", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
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

  // Use useEffect to fetch departments when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      await fetchDepartments();
    };
    fetchData(); // Call the internal async function
  }, []);

  return (
    <div className="add-product-container max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">اضف عرض جديد</h2>
      <form className="add-product-form space-y-5" onSubmit={sendData}>
        <div className="form-group">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">:اسم العرض</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="ادخل اسم العرض"
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
            onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price" className="block text-gray-700 font-medium mb-2">:السعر</label>
          <input
            type="number"
            id="price"
            name="price"
            required
            placeholder="ادخل سعر العرض"
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
            onChange={(e) => setData((prev) => ({ ...prev, price: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">:رفع صورة</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none"
            onChange={(e) => setData((prev) => ({ ...prev, image: e.target.files[0] }))}
          />
        </div>

        {/* Department dropdown */}
        <div className="form-group">
          <label htmlFor="department" className="block text-gray-700 font-medium mb-2">:القسم</label>
          <select
            id="department"
            name="department"
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
            onChange={(e) => setData((prev) => ({ ...prev, department: e.target.value }))}
          >
            <option value="">اختر قسم</option>
            {/* Ensure deptData is an array before mapping */}
            {Array.isArray(deptData.data) &&
              deptData.data.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">:الوصف</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            required
            placeholder="اكتب وصف للاعلان"
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300"
            onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
          ></textarea>
        </div>

        <button type="submit" className="submit-btn w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-300">
          اضافة الاعلان
        </button>
      </form>

      {/* Display the uploaded image */}
      {imageURL && (
        <div className="image-preview mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Uploaded Image:</h3>
          <img src={`http://golang-proxy-server-production.up.railway.app${imageURL}`} alt="Uploaded" className="w-full h-auto rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
}
