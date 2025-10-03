// pages/admin/coupons/index.js
import useSWR from "swr";
import api from "../../../lib/api";
import Layout from "../../../components/Layout";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  FiPlus, FiTrash2, FiEdit2, FiSave, FiX,
  FiRefreshCw, FiSearch, FiCheckCircle,
} from "react-icons/fi";

/* -------------------- fetcher (robust) -------------------- */
// Works whether api.get returns axios response or response.data directly
const fetcher = async (url) => {
  const res = await api.get(url);
  // If res looks like axios response { data: {...} }, return res.data
  if (res && typeof res === "object" && "data" in res && res.data) return res.data;
  // Else res is already the JSON body
  return res;
};

/* -------------------- helpers -------------------- */
const emptyForm = {
  code: "", title: "", description: "",
  startDate: "", expireDate: "",
  discountType: "flat",
  discountValue: "",
  couponCategory: "general",
  pid: "", cid: "",
  minOrderValue: "", maxDiscount: "",
  maxUsage: 25, isActive: true,
};

const toISOInput = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
};
const fromISOInput = (s) => (s ? new Date(s).toISOString() : "");

/* -------------------- main page -------------------- */
export default function Coupons() {
  const { data, error, mutate, isValidating } = useSWR("/coupon/all", fetcher, {
    revalidateOnFocus: false,
  });

  // Optional debug:
  // console.log("coupons API data =", data);

  // Handle both shapes: {success, coupons} OR {data:{success,coupons}}
  const coupons = data?.coupons ?? data?.data?.coupons ?? [];

  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search) return coupons;
    const q = search.toLowerCase();
    return coupons.filter(
      (c) =>
        c?.code?.toLowerCase().includes(q) ||
        c?.title?.toLowerCase().includes(q) ||
        c?.couponCategory?.toLowerCase().includes(q)
    );
  }, [coupons, search]);

  // form state
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // load one coupon for edit
  const loadForEdit = async (id) => {
    try {
      const res = await api.get(`/coupon/${id}`);
      const body = res?.data ?? res;
      const c = body?.coupon;
      if (!c) return toast.error("Coupon not found");
      setEditingId(id);
      setForm({
        code: c.code || "",
        title: c.title || "",
        description: c.description || "",
        startDate: toISOInput(c.startDate),
        expireDate: toISOInput(c.expireDate),
        discountType: c.discountType || "flat",
        discountValue: c.discountValue ?? "",
        couponCategory: c.couponCategory || "general",
        pid: c.pid || "",
        cid: c.cid || "",
        minOrderValue: c.minOrderValue ?? "",
        maxDiscount: c.maxDiscount ?? "",
        maxUsage: c.maxUsage ?? 25,
        isActive: !!c.isActive,
      });
      setShowForm(true);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load coupon");
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: String(form.code || "").trim().toUpperCase(),
        title: String(form.title || "").trim(),
        description: String(form.description || "").trim(),
        startDate: fromISOInput(form.startDate),
        expireDate: fromISOInput(form.expireDate),
        discountType: form.discountType,
        discountValue: Number(form.discountValue ?? 0),
        couponCategory: form.couponCategory,
        pid: form.couponCategory === "productBased" && form.pid ? form.pid : undefined,
        cid: form.couponCategory === "categoryBased" && form.cid ? form.cid : undefined,
        minOrderValue: form.minOrderValue === "" ? 0 : Number(form.minOrderValue),
        maxDiscount:
          form.discountType === "percentage" && form.maxDiscount !== ""
            ? Number(form.maxDiscount)
            : undefined,
        maxUsage:
          form.maxUsage === "" || form.maxUsage == null ? 25 : Number(form.maxUsage),
        isActive: !!form.isActive,
      };

      if (!editingId) {
        await api.post("/coupon/create", payload);
        toast.success("Coupon created");
      } else {
        await api.put(`/coupon/${editingId}`, payload);
        toast.success("Coupon updated");
      }

      await mutate();
      setShowForm(false);
      resetForm();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await api.delete(`/coupon/${id}`);
      toast.success("Deleted");
      await mutate();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  const [applyCode, setApplyCode] = useState("");
  const [applyResult, setApplyResult] = useState(null);
  const testApply = async () => {
    setApplyResult(null);
    if (!applyCode.trim()) return;
    try {
      const res = await api.post("/coupon/apply", { code: applyCode.trim().toUpperCase() });
      const body = res?.data ?? res;
      setApplyResult(body);
      if (body?.success) toast.success(body?.message || "Coupon applied!");
      else toast.error(body?.message || "Failed");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Apply failed");
    }
  };

  return (
    <Layout title="Coupons">
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0 }}>Coupon Codes</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn ghost" type="button" onClick={() => mutate()}>
              <FiRefreshCw /> Refresh {isValidating ? "…" : ""}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <FiPlus /> New Coupon
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <input
                className="input"
                placeholder="Search code / title / category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FiSearch style={{ position: "absolute", right: 10, top: 10, color: "#9CA3AF" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                className="input"
                style={{ width: 220 }}
                placeholder="Test apply code (e.g. SAVE10)"
                value={applyCode}
                onChange={(e) => setApplyCode(e.target.value)}
              />
              <button className="btn ghost" type="button" onClick={testApply}>
                <FiCheckCircle /> Apply
              </button>
            </div>
          </div>
          {applyResult && (
            <div style={{ fontSize: 13, color: applyResult.success ? "#065f46" : "#991b1b" }}>
              {applyResult.message}{" "}
              {applyResult.discount != null ? `• discount: ${applyResult.discount}` : ""}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ color: "#6B7280", marginBottom: 8 }}>
          Total: <b>{filtered.length}</b> {isValidating ? "• loading…" : ""}
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Type</th>
                <th>Value</th>
                <th>Category</th>
                <th>Active</th>
                <th>Validity</th>
                <th>Usage</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td><b>{c.code}</b></td>
                  <td>{c.title}</td>
                  <td>{c.discountType}</td>
                  <td>
                    {c.discountType === "percentage"
                      ? `${c.discountValue}%${c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ""}`
                      : `₹${c.discountValue}`}
                  </td>
                  <td>{c.couponCategory}</td>
                  <td>{c.isActive ? "Yes" : "No"}</td>
                  <td style={{ fontSize: 12 }}>
                    {new Date(c.startDate).toLocaleString()} → {new Date(c.expireDate).toLocaleString()}
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {c.usageCount ?? 0} / {c.maxUsage ?? 25}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="icon" title="Edit" onClick={() => loadForEdit(c._id)}>
                        <FiEdit2 />
                      </button>
                      <button className="icon danger" title="Delete" onClick={() => onDelete(c._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", color: "#6B7280", padding: 16 }}>
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="drawer">
          <div className="drawer-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{editingId ? "Edit coupon" : "New coupon"}</h3>
              <button className="icon" onClick={() => { setShowForm(false); }}>
                <FiX />
              </button>
            </div>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
              <div className="grid2">
                <div>
                  <label className="lbl">Code</label>
                  <input
                    className="input"
                    placeholder="SAVE10"
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="lbl">Title</label>
                  <input
                    className="input"
                    placeholder="Festive Offer"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="lbl">Description</label>
                <textarea
                  className="input"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="grid2">
                <div>
                  <label className="lbl">Start date</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="lbl">Expire date</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={form.expireDate}
                    onChange={(e) => setForm((f) => ({ ...f, expireDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid2">
                <div>
                  <label className="lbl">Discount type</label>
                  <select
                    className="input"
                    value={form.discountType}
                    onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))}
                  >
                    <option value="flat">Flat</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="lbl">
                    {form.discountType === "percentage" ? "Discount (%)" : "Discount (₹)"}
                  </label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {form.discountType === "percentage" && (
                <div>
                  <label className="lbl">Max discount (₹) — optional</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={form.maxDiscount}
                    onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))}
                  />
                </div>
              )}

              <div className="grid2">
                <div>
                  <label className="lbl">Coupon category</label>
                  <select
                    className="input"
                    value={form.couponCategory}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        couponCategory: e.target.value,
                        pid: e.target.value === "productBased" ? f.pid : "",
                        cid: e.target.value === "categoryBased" ? f.cid : "",
                      }))
                    }
                  >
                    <option value="general">General</option>
                    <option value="festive">Festive</option>
                    <option value="categoryBased">Category based</option>
                    <option value="productBased">Product based</option>
                  </select>
                </div>
                <div>
                  <label className="lbl">Min order value (₹)</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={form.minOrderValue}
                    onChange={(e) => setForm((f) => ({ ...f, minOrderValue: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>

              {form.couponCategory === "productBased" && (
                <div>
                  <label className="lbl">Product ID (pid)</label>
                  <input
                    className="input"
                    placeholder="Mongo ObjectId of Product"
                    value={form.pid}
                    onChange={(e) => setForm((f) => ({ ...f, pid: e.target.value }))}
                    required
                  />
                </div>
              )}
              {form.couponCategory === "categoryBased" && (
                <div>
                  <label className="lbl">Category ID (cid)</label>
                  <input
                    className="input"
                    placeholder="Mongo ObjectId of Category"
                    value={form.cid}
                    onChange={(e) => setForm((f) => ({ ...f, cid: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div className="grid2">
                <div>
                  <label className="lbl">Max usage</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={form.maxUsage}
                    onChange={(e) => setForm((f) => ({ ...f, maxUsage: e.target.value }))}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label className="lbl" style={{ marginBottom: 0 }}>Active</label>
                  <input
                    type="checkbox"
                    checked={!!form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  <FiX /> Cancel
                </button>
                <button className="btn" type="submit" disabled={saving}>
                  <FiSave /> {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .card { padding: 16px; border-radius: 12px; background: #fff; box-shadow: 0 6px 18px rgba(2,6,23,0.06); margin-bottom: 16px; }
        .input { width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px; background: #fff; }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px; border: none; background: #111827; color: #fff; cursor: pointer; }
        .btn.ghost { background: #eef2ff; color: #111827; }
        .icon { border: 1px solid #e5e7eb; background: #fff; padding: 6px 8px; border-radius: 8px; cursor: pointer; }
        .icon.danger { color: #b91c1c; }
        .table-wrap { overflow: auto; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { text-align: left; padding: 8px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
        .lbl { display: block; font-size: 12px; color: #6b7280; margin-bottom: 6px; }
        .drawer { position: fixed; inset: 0; background: rgba(15,23,42,0.35); display: grid; place-items: center; z-index: 40; }
        .drawer-card { width: min(880px, 92vw); max-height: 88vh; overflow: auto; background: #fff; border-radius: 14px; padding: 16px; box-shadow: 0 24px 80px rgba(2,6,23,0.25); }
      `}</style>
    </Layout>
  );
}
