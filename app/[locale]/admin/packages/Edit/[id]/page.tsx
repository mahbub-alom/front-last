"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

const languages = ["en", "es", "fr", "it", "pt"] as const;
type Language = typeof languages[number];

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

  const { register, handleSubmit, reset, control } = useForm<PackageFormValues>({
    defaultValues: {
      adultPrice: 0,
      fullPrice: 0,
      rating: 0,
      reviews: 0,
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
  });

  const { fields: variations, append: addVariation, remove: removeVariation } =
    useFieldArray<PackageFormValues, "variations", "id">({
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
      <div className="flex justify-center items-center h-80">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );

  if (!ticket) return <p>Package not found.</p>;

  return (
    <motion.div
      className="mx-auto p-8 max-w-6xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="mb-8 font-bold text-blue-700 text-3xl">
        ✨ Edit Package — {ticket.title.en}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* ===== GENERAL INFO ===== */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-xl">General Information</h2>
          </CardHeader>
          <CardContent className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label className="font-medium">Adult Price</label>
              <input type="number" {...register("adultPrice")} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="font-medium">Full Price</label>
              <input type="number" {...register("fullPrice")} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="font-medium">Rating</label>
              <input type="number" step="0.1" {...register("rating")} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="font-medium">Reviews</label>
              <input type="number" {...register("reviews")} className="p-2 border rounded w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Image URL</label>
              <input {...register("imageUrl")} className="p-2 border rounded w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Gallery URLs (comma separated)</label>
              <textarea {...register("gallery")} className="p-2 border rounded w-full" rows={2} />
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
                  <h2 className="font-semibold text-lg">🌐 {lang.toUpperCase()} Content</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label>Title</label>
                    <input {...register(`title.${lang}`)} className="p-2 border rounded w-full" />
                  </div>
                  <div>
                    <label>Subtitle</label>
                    <input {...register(`subTitle.${lang}`)} className="p-2 border rounded w-full" />
                  </div>
                  <div>
                    <label>Second Page Title</label>
                    <input {...register(`secondPageTitle.${lang}`)} className="p-2 border rounded w-full" />
                  </div>
                  <div>
                    <label>Second Page Description</label>
                    <textarea {...register(`secondPageDescription.${lang}`)} className="p-2 border rounded w-full" rows={2} />
                  </div>
                  <div>
                    <label>Included</label>
                    <textarea {...register(`included.${lang}`)} className="p-2 border rounded w-full" rows={2} />
                  </div>
                  <div>
                    <label>Features</label>
                    <textarea {...register(`features.${lang}`)} className="p-2 border rounded w-full" rows={2} />
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
              <div key={v.id} className="relative bg-gray-50 mb-4 p-4 border rounded-lg">
                <button type="button" onClick={() => removeVariation(i)} className="top-2 right-2 absolute font-bold text-red-500">
                  ✕
                </button>
                <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                  <input {...register(`variations.${i}.discountBadge`)} placeholder="Discount Badge" className="p-2 border rounded" />
                  <input type="number" {...register(`variations.${i}.adultPrice`)} placeholder="Adult Price" className="p-2 border rounded" />
                  <input type="number" {...register(`variations.${i}.childPrice`)} placeholder="Child Price" className="p-2 border rounded" />
                </div>
                <div className="mt-3">
                  <input {...register(`variations.${i}.image`)} placeholder="Image URL" className="p-2 border rounded w-full" />
                </div>
                <div className="mt-3">
                  <textarea {...register(`variations.${i}.routes`)} placeholder="Routes (comma separated)" className="p-2 border rounded w-full" rows={2} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ===== SUBMIT ===== */}
        <div className="flex justify-end">
          <Button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white" disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" /> Saving...</> : <><Save /> Save Changes</>}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
