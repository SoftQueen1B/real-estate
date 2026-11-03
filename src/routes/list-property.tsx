"use client";
import { CircleCheck as CheckCircle2, ImagePlus, Loader as Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldInput } from "@/components/forms/FieldInput";
import { PageHero, PublicLayout } from "@/components/site/SiteChrome";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/api-error";
import { endpoints } from "@/lib/endpoints";
import { PROPERTY_TYPES, type FieldDef } from "@/lib/resources";

const FIELDS: FieldDef[] = [
  { name: "owner_name", label: "Your name", type: "text", required: true },
  { name: "owner_email", label: "Email", type: "email", required: true },
  { name: "owner_phone", label: "Phone", type: "tel", required: true },
  { name: "preferred_contact_method", label: "Preferred contact method", type: "select", options: ["email", "phone", "whatsapp"], required: true },
  { name: "property_title", label: "Property title", type: "text", required: true, span: 2 },
  { name: "property_type", label: "Property type", type: "select", options: PROPERTY_TYPES, required: true },
  { name: "listing_purpose", label: "Listing purpose", type: "select", options: ["sale", "rent", "lease"], required: true },
  { name: "address_line", label: "Address", type: "text", required: true, span: 2 },
  { name: "city", label: "City", type: "text", required: true },
  { name: "state", label: "State", type: "text", required: true },
  { name: "bedrooms", label: "Bedrooms", type: "number" },
  { name: "bathrooms", label: "Bathrooms", type: "number" },
  { name: "land_size", label: "Land size", type: "decimal" },
  { name: "floor_area", label: "Floor area", type: "decimal" },
  { name: "asking_price", label: "Asking price", type: "decimal", required: true },
  { name: "currency", label: "Currency", type: "select", options: ["NGN", "USD", "GBP"], required: true },
  { name: "description", label: "Description", type: "textarea", required: true, span: 2 },
];

const MAX_MB = 5;

export function ListProperty() {
  const { register, control, handleSubmit, setError, formState, watch, setValue } = useForm<any>({ defaultValues: { currency: "NGN", consent_to_contact: false } });
  const [files, setFiles] = useState<File[]>([]);
  const [fileErr, setFileErr] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const consent = watch("consent_to_contact");

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const ok: File[] = [];
    for (const f of Array.from(list)) {
      if (!f.type.startsWith("image/")) { setFileErr(`${f.name} is not an image.`); continue; }
      if (f.size > MAX_MB * 1024 * 1024) { setFileErr(`${f.name} is larger than ${MAX_MB}MB.`); continue; }
      ok.push(f);
    }
    setFiles((prev) => [...prev, ...ok].slice(0, 12));
  };

  const submit = handleSubmit(async (values) => {
    setFormErr(null);
    if (!values.consent_to_contact) { setError("consent_to_contact", { message: "Please agree to be contacted." }); return; }
    const fd = new FormData();
    FIELDS.forEach((f) => { const v = values[f.name]; if (v !== undefined && v !== null && v !== "") fd.append(f.name, String(v)); });
    fd.append("consent_to_contact", "1");
    files.forEach((f) => fd.append("images[]", f));
    try {
      await api.post(endpoints.public.propertySubmissions, fd);
      setDone(true);
    } catch (e) {
      if (e instanceof ApiError) {
        Object.entries(e.errors).forEach(([k, m]) => k.startsWith("images") ? setFileErr(m[0] ?? null) : setError(k, { message: m[0] ?? "" }));
        setFormErr(e.message);
      }
    }
  });

  return (
    <PublicLayout>
      <PageHero eyebrow="List with Lena" title="Submit your property for review" description="Our team will review your details and get in touch. Submissions are not published automatically." />
      <div className="container-page max-w-4xl py-14">
        {done ? (
          <div role="status" className="rounded-xl border border-success/30 bg-success/5 p-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h2 className="mt-4 text-3xl">Submission received</h2>
            <p className="mt-2 text-muted-foreground">Thank you. A member of our team will review your property and contact you.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-8 rounded-2xl border bg-card p-6 shadow-card md:p-10">
            {formErr && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{formErr}</div>}
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((f) => <FieldInput key={f.name} field={f} register={register} control={control} errors={formState.errors} />)}
            </div>
            <div>
              <p className="text-sm font-medium">Photos</p>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-sm text-muted-foreground hover:border-gold">
                <ImagePlus className="h-8 w-8 text-gold" /> Click to add images (JPG/PNG, up to {MAX_MB}MB each)
                <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { setFileErr(null); addFiles(e.target.files); e.target.value = ""; }} />
              </label>
              {fileErr && <p className="mt-2 text-xs text-destructive">{fileErr}</p>}
              {files.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {files.map((f, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-md bg-muted">
                      <img src={URL.createObjectURL(f)} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                      <button type="button" aria-label="Remove image" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-background/90 p-1"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <label className="flex items-start gap-3 text-sm">
              <Checkbox checked={!!consent} onCheckedChange={(c) => setValue("consent_to_contact", !!c)} />
              <span>I agree to be contacted by Lena Real Estate about this property. <span className="text-primary">*</span></span>
            </label>
            {formState.errors["consent_to_contact"] && <p className="-mt-6 text-xs text-destructive">{String(formState.errors["consent_to_contact"]?.message)}</p>}
            <div className="flex justify-end"><Button type="submit" size="lg" disabled={formState.isSubmitting}>{formState.isSubmitting && <Loader2 className="animate-spin" />} Submit for review</Button></div>
          </form>
        )}
      </div>
    </PublicLayout>
  );
}
