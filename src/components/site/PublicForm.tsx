import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { ResourceForm } from "@/components/forms/ResourceForm";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { FieldDef } from "@/lib/resources";

/** Public form: success is shown only after the API confirms the submission. */
export function PublicForm({
  fields, endpoint, extra, submitLabel, successTitle, successText,
}: {
  fields: FieldDef[];
  endpoint: string;
  extra?: Record<string, unknown>;
  submitLabel: string;
  successTitle: string;
  successText: string;
}) {
  const [done, setDone] = useState(false);
  if (done)
    return (
      <div role="status" className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
        <h3 className="mt-3 text-xl">{successTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{successText}</p>
        <Button variant="outline" className="mt-5" onClick={() => setDone(false)}>Send another</Button>
      </div>
    );
  return (
    <ResourceForm
      fields={fields}
      submitLabel={submitLabel}
      onSubmit={async (payload) => {
        if (payload instanceof FormData) {
          Object.entries(extra ?? {}).forEach(([k, v]) => v != null && payload.append(k, String(v)));
          await api.post(endpoint, payload);
        } else await api.post(endpoint, { ...payload, ...extra });
        setDone(true);
      }}
    />
  );
}
