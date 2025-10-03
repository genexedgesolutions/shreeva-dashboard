// pages/admin/products/variants/[id].js
import { useRouter } from "next/router";
import useSWR from "swr";
import api from "../../../../../lib/api";
import Layout from "../../../../../components/Layout";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  FiPlus, FiTrash2, FiX, FiSave,
  FiChevronUp, FiChevronDown, FiCopy,
} from "react-icons/fi";

/* -------------------- SWR fetcher -------------------- */

/* -------------------- Utils -------------------- */
const uid = () => Math.random().toString(36).slice(2);
const slug = (s) =>
  String(s || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .toUpperCase();

const cartesian = (groups) => {
  if (!groups.length) return [];
  return groups.reduce(
    (acc, g) =>
      acc.flatMap((row) =>
        g.values.map((v) => ({
          ...row,
          [g.name]: v,
        }))
      ),
    [{}]
  );
};

const kvKey = (kv) =>
  JSON.stringify(
    Object.keys(kv)
      .sort()
      .reduce((o, k) => {
        o[k] = kv[k];
        return o;
      }, {})
  );

/* ---- Extract pairs from a variant (prefer optionsArray/options) ---- */
const pairsFromVariant = (v) => {
  if (Array.isArray(v?.optionsArray) && v.optionsArray.length) {
    return v.optionsArray
      .map((p) => ({
        name: String(p?.name || "").trim(),
        value: String(p?.value || "").trim(),
      }))
      .filter((p) => p.name && p.value);
  }
  if (v?.options && typeof v.options === "object") {
    return Object.entries(v.options)
      .map(([name, value]) => ({
        name: String(name || "").trim(),
        value: String(value || "").trim(),
      }))
      .filter((p) => p.name && p.value);
  }
  const out = [];
  if (v?.size) out.push({ name: "size", value: String(v.size) });
  if (v?.karat) out.push({ name: "karat", value: String(v.karat) });
  if (v?.metal) out.push({ name: "metal", value: String(v.metal) });
  if (v?.finish) out.push({ name: "finish", value: String(v.finish) });
  const color =
    v?.attributes?.Color ??
    v?.attributes?.["Color"] ??
    v?.attributes?.["Metal Color"] ??
    v?.metalColor?.selected ??
    (v?.customOptions
      ? Object.entries(v.customOptions).find(([k]) => /color/i.test(k))?.[1]
      : null);
  if (color) out.push({ name: "color", value: String(color) });
  return out;
};

const pairsToKV = (pairs) => {
  const kv = {};
  pairs.forEach(({ name, value }) => {
    kv[String(name)] = String(value);
  });
  return kv;
};

const kvToArray = (kv) =>
  Object.entries(kv).map(([name, value]) => ({ name, value: String(value) }));

/* -------------------- Small UI atoms -------------------- */
const Chip = ({ children, onRemove }) => (
  <div
    className="chip"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "#F3F4F6",
      padding: "4px 8px",
      borderRadius: 999,
      margin: 3,
    }}
  >
    <span>{children}</span>
    {!!onRemove && <FiX style={{ cursor: "pointer" }} onClick={onRemove} />}
  </div>
);

const Text = (p) => (
  <input
    {...p}
    autoComplete="off"
    style={{
      width: "100%",
      border: "1px solid #E5E7EB",
      borderRadius: 8,
      padding: 8,
      ...p.style,
    }}
  />
);

