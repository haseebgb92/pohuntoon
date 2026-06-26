"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  "Business",
  "Contact",
  "Funding",
  "Documents",
  "Review",
];

type LeadWizardState = {
  company: string;
  industry: string;
  website: string;
  businessAgeYears: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  requestedAmount: string;
  fundingPurpose: string;
  notes: string;
};

const initialState: LeadWizardState = {
  company: "",
  industry: "",
  website: "",
  businessAgeYears: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  requestedAmount: "",
  fundingPurpose: "",
  notes: "",
};

export function LeadWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [values, setValues] = useState<LeadWizardState>(initialState);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const progress = useMemo(() => Math.round((step / steps.length) * 100), [step]);

  useEffect(() => {
    const raw = window.localStorage.getItem("pohuntoon-lead-draft");
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as { leadId?: string; values?: LeadWizardState; step?: number };
      if (parsed.values) {
        setValues(parsed.values);
      }
      if (parsed.leadId) {
        setLeadId(parsed.leadId);
      }
      if (parsed.step) {
        setStep(parsed.step);
      }
    } catch {
      window.localStorage.removeItem("pohuntoon-lead-draft");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("pohuntoon-lead-draft", JSON.stringify({ leadId, values, step }));
  }, [leadId, values, step]);

  function updateValue(name: keyof LeadWizardState, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function saveDraft(nextStep = step) {
    const endpoint = leadId ? `/api/leads/${leadId}` : "/api/leads";
    const response = await fetch(endpoint, {
      method: leadId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, currentStep: nextStep }),
    });
    const payload = await response.json().catch(() => ({ error: "Unable to save draft." }));

    if (!response.ok) {
      throw new Error(payload.error || "Unable to save draft.");
    }

    if (payload.leadId) {
      setLeadId(payload.leadId);
    }

    return String(payload.leadId || leadId);
  }

  async function goToStep(nextStep: number) {
    setSubmitting(true);
    setMessage(null);
    try {
      await saveDraft(nextStep);
      setStep(nextStep);
      setMessage("Draft autosaved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to autosave draft.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitLead() {
    setSubmitting(true);
    setMessage(null);
    try {
      const id = await saveDraft(5);
      const response = await fetch(`/api/leads/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => ({ error: "Unable to submit lead." }));

      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit lead.");
      }

      window.localStorage.removeItem("pohuntoon-lead-draft");
      router.push(`/app/leads/${id}`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit lead.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5 rounded-3xl border border-border bg-white p-4 shadow-[0_18px_45px_rgba(23,43,77,0.08)] sm:p-6">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {steps.map((label, index) => (
            <button
              className={`min-h-11 rounded-2xl px-3 text-sm font-medium ${step === index + 1 ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}
              disabled={submitting}
              key={label}
              onClick={() => goToStep(index + 1)}
              type="button"
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>
        <div className="h-2 rounded-full bg-surface-strong">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {message ? <p className="rounded-2xl bg-surface px-3 py-2 text-sm text-muted-foreground">{message}</p> : null}

      {step === 1 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Company" name="company" onChange={updateValue} required value={values.company} />
          <Field label="Industry" name="industry" onChange={updateValue} value={values.industry} />
          <Field label="Website" name="website" onChange={updateValue} placeholder="https://example.com" value={values.website} />
          <Field label="Business age" name="businessAgeYears" onChange={updateValue} type="number" value={values.businessAgeYears} />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" name="contactName" onChange={updateValue} required value={values.contactName} />
          <Field label="Email" name="contactEmail" onChange={updateValue} required type="email" value={values.contactEmail} />
          <Field label="Phone" name="contactPhone" onChange={updateValue} value={values.contactPhone} />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-4">
          <Field label="Requested amount" name="requestedAmount" onChange={updateValue} required type="number" value={values.requestedAmount} />
          <Field label="Purpose" name="fundingPurpose" onChange={updateValue} required value={values.fundingPurpose} />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="notes">Notes</label>
            <textarea className="min-h-32 w-full rounded-2xl border border-input px-3 py-2 text-sm" id="notes" onChange={(event) => updateValue("notes", event.target.value)} value={values.notes} />
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface/60 p-6">
          <label className="block text-sm font-medium text-foreground" htmlFor="wizard-files">Documents</label>
          <p className="mt-2 text-sm text-muted-foreground">Add documents after submission from the workspace. Mobile devices can use camera upload.</p>
          <input accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp,.zip" capture="environment" className="mt-4 block w-full rounded-2xl border border-input bg-white px-3 py-2 text-sm" id="wizard-files" multiple type="file" />
        </div>
      ) : null}

      {step === 5 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(values).map(([key, value]) => (
            <div className="rounded-2xl border border-border bg-surface/60 p-4" key={key}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{value || "Not provided"}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="sticky bottom-20 flex flex-wrap gap-3 rounded-3xl border border-border bg-white/95 p-3 shadow-lg backdrop-blur md:static md:border-0 md:p-0 md:shadow-none">
        {step > 1 ? (
          <button className="min-h-11 rounded-2xl border border-border px-4 text-sm font-medium" disabled={submitting} onClick={() => goToStep(step - 1)} type="button">
            Back
          </button>
        ) : null}
        {step < 5 ? (
          <button className="min-h-11 rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60" disabled={submitting} onClick={() => goToStep(step + 1)} type="button">
            {submitting ? "Saving..." : "Save and continue"}
          </button>
        ) : (
          <button className="min-h-11 rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60" disabled={submitting} onClick={submitLead} type="button">
            {submitting ? "Submitting..." : "Submit lead"}
          </button>
        )}
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: keyof LeadWizardState;
  onChange: (name: keyof LeadWizardState, value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
};

function Field({ label, name, onChange, placeholder, required, type = "text", value }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground" htmlFor={name}>{label}</label>
      <input
        className="h-11 w-full rounded-2xl border border-input px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        id={name}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </div>
  );
}
