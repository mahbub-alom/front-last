"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { motion } from "framer-motion";

const languages = ["en", "es", "fr", "it", "pt"];

export default function CreatePackage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: {},
      subTitle: {},
      secondPageTitle: {},
      secondPageDescription: {},
      included: {},
      features: {},
      itinerary: [{ day: 1, title: {}, description: {} }],
      variations: [
        {
          discountBadge: "",
          durationBadge: {},
          title: {},
          adultPrice: 0,
          fullPrice: 0,
          childPrice: 0,
          specialOffer: {},
          features: {},
          image: "",
          routes: [""],
        },
      ],
    },
  });

  const { fields: itineraryFields, append: addItinerary, remove: removeItinerary } =
    useFieldArray({ control, name: "itinerary" });

  const { fields: variationFields, append: addVariation, remove: removeVariation } =
    useFieldArray({ control, name: "variations" });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create ticket");
      toast.success("🎉 Package created successfully!");
      reset();
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto p-8 max-w-5xl"
    >
      <h1 className="bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 font-extrabold text-transparent text-3xl text-center">
        ✈️ Create New Travel Package
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white shadow-xl p-8 border border-gray-100 rounded-2xl"
      >
        {/* ===== BASIC INFO ===== */}
        <section>
          <h2 className="mb-4 pl-2 border-blue-600 border-l-4 font-semibold text-xl">
            Basic Info
          </h2>
          <div className="gap-4 grid grid-cols-2">
            <input {...register("adultPrice")} placeholder="Adult Price" className="input" type="number" />
            <input {...register("fullPrice")} placeholder="Full Price" className="input" type="number" />
            <input {...register("rating")} placeholder="Rating" className="input" type="number" step="0.1" />
            <input {...register("reviews")} placeholder="Reviews" className="input" type="number" />
            <input {...register("availableSlots")} placeholder="Available Slots" className="input" type="number" />
            <input {...register("imageUrl")} placeholder="Main Image URL" className="input" />
          </div>
          <textarea {...register("gallery")} placeholder="Gallery URLs (comma separated)" className="mt-4 input" rows={2}></textarea>
        </section>

        {/* ===== MULTI-LANGUAGE CONTENT ===== */}
        <section>
          <h2 className="mb-4 pl-2 border-green-600 border-l-4 font-semibold text-xl">
            Multi-language Content
          </h2>
          {languages.map((lang) => (
            <div key={lang} className="bg-gray-50 hover:bg-gray-100 mb-4 p-4 border rounded-xl transition">
              <h3 className="mb-2 font-semibold text-gray-700 uppercase">{lang}</h3>
              <div className="gap-3 grid grid-cols-2">
                <input {...register(`title.${lang}`)} placeholder="Title" className="input" />
                <input {...register(`subTitle.${lang}`)} placeholder="Subtitle" className="input" />
                <input {...register(`secondPageTitle.${lang}`)} placeholder="Second Page Title" className="input" />
              </div>
              <textarea {...register(`secondPageDescription.${lang}`)} placeholder="Second Page Description" className="mt-2 input" rows={2}></textarea>
              <textarea {...register(`included.${lang}`)} placeholder="Included (one per line)" className="mt-2 input" rows={2}></textarea>
              <textarea {...register(`features.${lang}`)} placeholder="Features (one per line)" className="mt-2 input" rows={2}></textarea>
            </div>
          ))}
        </section>

        {/* ===== ITINERARY ===== */}
        <section>
          <h2 className="mb-4 pl-2 border-purple-600 border-l-4 font-semibold text-xl">
            Itinerary
          </h2>
          {itineraryFields.map((item, index) => (
            <div key={item.id} className="bg-gray-50 mb-3 p-4 border rounded-xl">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium text-gray-700">Day {index + 1}</h3>
                <button type="button" onClick={() => removeItinerary(index)} className="text-red-500 text-sm hover:underline">
                  Remove
                </button>
              </div>
              <input {...register(`itinerary.${index}.day`)} placeholder="Day number" className="mb-2 input" />
              {languages.map((lang) => (
                <div key={lang} className="gap-2 grid grid-cols-2">
                  <input {...register(`itinerary.${index}.title.${lang}`)} placeholder={`Title (${lang})`} className="input" />
                  <textarea {...register(`itinerary.${index}.description.${lang}`)} placeholder={`Description (${lang})`} className="input"></textarea>
                </div>
              ))}
            </div>
          ))}
          <button type="button" onClick={() => addItinerary({ day: "", title: {}, description: {} })} className="btn-secondary">
            ➕ Add Day
          </button>
        </section>

        {/* ===== VARIATIONS ===== */}
        <section>
          <h2 className="mb-4 pl-2 border-yellow-500 border-l-4 font-semibold text-xl">
            Variations
          </h2>
          {variationFields.map((item, index) => (
            <div key={item.id} className="bg-gray-50 mb-3 p-4 border rounded-xl">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium text-gray-700">Variation {index + 1}</h3>
                <button type="button" onClick={() => removeVariation(index)} className="text-red-500 text-sm hover:underline">
                  Remove
                </button>
              </div>

              {/* Basic Info */}
              <div className="gap-2 grid grid-cols-2 mb-3">
                <input {...register(`variations.${index}.discountBadge`)} placeholder="Discount Badge" className="input" />
                <input {...register(`variations.${index}.image`)} placeholder="Image URL" className="input" />
                <input {...register(`variations.${index}.adultPrice`)} placeholder="Adult Price" type="number" className="input" />
                <input {...register(`variations.${index}.fullPrice`)} placeholder="Full Price" type="number" className="input" />
                <input {...register(`variations.${index}.childPrice`)} placeholder="Child Price" type="number" className="input" />
              </div>

              {/* Routes */}
              <textarea {...register(`variations.${index}.routes`)} placeholder="Routes (comma separated)" className="mb-3 input" rows={2}></textarea>

              {/* MultiLang fields for Variation */}
              {languages.map((lang) => (
                <div key={lang} className="mb-3 pt-2 border-t">
                  <h4 className="mb-1 font-semibold text-gray-600 text-sm uppercase">{lang}</h4>
                  <input {...register(`variations.${index}.durationBadge.${lang}`)} placeholder={`Duration Badge (${lang})`} className="input" />
                  <input {...register(`variations.${index}.title.${lang}`)} placeholder={`Title (${lang})`} className="mt-1 input" />
                  <textarea {...register(`variations.${index}.specialOffer.${lang}`)} placeholder={`Special Offer (${lang})`} className="mt-1 input" rows={2}></textarea>
                  <textarea {...register(`variations.${index}.features.${lang}`)} placeholder={`Features (${lang})`} className="mt-1 input" rows={2}></textarea>
                </div>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addVariation({
                discountBadge: "",
                durationBadge: {},
                title: {},
                adultPrice: 0,
                fullPrice: 0,
                childPrice: 0,
                specialOffer: {},
                features: {},
                image: "",
                routes: [""],
              })
            }
            className="btn-secondary"
          >
            ➕ Add Variation
          </button>
        </section>

        {/* ===== SUBMIT ===== */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 shadow px-6 py-3 rounded-xl font-semibold text-white transition"
          >
            {loading ? "Creating..." : "🚀 Create Package"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
