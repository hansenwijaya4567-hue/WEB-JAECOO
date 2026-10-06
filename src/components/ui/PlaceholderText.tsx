import { isPlaceholder } from "@/data/config";
import { cn } from "@/lib/utils";

/**
 * Render teks yang masih placeholder dengan gaya yang jelas "menunggu data",
 * bukan tampilannya seperti data rusak.
 *
 * dipakai untuk konten yang nilainya memang belum ada - spesifikasi,
 * warna, promo, testimoni - sehingga halaman tetap bisa direview tanpa
 * menampilkan `[ISI SPESIFIKASI]` ke pengunjung.
 */
export function PlaceholderText({
  value,
  className,
  fallback = "Data belum dimuat",
}: {
  value: string;
  className?: string;
  fallback?: string;
}) {
  if (!isPlaceholder(value)) {
    return <>{value}</>;
  }

  return (
    <span className={cn("text-ink/35 italic", className)} data-placeholder="true">
      {fallback}
    </span>
  );
}
