"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/../amplify/data/resource";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";

const client = generateClient<Schema>();

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const currentUser = await getCurrentUser();
        const userAttributes = await fetchUserAttributes();
        const email = userAttributes.email;

        if (currentUser) {
          // ✅ Check if user exists using email (not id)
          const {data: userData} = await client.models.User.list({
            filter: { email: { eq: email } },
          });

          console.log(userData); 

          if (userData.length > 0) {
            setUser(userData[0]);
            setFirstName(userData[0].firstName || "");
            setFamilyName(userData[0].family_name || "");
            setEmail(email || "");
          } else {
            // ✅ Create user if not found
            const newUser = await client.models.User.create({
              email: email || '',
              firstName: "",
              family_name: "",
              owner: currentUser.userId,
            });
            console.log(newUser)
            setUser(newUser);
            setEmail(email || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    if (user) {
      await client.models.User.update({
        id: user.id,
        firstName,
        family_name: familyName,
      });
      alert("Profile updated!");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold">Your Profile</h1>
      <p>Email: {email}</p>

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
