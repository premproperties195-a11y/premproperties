"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

interface CloudinaryUploadProps {
    onUploadSuccess?: (url: string) => void;
    onUploadMany?: (urls: string[]) => void;
    folder?: string;
    buttonText?: string;
    buttonClass?: string;
    multiple?: boolean;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
}

export default function CloudinaryUpload({
    onUploadSuccess,
    onUploadMany,
    folder = "prem_properties",
    buttonText = "Upload Image",
    buttonClass = "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold",
    multiple = false,
    resourceType = "auto"
}: CloudinaryUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).cloudinary) {
            setScriptLoaded(true);
        }
    }, []);

    const handleUpload = () => {
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
            console.error("Cloudinary Configuration Missing:", {
                cloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                preset: !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
            });
            alert('Cloudinary is not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file.');
            return;
        }

        if (!scriptLoaded || typeof window === 'undefined' || !(window as any).cloudinary) {
            console.error("Cloudinary widget not loaded. scriptLoaded:", scriptLoaded, "window.cloudinary:", !!(window as any)?.cloudinary);
            alert('Upload widget is still loading or failed to load. Please refresh the page and try again.');
            return;
        }

        setUploading(true);
        const uploadedUrls: string[] = [];

        const widget = (window as any).cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                folder: folder,
                sources: ['local', 'url'],
                resourceType: resourceType,
                multiple: multiple,
                maxFiles: multiple ? 10 : 1,
                maxFileSize: 100000000, // 100MB
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'pdf', 'doc', 'docx'],
                cropping: false,
                showSkipCropButton: true,
                styles: {
                    palette: {
                        window: "#FFFFFF",
                        windowBorder: "#90A0B3",
                        tabIcon: "#FFA600",
                        menuIcons: "#5A616A",
                        textDark: "#000000",
                        textLight: "#FFFFFF",
                        link: "#FFA600",
                        action: "#FF620C",
                        inactiveTabIcon: "#0E2F5A",
                        error: "#F44235",
                        inProgress: "#FFA600",
                        complete: "#20B832",
                        sourceBg: "#E4EBF1"
                    }
                }
            },
            (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    const url = result.info.secure_url;
                    if (multiple) {
                        uploadedUrls.push(url);
                    } else {
                        if (onUploadSuccess) onUploadSuccess(url);
                        setUploading(false);
                        widget.close();
                    }
                }

                if (result && result.event === "queue-end" && multiple) {
                    if (onUploadMany) {
                        onUploadMany(uploadedUrls);
                    } else if (onUploadSuccess) {
                        uploadedUrls.forEach(url => onUploadSuccess(url));
                    }
                    setUploading(false);
                    widget.close();
                }

                if (error || (result && result.event === "close" && !uploading)) {
                    if (error) {
                        console.error("Upload error:", error);
                        setUploading(false);
                    }
                    if (result && result.event === "close") {
                        setUploading(false);
                    }
                }
            }
        );

        widget.open();
    };

    return (
        <>
            <Script
                src="https://upload-widget.cloudinary.com/global/all.js"
                strategy="afterInteractive"
                onLoad={() => setScriptLoaded(true)}
            />
            <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className={buttonClass + (uploading ? " opacity-50 cursor-not-allowed" : "")}
                title={!scriptLoaded ? "Loading upload widget..." : ""}
            >
                {uploading ? "Uploading..." : !scriptLoaded ? "Initializing..." : buttonText}
            </button>
        </>
    );
}
