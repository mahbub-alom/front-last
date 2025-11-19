"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";

const languages = ["en", "es", "fr", "it", "pt"] as const;
type Language = (typeof languages)[number];

type LocalizedStrings = {
  [key in Language]?: string;
};

interface VariationItem {
  discountBadge: string;
  adultPrice: number;
  fullPrice: number;
  childPrice: number;
  image: string;
  routes: string[];
  durationBadge: LocalizedStrings;
  title: LocalizedStrings;
  features: LocalizedStrings;
  specialOffer: LocalizedStrings;
}

interface PackageFormValues {
  adultPrice: number;
  fullPrice: number;
  rating: number;
  reviews: number;
  availableSlots: number;
  imageUrl: string;
  gallery: string;
  title: LocalizedStrings;
  subTitle: LocalizedStrings;
  secondPageTitle: LocalizedStrings;
  secondPageDescription: LocalizedStrings;
  included: LocalizedStrings;
  features: LocalizedStrings;
  variations: VariationItem[];
}

export default function EditPackage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<PackageFormValues | null>(null);

  const { register, handleSubmit, reset, control } = useForm<PackageFormValues>(
    {
      defaultValues: {
        adultPrice: 0,
        fullPrice: 0,
        rating: 0,
        reviews: 0,
        availableSlots: 0,
        imageUrl: "",
        gallery: "",
        title: {},
        subTitle: {},
        secondPageTitle: {},
        secondPageDescription: {},
        included: {},
        features: {},
        variations: [],
      },
    }
  );

  const {
    fields: variations,
    append: addVariation,
    remove: removeVariation,
  } = useFieldArray<PackageFormValues, "variations", "id">({
    control,
    name: "variations",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();
        if (data?.data) {
          setTicket(data.data);
          reset(data.data);
        } else {
          toast.error("Package not found");
        }
      } catch {
        toast.error("Failed to load package");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, reset]);

  const onSubmit: SubmitHandler<PackageFormValues> = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Package updated successfully!");
      router.push("/admin/dashboard");
    } catch {
      toast.error("Error updating package");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="bg-[#F1F1F1] py-8 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-gray-200 mb-8 rounded-xl h-96 animate-pulse"></div>
          <div className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
        </div>
      </div>
    );

  if (!ticket) return <p>Package not found.</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <header className="bg-gradient-to-r from-[#134B42] to-[#1a6b5f] py-6 text-white">
        <div className="flex justify-between items-center mx-auto px-4 container">
          <Button
            variant="ghost"
            className="hover:bg-white/10 mr-4 text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            back-to-package
          </Button>
          {/* <p className="font-bold">{t("checkout")}</p> */}
        </div>
      </header>
      <motion.div
        className="mx-auto p-8 max-w-6xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-8 font-bold text-[#740e27] text-3xl">
          ✨ Edit Package — {ticket.title.en}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ===== GENERAL INFO ===== */}
          <Card className="border border-emerald-200 shadow-sm">
            <CardHeader className="pb-2">
              <h2 className="font-semibold text-xl text-[#134B42] flex items-center gap-2">
                📦 General Information
              </h2>
              <p className="text-sm text-gray-500">
                Set basic package details, pricing and availability.
              </p>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Adult Price */}
              <div className="space-y-1">
                <label className="font-medium text-gray-700">
                  Adult Price (€)
                </label>
                <input
                  type="number"
                  {...register("adultPrice")}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Full Price */}
              <div className="space-y-1">
                <label className="font-medium text-gray-700">
                  Full Price (€)
                </label>
                <input
                  type="number"
                  {...register("fullPrice")}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <label className="font-medium text-gray-700">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("rating")}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Reviews */}
              <div className="space-y-1">
                <label className="font-medium text-gray-700">
                  Reviews Count
                </label>
                <input
                  type="number"
                  {...register("reviews")}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* NEW FIELD — Available Slots */}
              <div className="space-y-1 md:col-span-2">
                <label className="font-medium text-gray-700">
                  Available Slots
                </label>
                <input
                  type="number"
                  {...register("availableSlots")}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-emerald-400"
                  placeholder="Example: 120"
                />
                <p className="text-xs text-gray-500">
                  Total number of seats available for booking. Automatically
                  decreases with each booking.
                </p>
              </div>

              {/* Image URL */}
              <div className="space-y-1 md:col-span-2">
                <label className="font-medium text-gray-700">
                  Main Image URL
                </label>
                <input
                  {...register("imageUrl")}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-emerald-400"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Gallery URLs */}
              <div className="space-y-1 md:col-span-2">
                <label className="font-medium text-gray-700">
                  Gallery URLs (comma separated)
                </label>
                <textarea
                  {...register("gallery")}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-emerald-400"
                  rows={3}
                  placeholder="https://img1.jpg, https://img2.jpg"
                />
              </div>
            </CardContent>
          </Card>

          {/* ===== MULTI-LANGUAGE CONTENT ===== */}
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 mb-4">
              {languages.map((lang) => (
                <TabsTrigger key={lang} value={lang}>
                  {lang.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>

            {languages.map((lang) => (
              <TabsContent key={lang} value={lang}>
                <Card className="mb-6">
                  <CardHeader>
                    <h2 className="font-semibold text-lg">
                      🌐 {lang.toUpperCase()} Content
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label>Title</label>
                      <input
                        {...register(`title.${lang}`)}
                        className="p-2 border rounded w-full"
                      />
                    </div>
                    <div>
                      <label>Subtitle</label>
                      <input
                        {...register(`subTitle.${lang}`)}
                        className="p-2 border rounded w-full"
                      />
                    </div>
                    <div>
                      <label>Second Page Title</label>
                      <input
                        {...register(`secondPageTitle.${lang}`)}
                        className="p-2 border rounded w-full"
                      />
                    </div>
                    <div>
                      <label>Second Page Description</label>
                      <textarea
                        {...register(`secondPageDescription.${lang}`)}
                        className="p-2 border rounded w-full"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label>Included</label>
                      <textarea
                        {...register(`included.${lang}`)}
                        className="p-2 border rounded w-full"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label>Features</label>
                      <textarea
                        {...register(`features.${lang}`)}
                        className="p-2 border rounded w-full"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* ===== VARIATIONS ===== */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">🎟 Variations</h2>
              <Button
                type="button"
                onClick={() =>
                  addVariation({
                    discountBadge: "",
                    adultPrice: 0,
                    fullPrice: 0,
                    childPrice: 0,
                    image: "",
                    routes: [],
                    durationBadge: {},
                    title: {},
                    features: {},
                    specialOffer: {},
                  })
                }
              >
                + Add Variation
              </Button>
            </CardHeader>
            <CardContent>
              {variations.map((v, i) => (
                <div
                  key={v.id}
                  className="relative bg-gray-50 mb-4 p-4 border rounded-lg"
                >
                  <button
                    type="button"
                    onClick={() => removeVariation(i)}
                    className="top-2 right-2 absolute font-bold text-red-500"
                  >
                    ✕
                  </button>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                    <input
                      {...register(`variations.${i}.discountBadge`)}
                      placeholder="Discount Badge"
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
                      {...register(`variations.${i}.adultPrice`)}
                      placeholder="Adult Price"
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
                      {...register(`variations.${i}.childPrice`)}
                      placeholder="Child Price"
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="mt-3">
                    <input
                      {...register(`variations.${i}.image`)}
                      placeholder="Image URL"
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div className="mt-3">
                    <textarea
                      {...register(`variations.${i}.routes`)}
                      placeholder="Routes (comma separated)"
                      className="p-2 border rounded w-full"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ===== SUBMIT ===== */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className={`group relative flex justify-center items-center 
                        bg-gradient-to-r from-amber-500 hover:from-amber-400 to-pink-600 hover:to-pink-500 
                        shadow-lg hover:shadow-xl py-4 rounded-2xl w-1/3 overflow-hidden font-medium text-white 
                        transition-all duration-500`}
            >
              {/* Gradient Overlay */}
              <div className="-z-10 absolute inset-0 bg-gradient-to-r from-amber-400 to-violet-500 opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-500"></div>

              {/* Moving dots */}
              <div className="absolute inset-0 opacity-10">
                <div className="top-2 left-4 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:translate-x-20 duration-1000"></div>
                <div className="top-4 right-6 absolute bg-white rounded-full w-1 h-1 transition-transform group-hover:-translate-x-20 duration-700"></div>
              </div>

              <span className="z-10 relative flex justify-center items-center text-sm tracking-wide">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Updating...
                  </>
                ) : (
                  <>Update</>
                )}
                <ArrowRight className="ml-3 w-4 h-4 group-hover:scale-110 transition-transform group-hover:translate-x-2 duration-300" />
              </span>
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
