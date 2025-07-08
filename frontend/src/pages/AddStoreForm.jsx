import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Form.css";

const AddStoreForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        ownerId: ""  // ✅ Changed from owner_id to ownerId
    });

    const [owners, setOwners] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // ✅ Fetch list of owners on component mount
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => setOwners(res.data))
            .catch((err) => {
                console.error("Error fetching owners:", err);
                setError("Failed to load store owners.");
            });
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            await axios.post("http://localhost:5000/api/admin/stores", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(" Store created successfully!");
            setFormData({ name: "", email: "", address: "", ownerId: "" });
        } catch (err) {
            console.error("Error creating store:", err);
            setError(err.response?.data?.message || " Failed to create store.");
        }
    };

    return (
        <div className="form-container">
            <h2>Create New Store</h2>

            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
            {console.log("owner :", owners)}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Store Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Store Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="address"
                    placeholder="Store Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />

                <select
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Select Owner
                    </option>
                    {owners
                        .filter((owner) => owner.role !== "admin") // filter out admins
                        .map((owner) => (
                            <option key={owner.id} value={owner.id}>
                                {owner.name}
                            </option>
                        ))}
                </select>
                <button type="submit"> Add Store</button>
            </form>
        </div>
    );
};

export default AddStoreForm;
