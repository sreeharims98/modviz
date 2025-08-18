"use client";

import { createClient } from "@/utils/supabase/client";
// import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { useEffect, useMemo, useState } from "react";

type Scene = {
  id: string;
  model_url: string;
  hdri_url: string;
  created_at: string;
};

export default function Page() {
  const [items, setItems] = useState<Scene[]>([]);
  const [modelUrl, setModelUrl] = useState("");
  const [hdriUrl, setHdriUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from("scene")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    setItems(data || []);
    console.log(data, "data");
    setLoading(false);
  }

  async function onCreate() {
    if (!modelUrl || !hdriUrl) return alert("Both fields required");
    const { error } = await supabase.from("scene").insert({
      model_url: modelUrl,
      hdri_url: hdriUrl,
    });
    if (error) {
      alert(error.message);
      return;
    }
    setModelUrl("");
    setHdriUrl("");
    fetchItems();
  }

  async function saveEdit(id: string, next: Partial<Scene>) {
    const { error } = await supabase.from("scene").update(next).eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    setEditingId(null);
    fetchItems();
  }

  async function remove(id: string) {
    if (!confirm("Delete this row?")) return;
    const { error } = await supabase.from("scene").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    fetchItems();
  }

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.model_url.toLowerCase().includes(q) ||
        it.hdri_url.toLowerCase().includes(q)
    );
  }, [items, filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="mb-6 text-2xl font-semibold">Scenes CRUD (Supabase)</h1>

        {/* Create */}
        <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Create new</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                model_url
              </label>
              <input
                value={modelUrl}
                onChange={(e) => setModelUrl(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                hdri_url
              </label>
              <input
                value={hdriUrl}
                onChange={(e) => setHdriUrl(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={onCreate}
              className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Add
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-3 flex flex-col sm:flex-row gap-3 justify-between">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search..."
            className="w-full sm:max-w-xs rounded-xl border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            onClick={fetchItems}
            className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
          >
            Refresh
          </button>
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">model_url</th>
                <th className="px-4 py-3">hdri_url</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No data
                  </td>
                </tr>
              ) : (
                filtered.map((it) => (
                  <Row
                    key={it.id}
                    item={it}
                    editing={editingId === it.id}
                    onEdit={() => setEditingId(it.id)}
                    onCancel={() => setEditingId(null)}
                    onDelete={() => remove(it.id)}
                    onSave={(next) => saveEdit(it.id, next)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({
  item,
  editing,
  onEdit,
  onCancel,
  onDelete,
  onSave,
}: {
  item: Scene;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onSave: (next: Partial<Scene>) => void;
}) {
  const [m, setM] = useState(item.model_url);
  const [h, setH] = useState(item.hdri_url);

  useEffect(() => {
    if (editing) {
      setM(item.model_url);
      setH(item.hdri_url);
    }
  }, [editing, item]);

  return (
    <tr className="border-t">
      <td className="px-4 py-3">
        {editing ? (
          <input
            value={m}
            onChange={(e) => setM(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm"
          />
        ) : (
          <a
            href={item.model_url}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            {item.model_url}
          </a>
        )}
      </td>
      <td className="px-4 py-3">
        {editing ? (
          <input
            value={h}
            onChange={(e) => setH(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm"
          />
        ) : (
          <a
            href={item.hdri_url}
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            {item.hdri_url}
          </a>
        )}
      </td>
      <td className="px-4 py-3 text-gray-500">
        {new Date(item.created_at).toLocaleString()}
      </td>
      <td className="px-4 py-3 text-right">
        {editing ? (
          <>
            <button
              onClick={() => onSave({ model_url: m, hdri_url: h })}
              className="mr-2 rounded-lg bg-black px-3 py-1.5 text-xs text-white"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onEdit}
              className="mr-2 rounded-lg border border-gray-300 px-3 py-1.5 text-xs"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
