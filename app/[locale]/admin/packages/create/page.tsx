"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const languages = ["en", "es", "fr", "it", "pt"];

export default function CreatePackage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);

    // Build ticket object based on schema
    const ticket: any = {
      title: {},
      subTitle: {},
      secondPageTitle: {},
      secondPageDescription: {},
      included: {},
      features: {},
      adultPrice: parseFloat(formData.get("adultPrice") as string) || 0,
      fullPrice: parseFloat(formData.get("fullPrice") as string) || 0,
      rating: parseFloat(formData.get("rating") as string) || 0,
      reviews: parseInt(formData.get("reviews") as string) || 0,
      imageUrl: formData.get("imageUrl") as string,
      gallery: (formData.get("gallery") as string)?.split(",") || [],
      availableSlots: parseInt(formData.get("availableSlots") as string) || 0,
      itinerary: [],
      variations: [],
    };

    languages.forEach((lang) => {
      ticket.title[lang] = formData.get(`title_${lang}`) as string;
      ticket.subTitle[lang] = formData.get(`subTitle_${lang}`) as string;
      ticket.secondPageTitle[lang] = formData.get(
        `secondPageTitle_${lang}`
      ) as string;
      ticket.secondPageDescription[lang] = formData.get(
        `secondPageDescription_${lang}`
      ) as string;
      ticket.included[lang] = (formData.get(`included_${lang}`) as string)
        ?.split("\n")
        .map((i) => i.trim())
        .filter(Boolean);
      ticket.features[lang] = (formData.get(`features_${lang}`) as string)
        ?.split("\n")
        .map((i) => i.trim())
        .filter(Boolean);
    });

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create ticket");
      }

     toast.success("new package created successfully")
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 max-w-4xl">
      <h1 className="mb-6 font-bold text-2xl">Create New Package</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Adult Price</label>
          <input type="number" name="adultPrice" className="p-2 border w-full" />
        </div>
        <div>
          <label>Full Price</label>
          <input type="number" name="fullPrice" className="p-2 border w-full" />
        </div>
        <div>
          <label>Rating</label>
          <input type="number" step="0.1" name="rating" className="p-2 border w-full" />
        </div>
        <div>
          <label>Reviews</label>
          <input type="number" name="reviews" className="p-2 border w-full" />
        </div>
        <div>
          <label>Image URL</label>
          <input type="text" name="imageUrl" className="p-2 border w-full" />
        </div>
        <div>
          <label>Gallery URLs (comma separated)</label>
          <textarea name="gallery" className="p-2 border w-full" rows={2}></textarea>
        </div>
        <div>
          <label>Available Slots</label>
          <input type="number" name="availableSlots" className="p-2 border w-full" />
        </div>

        {languages.map((lang) => (
          <div key={lang} className="mb-4 p-4 border">
            <h2 className="mb-2 font-bold">Language: {lang.toUpperCase()}</h2>
            <div>
              <label>Title</label>
              <input type="text" name={`title_${lang}`} className="p-2 border w-full" />
            </div>
            <div>
              <label>Subtitle</label>
              <input type="text" name={`subTitle_${lang}`} className="p-2 border w-full" />
            </div>
            <div>
              <label>Second Page Title</label>
              <input type="text" name={`secondPageTitle_${lang}`} className="p-2 border w-full" />
            </div>
            <div>
              <label>Second Page Description</label>
              <textarea name={`secondPageDescription_${lang}`} className="p-2 border w-full" rows={2}></textarea>
            </div>
            <div>
              <label>Included (one per line)</label>
              <textarea name={`included_${lang}`} className="p-2 border w-full" rows={2}></textarea>
            </div>
            <div>
              <label>Features (one per line)</label>
              <textarea name={`features_${lang}`} className="p-2 border w-full" rows={2}></textarea>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 disabled:opacity-50 px-4 py-2 rounded text-white"
        >
          {loading ? "Creating..." : "Create Package"}
        </button>
      </form>
    </div>
  );
}
