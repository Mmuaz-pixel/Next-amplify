"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { useAuth } from "@/providers/UserProvider";

const client = generateClient<Schema>({
  authMode: "userPool",
});

export default function Profile() {
  const { user, loading, refetchUser } = useAuth(); 

  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");

  // Set states only when user is populated
  useEffect(() => {
    if (user) {
      console.log(user);
      setFirstName(user.firstName || "");
      setFamilyName(user.family_name || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    if (user) {
      await client.models.User.update({
        id: user.id,
        firstName,
        family_name: familyName,
      });
      refetchUser(); 
      alert("Profile updated!");
    }
  };

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold">Your Profile</h1>
      <p>Email: {user.email}</p>

      <div className="mt-4">
        <label className="block font-semibold">First Name:</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Last Name:</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
        />
      </div>

      <button
        onClick={handleUpdate}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update Profile
      </button>
    </div>
  );
}
