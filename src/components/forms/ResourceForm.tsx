import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader as Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";
import { buildPayload, type FieldDef } from "@/lib/resources";
import { FieldInput } from "./FieldInput";

interface Props {
  fields: FieldDef[];
  defaultValues?: Record<string, any> | undefined;
  submitLabel?: string | undefined;
  onSubmit: (payload: Record<string, any> | FormData) => Promise<unknown>;
  onCancel?: (() => void) | undefined;
}

/** Reusable create/edit form: canonical field names, server-side validation shown inline. */
export function ResourceForm({ fields, defaultValues, submitLabel = "Save", onSubmit, onCancel }: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const initial: Record<string, any> = {};
  fields.forEach((f) => {
    const v = defaultValues?.[f.name];
    if (f.type === "multirelation") initial[f.name] = v ?? defaultValues?.["amenities"]?.map((a: any) => a.id) ?? [];
    else if (f.type === "checkbox") initial[f.name] = !!v;
    else if (f.type === "file") initial[f.name] = null;
    else if (f.type === "date" && typeof v === "string") initial[f.name] = v.slice(0, 10);
    else if (f.type === "datetime" && typeof v === "string") initial[f.name] = v.slice(0, 16);
    else initial[f.name] = v ?? "";
  });

  const { register, control, handleSubmit, setError, formState } = useForm({ defaultValues: initial });

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSubmit(buildPayload(fields, values));
    } catch (e) {
      if (e instanceof ApiError) {
        Object.entries(e.errors).forEach(([k, msgs]) => setError(k.replace(/\.\d+$/, ""), { message: msgs[0] ?? "" }));
        setFormError(e.message);
      } else setFormError("Something went wrong.");
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {formError && (
        <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <FieldInput key={f.name} field={f} register={register} control={control} errors={formState.errors} />
        ))}
      </div>
      <div className="flex justify-end gap-3 border-t pt-5">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <Loader2 className="animate-spin" />} {submitLabel}
        </Button>
      </div>
    </form>
  );
}
