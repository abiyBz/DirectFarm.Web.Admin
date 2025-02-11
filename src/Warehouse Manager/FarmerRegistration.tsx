import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FarmerRegistration: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("managerLoggedIn");
    if (!loginStatus) {
      navigate("/WarehouseLogin"); // Redirect if not logged in
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: null as string | null, // Initialize email as null
    phone: "+251", // Set default value with country code
    location: "",
    status: "active", // Default status is 'active'
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    location: "",
  });

  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Ethiopian phone number regex
  const ethiopianPhoneRegex = /^(?:\+251|251)?[1-9]\d{8}$/;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // If the email input is empty, set it to null
    if (name === "email" && value.trim() === "") {
      setFormData({ ...formData, email: null });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Real-time validation for phone number
    if (name === "phone") {
      const phone = value;
      if (!ethiopianPhoneRegex.test(phone)) {
        setPhoneError("Invalid Ethiopian phone number");
      } else {
        setPhoneError(null); // Clear error if valid
      }
    }
  };

  const validateForm = () => {
    const newErrors = { name: "", phone: "", location: "" };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.phone || formData.phone.length <= 4) {
      newErrors.phone = "Phone number must include digits after +251";
      isValid = false;
    } else if (phoneError) {
      newErrors.phone = phoneError; // Use real-time error message
      isValid = false;
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final check before submission
    if (!validateForm()) {
      setError("Fill in the fields correctly");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5122/api/Farmer/SaveFarmer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.isFailed) {
        setError(data.message || "Registration failed.");
        alert(data.message || error);
        return;
      }

      alert("Farmer Registered");

      // Optionally reset form data after successful registration
      setFormData({
        name: "",
        email: null, // Reset to null
        phone: "+251", // Reset to default value with country code
        location: "",
        status: "active",
      });

      setErrors({ name: "", phone: "", location: "" }); // Clear errors
      setPhoneError(null); // Clear phone error
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 text-black">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Farmer Registration
      </h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-8 py-4 rounded-lg font-medium border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            placeholder="Enter name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email (optional) */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">
            Email (optional)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""} // Set value to an empty string if email is null
            onChange={handleChange}
            className="w-full px-8 py-4 rounded-lg font-medium border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            placeholder="Enter email"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-8 py-4 rounded-lg font-medium border ${
              phoneError ? "border-red-500" : "border-gray-200"
            } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
            placeholder="Enter Ethiopian phone number"
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
          )}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-8 py-4 rounded-lg font-medium border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-lg font-semibold">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-8 py-4 rounded-lg font-medium border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Register Farmer
        </button>
      </form>
    </div>
  );
};

export default FarmerRegistration;
