"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageCircle,
} from "lucide-react";
import {
  contact,
  defaultTestDriveSession,
  responseTime,
  site,
  testDrive,
  waMessages,
} from "@/data/config";
import { normalizeIndonesianPhone, openWhatsApp, todayInputValue, cn } from "@/lib/utils";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

/* ------------------------------------------------------------------ */
/*  SCHEMA                                                            */
/* ------------------------------------------------------------------ */

/**
 * Id sesi diturunkan dari `testDrive.sessions` supaya menambah atau mengubah
 * sesi di config tidak membuat form menolak semua submit.
 */
const sessionIds = testDrive.sessions.map((session) => session.id) as [
  (typeof testDrive.sessions)[number]["id"],
  ...(typeof testDrive.sessions)[number]["id"][],
];

const schema = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter")
    .max(80, "Nama maksimal 80 karakter"),
  whatsapp: z
    .string()
    .trim()
    .min(1, "Nomor WhatsApp wajib diisi")
    .refine(
      (value) => normalizeIndonesianPhone(value) !== null,
      "Nomor WhatsApp tidak valid. Contoh: 081234567890",
    ),
  tanggal: z.string().trim().min(1, "Pilih tanggal test drive"),
  sesi: z.enum(sessionIds, { message: "Pilih sesi waktu" }),
  website: z.string().optional(),
});

type FormValues = z.input<typeof schema>;

/* ------------------------------------------------------------------ */
/*  KOMPONEN                                                          */
/* ------------------------------------------------------------------ */

