import { useQuery } from "@tanstack/react-query";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, toPaginated } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";
import { humanize } from "@/lib/format";
import { relationLabels, resources, type FieldDef } from "@/lib/resources";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

function useRelationOptions(relation?: string) {
  const endpoint =
    relation === "amenities"
      ? endpoints.admin.amenities
      : endpoints.admin.resource(resources[relation ?? ""]?.endpoint ?? relation ?? "");
  return useQuery({
    queryKey: ["options", relation],
    enabled: !!relation,
    queryFn: async () => toPaginated<any>(await api.get(endpoint, { per_page: 100 })).data,
    staleTime: 60_000,
  });
}

interface Props {
  field: FieldDef;
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
}

export function FieldInput({ field, register, control, errors }: Props) {
  const err = errors[field.name]?.message as string | undefined;
  const id = `f-${field.name}`;
  const needsOptions = field.type === "relation" || field.type === "multirelation";
  const opts = useRelationOptions(needsOptions ? field.relation : undefined);
  const labelFor = relationLabels[field.relation ?? ""] ?? ((r: any) => r.name ?? `#${r.id}`);
  const rules = { required: field.required ? `${field.label} is required` : false };

  let control_el: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control_el = <Textarea id={id} rows={5} {...register(field.name, rules)} aria-invalid={!!err} />;
      break;
    case "select":
      control_el = (
        <select id={id} className={selectClass} {...register(field.name, rules)} aria-invalid={!!err}>
          <option value="">Select…</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>{humanize(o)}</option>
          ))}
        </select>
      );
      break;
    case "relation":
      control_el = (
        <select id={id} className={selectClass} {...register(field.name, rules)} aria-invalid={!!err} disabled={opts.isLoading}>
          <option value="">{opts.isLoading ? "Loading…" : opts.isError ? "Couldn't load options" : "Select…"}</option>
          {opts.data?.map((r: any) => (
            <option key={r.id} value={r.id}>{labelFor(r)}</option>
          ))}
        </select>
      );
      break;
    case "multirelation":
      control_el = (
        <Controller
          control={control}
          name={field.name}
          render={({ field: f }) => {
            const value: number[] = (f.value ?? []).map(Number);
            if (opts.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
            if (opts.isError) return <p className="text-sm text-destructive">Couldn't load options.</p>;
            return (
              <div className="grid grid-cols-2 gap-2 rounded-md border p-3 sm:grid-cols-3">
                {opts.data?.map((r: any) => (
                  <label key={r.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={value.includes(Number(r.id))}
                      onCheckedChange={(c) =>
                        f.onChange(c ? [...value, Number(r.id)] : value.filter((v) => v !== Number(r.id)))
                      }
                    />
                    {labelFor(r)}
                  </label>
                ))}
                {!opts.data?.length && <p className="text-sm text-muted-foreground">No options available.</p>}
              </div>
            );
          }}
        />
      );
      break;
    case "checkbox":
      control_el = (
        <Controller
          control={control}
          name={field.name}
          render={({ field: f }) => (
            <div className="flex h-9 items-center gap-2">
              <Checkbox id={id} checked={!!f.value} onCheckedChange={(c) => f.onChange(!!c)} />
              <span className="text-sm text-muted-foreground">Yes</span>
            </div>
          )}
        />
      );
      break;
    case "file":
      control_el = (
        <Controller
          control={control}
          name={field.name}
          render={({ field: f }) => (
            <Input id={id} type="file" accept="image/*" onChange={(e) => f.onChange(e.target.files?.[0] ?? null)} />
          )}
        />
      );
      break;
    default: {
      const type =
        field.type === "decimal" ? "text" : field.type === "datetime" ? "datetime-local" : field.type;
      control_el = (
        <Input
          id={id}
          type={type}
          inputMode={field.type === "decimal" ? "decimal" : undefined}
          {...register(field.name, {
            ...rules,
            pattern: field.type === "decimal" ? { value: /^\d+(\.\d{1,2})?$/, message: "Enter a valid amount, e.g. 2500000.00" } : undefined,
          })}
          aria-invalid={!!err}
        />
      );
    }
  }

  return (
    <div className={field.span === 2 ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
      <Label htmlFor={id}>
        {field.label} {field.required && <span className="text-primary">*</span>}
      </Label>
      {control_el}
      {field.help && !err && <p className="text-xs text-muted-foreground">{field.help}</p>}
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}
