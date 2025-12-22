"use client";

import { useState } from "react";
import CloudinaryUpload from "../../components/CloudinaryUpload";

export default function MediaAdmin() {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const handleUploadSuccess = (url: string) => {
        setUploadedImages([url, ...uploadedImages]);
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        alert("URL copied to clipboard!");
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Management</h1>
                <p className="text-gray-600">Upload and manage your images and videos</p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                <h2 className="text-xl font-bold mb-4">Upload Media</h2>
                <p className="text-gray-600 mb-6">
                    Upload images and videos to use throughout your website
                </p>

                <CloudinaryUpload
                    onUploadSuccess={handleUploadSuccess}
                    buttonText="📤 Upload Image/Video"
                    buttonClass="px-6 py-3 bg-[var(--primary)] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-colors"
                />
            </div>

            {/* Recently Uploaded */}
            {uploadedImages.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6">Recently Uploaded</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {uploadedImages.map((url, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <img src={url} alt={`Upload ${index + 1}`} className="w-full h-48 object-cover" />
                                <div className="p-4 bg-gray-50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={url}
                                            readOnly
                                            className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded bg-white"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(url)}
                                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-bold"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">Click copy to use in forms</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Instructions */}
            {uploadedImages.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">📸</div>
                    <h3 className="text-xl font-bold mb-2">No Images Uploaded Yet</h3>
                    <p className="text-gray-600 mb-4">
                        Click "Upload Image/Video" to add media to your Cloudinary storage.
                    </p>
                    <p className="text-sm text-gray-500">
                        Uploaded media will appear here with URLs ready to copy.
                    </p>
                </div>
            )}
        </div>
    );
}
