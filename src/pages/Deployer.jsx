import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Dummy user data
const dummyUsers = [
    {
        user_id: "335d7b3b-2d04-4ada-9658-1348f0471e8c",
        personal_information: {
            nationality: "India",
            legal_name: "Ramya A R",
            date_of_birth: "1985-02-02T18:30:00.000Z",
            pan: "ABCDE1234F",
            occupation: "Housewife",
        },
        identification_documents: {
            document_type: "NationalIdentification",
            document_number: "ID1234567890",
        },
        photos: [
            "https://via.placeholder.com/600",
            "https://via.placeholder.com/600/0000FF",
            "https://via.placeholder.com/600/FF0000",
        ],
        is_reviewed: false,
        current_level: "Basic",
    },
    {
        user_id: "12345678-1234-1234-1234-1234567890ab",
        personal_information: {
            nationality: "USA",
            legal_name: "John Doe",
            date_of_birth: "1990-05-15T18:30:00.000Z",
            pan: "XYZ9876543",
            occupation: "Engineer",
        },
        identification_documents: {
            document_type: "NationalIdentification",
            document_number: "ID0987654321",
        },
        photos: [
            "https://via.placeholder.com/600",
            "https://via.placeholder.com/600/00FF00",
            "https://via.placeholder.com/600/FFA500",
        ],
        is_reviewed: true,
        current_level: "Advanced",
    },
];

const KycPage = ({ users, userData }) => {
    const [filterName, setFilterName] = useState("");
    const [filterReviewed, setFilterReviewed] = useState("");

    const handleUpgrade = (userId) => {
        toast.success("User upgraded successfully");
        // Optionally, update the user state to reflect the change
    };

    const handleDowngrade = (userId) => {
        toast.success("User downgraded successfully");
        // Optionally, update the user state to reflect the change
    };

    const handleReject = (userId) => {
        toast.success("User rejected successfully");
        // Optionally, update the user state to reflect the change
    };

    const filteredUsers = users.filter(
        (user) =>
            user?.personal_information?.legal_name
                .toLowerCase()
                .includes(filterName.toLowerCase()) &&
            (filterReviewed === ""
                ? true
                : filterReviewed === "reviewed"
                    ? user.is_reviewed
                    : !user.is_reviewed)
    );

    return (
        <div className="w-[90%] mx-auto py-12 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-white mb-8">KYC Users</h1>
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="p-2 border rounded bg-gray-800 text-white placeholder-gray-500"
                />
                <select
                    value={filterReviewed}
                    onChange={(e) => setFilterReviewed(e.target.value)}
                    className="p-2 border rounded bg-gray-800 text-white"
                >
                    <option value="">All</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="not_reviewed">Not Reviewed</option>
                </select>
            </div>
            <div className="grid gap-6 w-full max-w-4xl">
                {filteredUsers.map((user) => (
                    <div
                        key={user.user_id}
                        className="flex flex-col items-center p-6 border rounded shadow-lg bg-gray-800"
                    >
                        <Carousel
                            showArrows
                            infiniteLoop
                            useKeyboardArrows
                            dynamicHeight
                            showThumbs={false}  // Disable thumbnails
                            className="rounded w-full max-w-2xl mb-6"
                        >
                            {user?.photos?.map((photo, index) => (
                                <div key={index}>
                                    <img
                                        src={photo}
                                        alt={`${user.personal_information.legal_name}'s photo ${index + 1}`}
                                        className="object-cover w-full h-64"
                                    />
                                </div>
                            ))}
                        </Carousel>
                        <div className="text-white text-center">
                            <p className="text-xl font-bold mb-2">
                                {user.personal_information.legal_name}
                            </p>
                            <p className="mb-2">Occupation:  {user.personal_information.occupation}</p>
                            <p className="mb-2">Current Level: {userData?.find((s) => s?.uuid == user?.user_id)?.kyc_level?.toString()}</p>
                            <p className="mb-2">Reviewed: {user.is_reviewed ? "Yes" : "No"}</p>
                            <p className="mb-2">Nationality: {user.personal_information.nationality}</p>
                            <p className="mb-2">
                                Date of Birth: {new Date(user.personal_information.date_of_birth).toLocaleDateString()}
                            </p>
                            {user.identification_documents && <><p className="mb-2">Document Type: {user.identification_documents?.document_type}</p>
                                <p className="mb-2">Document Number: {user.identification_documents?.document_number}</p></>}
                        </div>
                        <div className="flex items-center space-x-4 mt-4">
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleUpgrade(user.user_id)}
                            >
                                Upgrade
                            </Button>
                            <Button
                                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                onClick={() => handleDowngrade(user.user_id)}
                            >
                                Downgrade
                            </Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleReject(user.user_id)}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KycPage;