/* -------------------- Page -------------------- */
export default function VariantBuilder() {
  const router = useRouter();
  // normalize id
  const productIdRaw = router.query.id;
  const productId = Array.isArray(productIdRaw) ? productIdRaw[0] : productIdRaw;

  // ---------- DIRECT FETCH STATE ----------
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVariants = async () => {
    if (!productId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/products/${productId}/variants`);
      setData(res?.data ?? res); // support both shapes
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchVariants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);
  const ready = !!productId && (!isLoading) && (!!data || !!error);

  const existing = Array.isArray(data?.variants) ? data.variants : [];
  const variantOptionsFromDB = Array.isArray(data?.variantOptions) ? data.variantOptions : [];
  const hasServerData = existing.length > 0 || variantOptionsFromDB.length > 0;
  const isEdit = hasServerData;

  /* -------------------- Build groups -------------------- */
  const buildGroupsFromVariantOptions = (arr) =>
    (arr || []).map((g) => ({
      id: uid(),
      name: String(g?.name || ""), // keep original casing (e.g., "size","color")
      values: Array.isArray(g?.values)
        ? Array.from(new Set(g.values.map((v) => String(v))))
        : [],
      enabled: true,
    }));

  const buildGroupsFromExisting = (list) => {
    const buckets = new Map(); // name -> Set(values)
    list.forEach((v) => {
      const pairs = pairsFromVariant(v);
      pairs.forEach(({ name, value }) => {
        if (!buckets.has(name)) buckets.set(name, new Set());
        buckets.get(name).add(String(value));
      });
    });
    const names = Array.from(buckets.keys()).sort((a, b) => a.localeCompare(b));
    return names.map((name) => ({
      id: uid(),
      name,
      values: Array.from(buckets.get(name) || []),
      enabled: true,
    }));
  };

  const [groups, setGroups] = useState([]);

  // Seed exactly once AFTER API is ready
  useEffect(() => {
    if (!ready) return;
    setGroups((prev) => {
      if (prev.length) return prev;
      if (hasServerData) {
        return variantOptionsFromDB.length
          ? buildGroupsFromVariantOptions(variantOptionsFromDB)
          : buildGroupsFromExisting(existing);
      }
      return []; // add mode: blank
    });
  }, [ready, hasServerData, existing, variantOptionsFromDB]);

  const addGroup = () =>
    setGroups((g) => [
      ...g,
      { id: uid(), name: "", values: [], enabled: true },
    ]);
  const removeGroup = (id) => setGroups((g) => g.filter((x) => x.id !== id));
  const updateGroup = (id, patch) =>
    setGroups((g) => g.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const moveGroup = (id, dir) =>
    setGroups((g) => {
      const i = g.findIndex((x) => x.id === id);
      if (i < 0) return g;
      const j = dir === "up" ? Math.max(0, i - 1) : Math.min(g.length - 1, i + 1);
      const copy = [...g];
      const [it] = copy.splice(i, 1);
      copy.splice(j, 0, it);
      return copy;
    });

  /* -------------------- Combos -------------------- */
  const activeGroups = useMemo(
    () =>
      groups
        .filter((g) => g.enabled && g.name && g.values.length)
        .map((g) => ({
          name: g.name,
          values: Array.from(new Set(g.values.map((v) => String(v)))),
        })),
    [groups]
  );
  const combos = useMemo(() => cartesian(activeGroups), [activeGroups]);

  /* -------------------- Existing variants index -------------------- */
  const existingByKV = useMemo(() => {
    const map = new Map();
    existing.forEach((v) => {
      const kv = pairsToKV(pairsFromVariant(v));
      map.set(kvKey(kv), v);
    });
    return map;
  }, [existing]);

  /* -------------------- Rows state -------------------- */
  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const lastComboKeysRef = useRef([]);

  useEffect(() => {
    if (!ready) return;

    const comboKeys = combos.map(kvKey);
    const prevKeys = lastComboKeysRef.current;
    const sameSet =
      comboKeys.length === prevKeys.length &&
      comboKeys.every((k, i) => k === prevKeys[i]);

    if (sameSet && rows.length) return;

    const prevByKey = new Map(rows.map((r) => [kvKey(r.kv), r]));

    const next = combos.map((kv, idx) => {
      const key = kvKey(kv);
      const prev = prevByKey.get(key);
      if (prev) return prev;

      const match = existingByKV.get(key);
      if (match) {
        return {
          id: uid(),
          _id: String(match._id),
          kv,
          sku: match.sku || "",
          price: match.price ?? "",
          compareAt: match.compareAtPrice ?? match.attributes?.compareAtPrice ?? "",
          inventory: match.inventory ?? "",
          manageStock: match.manageStock ?? true,
          images: Array.isArray(match.images) ? match.images : [],
          isExisting: true,
          dirty: false,
        };
      }
      const parts = Object.entries(kv).map(([k, v]) => `${slug(k)}-${slug(v)}`);
      return {
        id: uid(),
        kv,
        sku: `SKU-${parts.join("-") || idx}`,
        price: "",
        compareAt: "",
        inventory: "",
        manageStock: true,
        images: [],
        isExisting: false,
        dirty: false,
      };
    });

    lastComboKeysRef.current = comboKeys;
    setRows(next);
    setSelectedIds(new Set());
  }, [ready, combos, existingByKV]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateRow = (id, patch) =>
    setRows((r) =>
      r.map((x) => (x.id === id ? { ...x, ...patch, dirty: true } : x))
    );

  const toggleSelect = (id) =>
    setSelectedIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const selectAll = () => setSelectedIds(new Set(rows.map((r) => r.id)));
  const clearSelection = () => setSelectedIds(new Set());
  const removeSelected = () =>
    setRows((r) => r.filter((x) => !selectedIds.has(x.id)));

  /* -------------------- Image upload (single) -------------------- */
  const firstImage = (arr) => (Array.isArray(arr) && arr.length ? arr[0] : "");
  const handleSingleImageUpload = async (rowId, file, mode = "primary") => {
    if (!file) return;
    try {
      const row = rows.find((r) => r.id === rowId);
      if (!row?._id) {
        toast.info("Save the variant first, then upload image.");
        return;
      }
      const form = new FormData();
      form.append("variantId", row._id);
      // IMPORTANT: match your multer field name
      form.append("file", file);
      if (mode && mode !== "primary") form.append("mode", mode);

      const res = await api.post(
        `/products/${productId}/variants/bulkimage`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const data = res?.data || res;
      const images = data?.images || [];
      setRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, images, dirty: false } : r))
      );
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Image upload failed");
    }
  };

  /* -------------------- Bulk set -------------------- */
  const [bulk, setBulk] = useState({ price: "", compareAt: "", inventory: "" });
  const has = (v) => v !== undefined && v !== null && String(v).trim() !== "";

  const applyBulk = () =>
    setRows((r) =>
      r.map((x) => {
        if (selectedIds.size && !selectedIds.has(x.id)) return x;
        return {
          ...x,
          price: has(bulk.price) ? String(bulk.price).trim() : x.price,
          compareAt: has(bulk.compareAt) ? String(bulk.compareAt).trim() : x.compareAt,
          inventory: has(bulk.inventory) ? String(bulk.inventory).trim() : x.inventory,
          dirty: true,
        };
      })
    );

  /* -------------------- Save (bulk upsert) -------------------- */
  const saveAll = async () => {
    if (!productId) return toast.error("Product not found");

    const dirty = rows.filter(
      (r) => r.dirty && (selectedIds.size ? selectedIds.has(r.id) : true)
    );
    if (!dirty.length) return toast.info("No changes to save.");

    const variantOptions = activeGroups.map((g) => ({
      name: g.name,
      values: g.values,
    }));

    const payload = dirty.map((r) => ({
      _id: r._id,
      sku: r.sku || undefined,
      options: r.kv,
      optionsArray: kvToArray(r.kv),
      price: r.price === "" ? undefined : Number(r.price),
      compareAtPrice: r.compareAt === "" ? undefined : Number(r.compareAt),
      inventory: r.inventory === "" ? undefined : Number(r.inventory),
      manageStock: !!r.manageStock,
    }));

    try {
      const res = await api.post(`/products/${productId}/variants/bulk`, {
        variants: payload,
        variantOptions,
      });
      const d = res?.data || res;
      toast.success(
        `Saved • Created: ${d?.counts?.created ?? 0} • Updated: ${d?.counts?.updated ?? 0}`
      );
      await mutate();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    }
  };

  const syncFromDB = () => {
    if (variantOptionsFromDB.length) {
      setGroups(buildGroupsFromVariantOptions(variantOptionsFromDB));
    } else if (existing.length) {
      setGroups(buildGroupsFromExisting(existing));
    } else {
      setGroups([]);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Layout title="Variants">
      {/* Error banner if fetch failed */}
      {!!error && (
        <div className="card" style={{ padding: 12, marginBottom: 12, color: "#b91c1c", background: "#fee2e2" }}>
          Failed to load variants. {error?.message || ""}
        </div>
      )}

      {!ready ? (
        <div className="card" style={{ padding: 16 }}>Loading variants…</div>
      ) : (
        <>
          {/* Mode banner */}
          <div className="card" style={{ padding: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: "#6B7280" }}>
              Mode: <b>{isEdit ? "Edit existing variants" : "Add new variants"}</b>
            </div>
          </div>

          {/* ---------- VARIANT OPTIONS ---------- */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Variant Options</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className="btn ghost" onClick={syncFromDB}>Sync from DB</button>
                <button type="button" className="btn" onClick={addGroup}>
                  <FiPlus /> Add option
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
              {groups.map((g) => (
                <div key={g.id} className="group">
                  <div className="group-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                      <input
                        value={g.name}
                        placeholder="Option name (e.g., size, color, purity)"
                        onChange={(e) => updateGroup(g.id, { name: e.target.value })}
                        className="input"
                      />
                      <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <input
                          type="checkbox"
                          checked={g.enabled}
                          onChange={(e) => updateGroup(g.id, { enabled: e.target.checked })}
                        />
                        Enable
                      </label>
                    </div>
                    <div className="group-btns">
                      <button type="button" className="icon" title="Move up" onClick={() => moveGroup(g.id, "up")}>
                        <FiChevronUp />
                      </button>
                      <button type="button" className="icon" title="Move down" onClick={() => moveGroup(g.id, "down")}>
                        <FiChevronDown />
                      </button>
                      <button type="button" className="icon danger" title="Remove" onClick={() => removeGroup(g.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  <ValuesEditor
                    values={g.values}
                    onChange={(vals) => updateGroup(g.id, { values: vals })}
                  />
                </div>
              ))}

              {!groups.length && (
                <div style={{ color: "#6B7280" }}>
                  No options yet. Click “Add option” and start with names like <b>size</b>, <b>color</b>, etc.
                </div>
              )}
            </div>
          </div>

          {/* ---------- COMBINATIONS ---------- */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>
                Generated combinations{" "}
                <span style={{ color: "#6B7280", fontWeight: 400 }}>
                  ({rows.length})
                </span>
              </h3>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" className="btn ghost" onClick={selectAll}>Select all</button>
                <button type="button" className="btn ghost" onClick={clearSelection}>Clear selection</button>
                <button type="button" className="btn danger" onClick={removeSelected}>
                  <FiTrash2 /> Delete selected (local)
                </button>
              </div>
            </div>

            {/* Bulk */}
            <div className="bulk">
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600 }}>Bulk set</span>
                <Text
                  type="text"
                  inputMode="numeric"
                  placeholder="Price"
                  value={bulk.price}
                  onChange={(e) => setBulk((b) => ({ ...b, price: e.target.value }))}
                  style={{ width: 120 }}
                />
                <Text
                  type="text"
                  inputMode="numeric"
                  placeholder="Compare at"
                  value={bulk.compareAt}
                  onChange={(e) => setBulk((b) => ({ ...b, compareAt: e.target.value }))}
                  style={{ width: 140 }}
                />
                <Text
                  type="text"
                  inputMode="numeric"
                  placeholder="Inventory"
                  value={bulk.inventory}
                  onChange={(e) => setBulk((b) => ({ ...b, inventory: e.target.value }))}
                  style={{ width: 120 }}
                />
                <button type="button" className="btn" onClick={applyBulk}><FiCopy /> Apply</button>
              </div>
              <div style={{ color: "#6B7280" }}>
                Tip: If you select rows, Bulk Apply updates only selected ones; otherwise it updates all rows.
              </div>
            </div>

            {/* Table */}
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}></th>
                    <th>Combination</th>
                    <th>Image</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Compare at</th>
                    <th>Inventory</th>
                    <th>Manage</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(r.id)}
                          onChange={() => toggleSelect(r.id)}
                        />
                      </td>
                      <td>
                        {Object.entries(r.kv).map(([k, v]) => (
                          <div key={k} style={{ fontSize: 12 }}>
                            <b>{k}</b>: {v}
                          </div>
                        ))}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {firstImage(r.images) ? (
                            <img
                              src={firstImage(r.images)}
                              alt="thumb"
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: "cover",
                                borderRadius: 6,
                                border: "1px solid #e5e7eb",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 6,
                                border: "1px dashed #e5e7eb",
                                display: "grid",
                                placeItems: "center",
                                fontSize: 10,
                                color: "#9CA3AF",
                              }}
                            >
                              No img
                            </div>
                          )}
                          <label
                            className={`btn ghost ${!r._id ? "disabled" : ""}`}
                            style={{
                              padding: "6px 10px",
                              cursor: r._id ? "pointer" : "not-allowed",
                              opacity: r._id ? 1 : 0.6,
                            }}
                            title={r._id ? "Upload image" : "Save variant first"}
                          >
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              disabled={!r._id}
                              onChange={(e) =>
                                r._id && handleSingleImageUpload(r.id, e.target.files?.[0])
                              }
                            />
                          </label>
                        </div>
                      </td>
                      <td>
                        <Text
                          value={r.sku}
                          onChange={(e) => updateRow(r.id, { sku: e.target.value })}
                        />
                      </td>
                      <td>
                        <Text
                          type="text"
                          inputMode="numeric"
                          value={r.price}
                          onChange={(e) => updateRow(r.id, { price: e.target.value })}
                        />
                      </td>
                      <td>
                        <Text
                          type="text"
                          inputMode="numeric"
                          value={r.compareAt}
                          onChange={(e) => updateRow(r.id, { compareAt: e.target.value })}
                        />
                      </td>
                      <td>
                        <Text
                          type="text"
                          inputMode="numeric"
                          value={r.inventory}
                          onChange={(e) => updateRow(r.id, { inventory: e.target.value })}
                        />
                      </td>
                      <td>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <input
                            type="checkbox"
                            checked={!!r.manageStock}
                            onChange={(e) => updateRow(r.id, { manageStock: e.target.checked })}
                          />
                          Stock
                        </label>
                      </td>
                      <td style={{ fontSize: 12 }}>
                        {r.isExisting ? (
                          r.dirty ? (
                            <span style={{ color: "#b45309" }}>existing • edited</span>
                          ) : (
                            "existing"
                          )
                        ) : r.dirty ? (
                          <span style={{ color: "#2563eb" }}>new • edited</span>
                        ) : (
                          "new"
                        )}
                      </td>
                    </tr>
                  ))}
                  {!rows.length && (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", color: "#6B7280", padding: 20 }}>
                        Turn on at least one option group with values to generate combinations.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ color: "#6B7280" }}>
                Variants in DB: <b>{existing.length}</b>
              </div>
              <button type="button" className="btn" onClick={saveAll}>
                <FiSave /> Save all changes
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .card {
          padding: 16px;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
          margin-bottom: 16px;
        }
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px;
        }
        .group {
          border: 1px dashed #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          background: #fcfcfd;
        }
        .group-header {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 8px;
        }
        .group-btns { display: flex; gap: 6px; }
        .icon {
          border: 1px solid #e5e7eb;
          background: #fff;
          padding: 6px 8px;
          border-radius: 8px;
          cursor: pointer;
        }
        .icon.danger { color: #b91c1c; }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          border: none;
          background: #111827;
          color: #fff;
          cursor: pointer;
        }
        .btn.ghost { background: #eef2ff; color: #111827; }
        .btn.danger { background: #fee2e2; color: #991b1b; }
        .btn.ghost.disabled { pointer-events: none; }
        .bulk {
          display: grid;
          gap: 8px;
          margin: 12px 0;
          padding: 10px;
          border-radius: 10px;
          background: #f9fafb;
        }
        .table-wrap { overflow: auto; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td {
          text-align: left;
          padding: 8px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
      `}</style>
    </Layout>
  );
}

/* -------------------- Values editor (comma chips) -------------------- */
function ValuesEditor({ values, onChange }) {
  const [input, setInput] = useState("");
  const add = (v) => {
    const clean = String(v || "").trim();
    if (!clean) return;
    if (!values.includes(clean)) onChange([...values, clean]);
  };
  const remove = (v) => onChange(values.filter((x) => x !== v));
  const addFromInput = () => {
    input
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach(add);
    setInput("");
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="input"
          placeholder="Add values (comma to add multiple)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFromInput();
            }
          }}
        />
        <button type="button" className="btn" onClick={addFromInput}>
          <FiPlus /> Add
        </button>
      </div>
      <div style={{ marginTop: 8 }}>
        {values.map((v) => (
          <Chip key={v} onRemove={() => remove(v)}>
            {v}
          </Chip>
        ))}
      </div>
    </div>
  );
}
