"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Lock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import {
  cities,
  colorLabel,
  colorsForVariant,
  contact,
  credit,
  models,
  responseTime,
  site,
  variants,
  waMessages,
} from "@/data/config";
import { formatRupiah, normalizeIndonesianPhone, openWhatsApp, cn } from "@/lib/utils";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/* ------------------------------------------------------------------ */
/*  SCHEMA VALIDASI                                                    */
/* ------------------------------------------------------------------ */

const schema = z
  .object({
    nama: z
      .string()
      .trim()
      .min(3, "Nama minimal 3 karakter")
      .max(80, "Nama maksimal 80 karakter")
      .regex(/^[a-zA-Z\s'.-]+$/, "Nama hanya boleh berisi huruf, spasi, titik, atau tanda hubung"),
    whatsapp: z
      .string()
      .trim()
      .min(1, "Nomor WhatsApp wajib diisi")
      .refine(
        (value) => normalizeIndonesianPhone(value) !== null,
        "Nomor WhatsApp tidak valid. Contoh: 081234567890",
      ),
    kota: z.string().trim().min(1, "Pilih kota Anda"),
    varian: z.string().trim().min(1, "Pilih varian kendaraan"),
    warna: z.string().trim().min(1, "Pilih warna kendaraan"),
    metode: z.enum(["cash", "kredit"], { message: "Pilih metode pembayaran" }),
    dpPersen: z.coerce
      .number()
      .min(credit.minDpPercent, `DP minimal ${credit.minDpPercent}%`)
      .max(credit.maxDpPercent, `DP maksimal ${credit.maxDpPercent}%`)
      .optional(),
    tukarTambah: z.enum(["ya", "tidak"], { message: "Pilih opsi tukar tambah" }),
    catatan: z.string().trim().max(500, "Catatan maksimal 500 karakter").optional().or(z.literal("")),
    // Honeypot: field ini harus tetap kosong. Bot biasanya akan mengisinya.
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.metode === "kredit" && (data.dpPersen === undefined || Number.isNaN(data.dpPersen))) {
      ctx.addIssue({
        code: "custom",
        path: ["dpPersen"],
        message: "Tentukan rencana DP Anda",
      });
    }
  });

type FormValues = z.input<typeof schema>;
type ParsedValues = z.output<typeof schema>;

/* ------------------------------------------------------------------ */
/*  KOMPONEN UTAMA                                                    */
/* ------------------------------------------------------------------ */

export function SPKForm({
  selectedVariantId,
  selectedColorId,
  isFormActive,
}: {
  selectedVariantId: string;
  selectedColorId: string;
  /** Dipakai parent untuk menyembunyikan sticky bar saat form aktif. */
  isFormActive: (active: boolean) => void;
}) {
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      nama: "",
      whatsapp: "",
      kota: "",
      varian: "",
      warna: "",
      metode: "kredit",
      dpPersen: credit.defaultDpPercent,
      tukarTambah: "tidak",
      catatan: "",
      website: "",
    },
  });

  // `useWatch` dipakai alih-alih `watch()` agar aman di React Compiler.
  const [metode, tukarTambah, varianId, warnaId, dpPercent] = useWatch({
    control,
    name: ["metode", "tukarTambah", "varian", "warna", "dpPersen"],
  });
  const dpValue = Number(dpPercent ?? credit.defaultDpPercent);

  // Varian aktif di form ini menentukan daftar warna yang offered, karena
  // tiap model punya palet warna sendiri.
  const formVariant = variants.find((item) => item.id === varianId) ?? variants[0];
  const availableColors = colorsForVariant(formVariant);

  // Isi otomatis dari pilihan di section Varian dan Warna.
  useEffect(() => {
    if (selectedVariantId) setValue("varian", selectedVariantId, { shouldValidate: false });
  }, [selectedVariantId, setValue]);

  useEffect(() => {
    if (selectedColorId) setValue("warna", selectedColorId, { shouldValidate: false });
  }, [selectedColorId, setValue]);

  // Jaga agar warna terpilih selalu milik model dari varian aktif. Warna
  // yang dibawa dari section Warna bisa jadi tidak berlaku setelah pengguna
  // mengganti varian di form ini, jadi reset ke warna pertama model itu.
  useEffect(() => {
    if (availableColors.length === 0) return;
    const isValid = availableColors.some((color) => color.id === warnaId);
    if (!isValid) {
      setValue("warna", availableColors[0].id, { shouldValidate: false });
    }
  }, [availableColors, warnaId, setValue]);

  // Beri tahu parent kapan section form benar-benar sedang dilihat, supaya
  // sticky bar mobile tidak menutupi tombol submit.
  //
  // Penting: observe section `spk`, bukan element `<form>`, karena `<form>`
  // dilepas dari DOM saat state sukses tampil - kalau itu yang di-observe,
  // sticky bar akan tetap tersembunyi selamanya setelah submit berhasil.
  useEffect(() => {
    const node = document.getElementById("spk");
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => isFormActive(entry.isIntersecting),
      // Sembunyikan sticky bar begitu area form mulai masuk viewport.
      { rootMargin: "-72px 0px -40% 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      isFormActive(false);
    };
  }, [isFormActive]);

  const onSubmit = handleSubmit(async (rawValues) => {
    setSubmitState("loading");
    setErrorMessage("");

    const data = rawValues as ParsedValues;
    const phone62 = normalizeIndonesianPhone(data.whatsapp) ?? "";

    const variant = variants.find((item) => item.id === data.varian) ?? variants[0];
    const modelPalette = colorsForVariant(variant);
    const colorIndex = modelPalette.findIndex((item) => item.id === data.warna);
    const color = modelPalette[colorIndex === -1 ? 0 : colorIndex] ?? modelPalette[0];
    // Nama warna dikirim apa adanya supaya yang tampil di Google Sheets sama
    // dengan yang dilihat pelanggan di form.
    const colorName = colorLabel(color, colorIndex === -1 ? 0 : colorIndex);

    const ringkasan = buildSummary({
      nama: data.nama,
      phone: phone62,
      kota: data.kota,
      variantName: variant.name,
      colorName,
      metode: data.metode,
      dpPersen: data.metode === "kredit" ? Number(data.dpPersen) : undefined,
      tukarTambah: data.tukarTambah,
      catatan: data.catatan,
    });

    // 1. Simpan ke Google Sheets lewat API route.
    //    Kegagalan di sini tidak membatalkan pesan WhatsApp - pengguna
    //    tetap bisa menghubungi sales secara langsung.
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: data.nama,
          whatsapp: phone62,
          whatsappRaw: data.whatsapp,
          kota: data.kota,
          varian: variant.name,
          varianId: variant.id,
          warna: colorName,
          warnaId: color.id,
          metodePembayaran: data.metode,
          dpPersen: data.metode === "kredit" ? Number(data.dpPersen) : "",
          tukarTambah: data.tukarTambah,
          catatan: data.catatan || "",
          tipeForm: "SPK",
          website: data.website ?? "",
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(body?.error ?? "Gagal menyimpan data. Silakan coba lagi.");
      }
    } catch {
      setErrorMessage(
        "Data belum tersimpan ke database, tapi tidak apa-apa - chat WhatsApp tetap terbuka.",
      );
    }

    // 2. Kirim event konversi.
    trackEvent(GA_EVENTS.spkSubmit, {
      variant: variant.name,
      color: colorName,
      metode: data.metode,
      dp_percent: data.metode === "kredit" ? Number(data.dpPersen) : undefined,
      tukar_tambah: data.tukarTambah,
    });

    // 3. Buka WhatsApp sales dengan ringkasan data.
    openWhatsApp(waMessages.spkResult(contact.salesName, ringkasan));

    // 4. Tampilkan pesan sukses.
    setSubmitState("success");
    requestAnimationFrame(() => {
      const panel = document.getElementById("spk-sukses");
      panel?.focus();
      panel?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    reset({
      nama: "",
      whatsapp: "",
      kota: "",
      varian: selectedVariantId,
      warna: selectedColorId,
      metode: "kredit",
      dpPersen: credit.defaultDpPercent,
      tukarTambah: "tidak",
      catatan: "",
      website: "",
    });
  });

  const selectedVariant = formVariant;

  return (
    <Section id="spk" tone="white" className="relative">
      {/* Latar lembut agar form menonjol dari section lain */}
      <div
        className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-50/70 to-transparent"
        aria-hidden="true"
      />

      <div className="relative">
        <SectionHeading
          eyebrow="Form Pemesanan"
          title={
            <>
              Pesan {site.brand} <span className="text-brand-600">tanpa datang dulu</span>
            </>
          }
          description="Isi form singkat di bawah. Sales kami akan menghubungi Anda untuk konfirmasi dan informasi lanjutan. Tanpa biaya, tanpa ikatan."
        />

        <div className="mx-auto mt-12 max-w-3xl">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card">
              {/* Header form */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-brand-50/60 px-5 py-4 sm:px-7">
                <div>
                  <h3 className="text-base font-extrabold text-ink sm:text-lg">
                    Surat Pemesanan Kendaraan (SPK)
                  </h3>
                  <p className="mt-0.5 text-xs text-ink/55">
                    Isi data Anda - estimasi proses konfirmasi {responseTime.onWorkingHours}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-brand-700 ring-1 ring-brand-100">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Data aman
                </span>
              </div>

              {/* Pesan sukses */}
              {submitState === "success" ? (
                <div
                  id="spk-sukses"
                  tabIndex={-1}
                  role="status"
                  className="px-5 py-10 text-center outline-none sm:px-7"
                >
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
                    <CheckCircle2 className="h-9 w-9" />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold text-ink sm:text-2xl">
                    Permintaan SPK Anda Terkirim
                  </h3>
                  <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-ink/65">
                    Detail permintaan Anda sudah tercatat.{" "}
                    <strong className="font-bold text-ink">{contact.salesName}</strong> akan
                    menghubungi Anda melalui WhatsApp dalam beberapa menit. Kalau tab WhatsApp tidak
                    terbuka otomatis, tidak masalah - sales kami tetap bisa menghubungi Anda.
                  </p>

                  <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setSubmitState("idle")}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600"
                    >
                      Isi Form Lagi
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openWhatsApp(waMessages.general(contact.salesName))
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-bold text-ink/75 transition-colors hover:border-wa/40 hover:text-[#128c4a]"
                    >
                      <MessageCircle className="h-4 w-4 fill-current" />
                      Chat Sales Sekarang
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="px-5 py-6 sm:px-7 sm:py-7"
                >
                  {/* Honeypot: disembunyikan dari pengguna & screen reader */}
                  <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("website")}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Nama Lengkap"
                      required
                      error={errors.nama?.message}
                      hint="Sesuai KTP agar SPK cepat diproses"
                    >
                      <input
                        type="text"
                        autoComplete="name"
                        placeholder="Contoh: Budi Santoso"
                        className={inputClass(errors.nama)}
                        {...register("nama")}
                      />
                    </Field>

                    <Field
                      label="Nomor WhatsApp"
                      required
                      error={errors.whatsapp?.message}
                      hint="Contoh: 081234567890"
                    >
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="0812 3456 7890"
                        className={inputClass(errors.whatsapp)}
                        {...register("whatsapp")}
                      />
                    </Field>

                    <Field label="Kota" required error={errors.kota?.message}>
                      <div className="relative">
                        <select
                          className={cn(inputClass(errors.kota), "appearance-none pr-10")}
                          defaultValue=""
                          {...register("kota")}
                        >
                          <option value="" disabled>
                            Pilih kota
                          </option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink/40" />
                      </div>
                    </Field>

                    <Field label="Varian" required error={errors.varian?.message}>
                      <div className="relative">
                        <select
                          className={cn(inputClass(errors.varian), "appearance-none pr-10")}
                          defaultValue=""
                          {...register("varian")}
                        >
                          <option value="" disabled>
                            Pilih varian
                          </option>
                          {models.map((model) => (
                            <optgroup key={model.id} label={model.fullName}>
                              {variants
                                .filter((variant) => variant.modelId === model.id)
                                .map((variant) => (
                                  <option key={variant.id} value={variant.id}>
                                    {variant.name} - {formatRupiah(variant.price)}
                                  </option>
                                ))}
                            </optgroup>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-ink/40" />
                      </div>
                    </Field>
                  </div>

                  {/* Warna */}
                  <fieldset className="mt-4">
                    <legend className="mb-2 text-sm font-bold text-ink">
                      Pilihan Warna <span className="text-accent">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color, colorIndex) => (
                        <label
                          key={color.id}
                          className="group relative flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white py-1.5 pr-3.5 pl-1.5 text-sm transition-all hover:border-brand-300 has-checked:border-brand-400 has-checked:bg-brand-50 has-checked:ring-1 has-checked:ring-brand-200"
                        >
                          <input
                            type="radio"
                            value={color.id}
                            className="sr-only"
                            {...register("warna")}
                          />
                          <span
                            className="h-5 w-5 shrink-0 rounded-full ring-1 ring-ink/10"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="font-semibold text-ink/75">{colorLabel(color, colorIndex)}</span>
                        </label>
                      ))}
                    </div>
                    {errors.warna ? (
                      <p className="mt-2 text-xs font-semibold text-red-600">
                        {errors.warna.message}
                      </p>
                    ) : null}
                  </fieldset>

                  {/* Metode pembayaran */}
                  <fieldset className="mt-5">
                    <legend className="mb-2 text-sm font-bold text-ink">
                      Metode Pembayaran <span className="text-accent">*</span>
                    </legend>
                    <div className="grid grid-cols-2 gap-2.5">
                      <RadioCard
                        value="cash"
                        current={metode}
                        onChange={(value) =>
                          setValue("metode", value as "cash" | "kredit", { shouldValidate: true })
                        }
                        title="Cash / Tunai"
                        description="Bayar penuh saat transaksi"
                      />
                      <RadioCard
                        value="kredit"
                        current={metode}
                        onChange={(value) =>
                          setValue("metode", value as "cash" | "kredit", { shouldValidate: true })
                        }
                        title="Kredit / Leasing"
                        description="Cicilan bulanan"
                      />
                    </div>
                    {errors.metode ? (
                      <p className="mt-2 text-xs font-semibold text-red-600">{errors.metode.message}</p>
                    ) : null}
                  </fieldset>

                  {/* Rencana DP - hanya saat kredit */}
                  {metode === "kredit" ? (
                    <div className="mt-4 rounded-2xl bg-brand-50/70 p-4 ring-1 ring-brand-100">
                      <div className="flex items-baseline justify-between gap-3">
                        <label htmlFor="dp" className="text-sm font-bold text-ink">
                          Rencana Down Payment (DP) <span className="text-accent">*</span>
                        </label>
                        <span className="tabular text-base font-black text-brand-700">
                          {dpValue}%
                        </span>
                      </div>

                      <input
                        id="dp"
                        type="range"
                        min={credit.minDpPercent}
                        max={credit.maxDpPercent}
                        step={5}
                        value={dpValue}
                        onChange={(event) =>
                          setValue("dpPersen", Number(event.target.value), {
                            shouldValidate: true,
                          })
                        }
                        aria-valuetext={`${dpValue} persen`}
                        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-brand-200 accent-brand-600 outline-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgb(15_122_131/0.45)] [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-600"
                      />

                      <div className="mt-2 flex justify-between text-[11px] font-semibold text-ink/45">
                        <span>{credit.minDpPercent}%</span>
                        <span>{credit.maxDpPercent}%</span>
                      </div>

                      {selectedVariant ? (
                        <p className="tabular mt-2 text-xs text-ink/55">
                          Estimasi DP:{" "}
                          <strong className="font-bold text-brand-700">
                            {formatRupiah(
                              Math.round(
                                (selectedVariant.price * dpValue) / 100,
                              ),
                            )}
                          </strong>{" "}
                          dari {formatRupiah(selectedVariant.price)}
                        </p>
                      ) : null}

                      {errors.dpPersen ? (
                        <p className="mt-2 text-xs font-semibold text-red-600">
                          {errors.dpPersen.message}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Tukar tambah */}
                  <fieldset className="mt-5">
                    <legend className="mb-2 text-sm font-bold text-ink">
                      Ada tukar tambah? <span className="text-accent">*</span>
                    </legend>
                    <div className="grid grid-cols-2 gap-2.5">
                      <RadioCard
                        value="tidak"
                        current={tukarTambah}
                        onChange={(value) =>
                          setValue("tukarTambah", value as "ya" | "tidak", {
                            shouldValidate: true,
                          })
                        }
                        title="Tidak"
                        description="Beli unit baru"
                      />
                      <RadioCard
                        value="ya"
                        current={tukarTambah}
                        onChange={(value) =>
                          setValue("tukarTambah", value as "ya" | "tidak", {
                            shouldValidate: true,
                          })
                        }
                        title="Ya, ada"
                        description="Mobil lama saya Appraisal"
                      />
                    </div>
                    {errors.tukarTambah ? (
                      <p className="mt-2 text-xs font-semibold text-red-600">
                        {errors.tukarTambah.message}
                      </p>
                    ) : null}
                  </fieldset>

                  {/* Catatan */}
                  <div className="mt-4">
                    <Field
                      label="Catatan Tambahan"
                      error={errors.catatan?.message}
                      hint="Opsional. Misalnya kota pilihan, atau waktu yang nyaman untuk test drive."
                    >
                      <textarea
                        rows={3}
                        placeholder="Contoh: ingin warna Pearl White, ready test drive akhir pekan ini"
                        className={cn(inputClass(errors.catatan), "resize-y")}
                        {...register("catatan")}
                      />
                    </Field>
                  </div>

                  {/* Error submit */}
                  {errorMessage ? (
                    <div
                      role="alert"
                      className="mt-4 flex items-start gap-2.5 rounded-2xl bg-amber-50 p-3.5 text-sm text-amber-900 ring-1 ring-amber-200"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  ) : null}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitState === "loading"}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-4 text-base font-bold text-white shadow-[0_12px_28px_-12px_rgb(15_122_131/0.9)] transition-all hover:bg-brand-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitState === "loading" ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Mengirim Permintaan...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5 fill-current" />
                        Kirim Permintaan SPK
                      </>
                    )}
                  </button>

                  <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-ink/45">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    Data Anda hanya dipakai untuk keperluan pemesanan dan tidak dibagikan ke pihak
                    ketiga.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  SUB-KOMPONEN                                                      */
/* ------------------------------------------------------------------ */

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink transition-colors placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-offset-0";

function inputClass(hasError: unknown): string {
  return cn(
    inputBase,
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-200"
      : "border-line focus:border-brand-400 focus:ring-brand-200",
  );
}

function Field({
  label,
  children,
  error,
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-ink">
        {label} {required ? <span className="text-accent">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink/45">{hint}</p>
      ) : null}
    </div>
  );
}

/** Nilai yang bisa dipilih pada kartu radio (metode pembayaran / tukar tambah). */
type RadioValue = "cash" | "kredit" | "ya" | "tidak";

function RadioCard({
  value,
  current,
  onChange,
  title,
  description,
}: {
  value: RadioValue;
  current: unknown;
  onChange: (value: RadioValue) => void;
  title: string;
  description: string;
}) {
  const isActive = current === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      onClick={() => onChange(value)}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left transition-all",
        isActive
          ? "border-brand-400 bg-brand-50 ring-1 ring-brand-200"
          : "border-line bg-white hover:border-brand-200",
      )}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2 transition-colors",
            isActive ? "border-brand-500" : "border-ink/20",
          )}
          style={{ height: 18, width: 18 }}
        >
          {isActive ? <span className="h-2 w-2 rounded-full bg-brand-500" /> : null}
        </span>
        <span className="text-sm font-bold text-ink">{title}</span>
      </span>
      <span className="mt-1 block pl-[26px] text-xs text-ink/55">{description}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  RINGKASAN PESAN WHATSAPP                                           */
/* ------------------------------------------------------------------ */

interface SummaryInput {
  nama: string;
  phone: string;
  kota: string;
  variantName: string;
  colorName: string;
  metode: string;
  dpPersen?: number;
  tukarTambah: string;
  catatan?: string;
}

function buildSummary(input: SummaryInput): string {
  const lines = [
    `*Permintaan SPK ${site.brand} ${site.model}*`,
    "",
    `Nama: ${input.nama}`,
    `WhatsApp: +${input.phone}`,
    `Kota: ${input.kota}`,
    `Varian: ${input.variantName}`,
    `Warna: ${input.colorName}`,
    `Pembayaran: ${input.metode === "kredit" ? "Kredit / Leasing" : "Cash"}`,
  ];

  if (input.metode === "kredit" && input.dpPersen !== undefined) {
    lines.push(`Rencana DP: ${input.dpPersen}%`);
  }

  lines.push(`Tukar tambah: ${input.tukarTambah === "ya" ? "Ya" : "Tidak"}`);

  if (input.catatan) {
    lines.push(`Catatan: ${input.catatan}`);
  }

  lines.push("", "Mohon informasi langkah berikutnya. Terima kasih!");

  return lines.join("\n");
}
