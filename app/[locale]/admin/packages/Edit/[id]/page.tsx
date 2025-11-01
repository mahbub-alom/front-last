"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EditPackage() {
  const router = useRouter();
  const params = useParams(); // contains { id }
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tickets/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("data",data)
        setTicket(data.data);
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedTicket = Object.fromEntries(formData.entries());

    const res = await fetch(`/api/tickets/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTicket),
    });

    if (res.ok) router.push("/admin/packages");
  };

  if (loading) return <p>Loading...</p>;
  if (!ticket) return <p>Ticket not found</p>;

  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-2xl">Edit Package</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title (EN)</label>
          <input
            name="title"
            defaultValue={ticket.title.en}
            className="p-2 rounded-lg w-full"
          />
        </div>
        <div>
          <label>Location</label>
          <input
            name="location"
            defaultValue={ticket.location}
            className="p-2 rounded-lg w-full"
          />
        </div>
        <div>
          <label>Price</label>
          <input
            name="price"
            defaultValue={ticket.price}
            type="number"
            className="p-2 rounded-lg w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-[#34D399] px-4 py-2 rounded-lg font-bold text-black"
        >
          Save
        </button>
      </form>
    </div>
  );
}