export function TestDriveBooking() {
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const minDate = todayInputValue();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      nama: "",
      whatsapp: "",
      tanggal: "",
      sesi: defaultTestDriveSession,
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitState("loading");
    setErrorMessage("");

    const phone62 = normalizeIndonesianPhone(data.whatsapp) ?? "";
    const session = testDrive.sessions.find((item) => item.id === data.sesi);
    const tanggalIndo = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(new Date(data.tanggal));

    const ringkasan = [
      `*Booking Test Drive ${site.brand} ${site.model}*`,
      "",
      `Nama: ${data.nama}`,
      `WhatsApp: +${phone62}`,
      `Tanggal: ${tanggalIndo}`,
      `Sesi: ${session?.label} (${session?.time})`,
      `Lokasi: ${testDrive.location}`,
    ].join("\n");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: data.nama,
          whatsapp: phone62,
          whatsappRaw: data.whatsapp,
          tanggal: data.tanggal,
          tanggalIndo,
          sesi: session?.label,
          lokasi: testDrive.location,
          tipeForm: "Test Drive",
          website: data.website ?? "",
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(body?.error ?? "Gagal menyimpan data. Silakan coba lagi.");
      }
    } catch {
      setErrorMessage(
        "Data belum tersimpan ke database, tapi chat WhatsApp tetap dibuka untuk Anda.",
      );
    }

    trackEvent(GA_EVENTS.testDriveSubmit, {
      tanggal: data.tanggal,
      sesi: data.sesi,
    });

    openWhatsApp(waMessages.testDriveResult(contact.salesName, ringkasan));
    setSubmitState("success");
    reset({ nama: "", whatsapp: "", tanggal: "", sesi: defaultTestDriveSession, website: "" });
  });

  return (
    <Section id="test-drive" tone="mist">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
        {/* Copy */}
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Test Drive"
            title={
              <>
                Rasakan langsung karakter {site.brand} {site.model} sebelum beli
              </>
            }
            description={testDrive.subtitle}
          />

          <ul className="mt-7 space-y-3.5">
            {testDrive.benefits.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink/70">
                <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-brand-500/12 text-brand-600">
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppLink
              message={waMessages.testDrive(contact.salesName)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-wa/35 bg-wa/10 px-5 py-3 text-sm font-bold text-[#128c4a] transition-colors hover:bg-wa/15"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              Tanya Jadwal via WA
            </WhatsAppLink>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-line bg-white p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/45">
                Lokasi Dealer
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink/75">{testDrive.location}</p>
              <p className="mt-1.5 text-xs text-ink/50">
                Jam buka:{" "}
                {contact.hours.map((slot) => `${slot.day} ${slot.time}`).join(" - ")}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
            <div className="flex items-center gap-3 border-b border-line bg-brand-50/60 px-5 py-4 sm:px-7">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-white">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-ink sm:text-lg">
                  Form Booking Test Drive
                </h3>
                <p className="mt-0.5 text-xs text-ink/55">
                  Konfirmasi dalam {responseTime.testDriveConfirmation}
                </p>
              </div>
            </div>

            {submitState === "success" ? (
              <div role="status" className="px-5 py-10 text-center sm:px-7">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <CheckCircle2 className="h-9 w-9" />
                </span>
                <h4 className="mt-5 text-xl font-extrabold text-ink">Jadwal Terkirim</h4>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/65">
                  Permintaan test drive Anda sudah tercatat dan chat WhatsApp ke{" "}
                  <strong className="font-bold text-ink">{contact.salesName}</strong> sudah terbuka
                  dengan ringkasan jadwal. Sales kami akan konfirmasi dalam{" "}
                  {responseTime.testDriveConfirmation}.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitState("idle")}
                  className="mt-6 rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600"
                >
                  Booking Lagi
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="px-5 py-6 sm:px-7">
                {/* Honeypot */}
                <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="td-website">Website</label>
                  <input
                    id="td-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="td-nama" className="mb-2 block text-sm font-bold text-ink">
                      Nama Lengkap <span className="text-accent">*</span>
                    </label>
                    <input
                      id="td-nama"
                      type="text"
                      autoComplete="name"
                      placeholder="Contoh: Budi Santoso"
                      className={inputClass(errors.nama)}
                      {...register("nama")}
                    />
                    {errors.nama ? (
                      <ErrorText message={errors.nama.message} />
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="td-wa"
                      className="mb-2 block text-sm font-bold text-ink"
                    >
                      Nomor WhatsApp <span className="text-accent">*</span>
                    </label>
                    <input
                      id="td-wa"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="0812 3456 7890"
                      className={inputClass(errors.whatsapp)}
                      {...register("whatsapp")}
                    />
                    {errors.whatsapp ? (
                      <ErrorText message={errors.whatsapp.message} />
                    ) : null}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="td-tanggal" className="mb-2 block text-sm font-bold text-ink">
                    Tanggal Test Drive <span className="text-accent">*</span>
                  </label>
                  <input
                    id="td-tanggal"
                    type="date"
                    min={minDate}
                    className={cn(inputClass(errors.tanggal), "block w-full")}
                    {...register("tanggal")}
                  />
                  {errors.tanggal ? (
                    <ErrorText message={errors.tanggal.message} />
                  ) : (
                    <p className="mt-1.5 text-xs text-ink/45">
                      Minimal H-1 dari hari ini agar kami bisa menyiapkan unit.
                    </p>
                  )}
                </div>

                <fieldset className="mt-4">
                  <legend className="mb-2 text-sm font-bold text-ink">
                    Sesi Waktu <span className="text-accent">*</span>
                  </legend>
                  <input type="hidden" {...register("sesi")} />
                  <div className="grid grid-cols-3 gap-2">
                    {testDrive.sessions.map((session) => (
                      <label
                        key={session.id}
                        className="cursor-pointer rounded-xl border border-line bg-white px-2 py-2.5 text-center transition-all hover:border-brand-300 has-checked:border-brand-400 has-checked:bg-brand-50 has-checked:ring-1 has-checked:ring-brand-200"
                      >
                        <input
                          type="radio"
                          value={session.id}
                          defaultChecked={session.id === defaultTestDriveSession}
                          className="sr-only"
                          {...register("sesi")}
                        />
                        <span className="block text-sm font-bold text-ink">{session.label}</span>
                        <span className="mt-0.5 block text-[10px] text-ink/50">
                          {session.time}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.sesi ? <ErrorText message={errors.sesi.message} /> : null}
                </fieldset>

                {errorMessage ? (
                  <div
                    role="alert"
                    className="mt-4 flex items-start gap-2.5 rounded-2xl bg-amber-50 p-3.5 text-sm text-amber-900 ring-1 ring-amber-200"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-4 text-base font-bold text-white shadow-[0_12px_28px_-12px_rgb(15_122_131/0.9)] transition-all hover:bg-brand-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitState === "loading" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="h-5 w-5" />
                      Booking Test Drive
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  SUB-KOMPONEN                                                      */
/* ------------------------------------------------------------------ */

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink transition-colors placeholder:text-ink/35 focus:outline-none focus:ring-2";

function inputClass(hasError: unknown): string {
  return cn(
    inputBase,
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
      : "border-line focus:border-brand-400 focus:ring-brand-200",
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}