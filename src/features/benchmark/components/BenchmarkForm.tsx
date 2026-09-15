import { Button, Card, Checkbox, Icon, Input, Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";
import { NUMBER_INPUT_CLASS } from "../data";
import type { BenchmarkFormState } from "../types";

const FIELD_LABEL = "mb-1.5 block text-[12px] font-semibold text-ink-700";
const FRAME_CLASS = "rounded-xl border-line-300";

type Props = {
  form: BenchmarkFormState;
  onChange: (patch: Partial<BenchmarkFormState>) => void;
  advancedOpen: boolean;
  onToggleAdvanced: () => void;
  onSubmit: () => void;
  isRunning: boolean;
};

export function BenchmarkForm({
  form,
  onChange,
  advancedOpen,
  onToggleAdvanced,
  onSubmit,
  isRunning,
}: Props) {
  const keywordEmpty = form.keyword.trim() === "";

  return (
    <Card className="shadow-none">
      <form
        className="p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-[2]">
            <label className={FIELD_LABEL} htmlFor="benchmark-keyword">
              Kata Kunci Pencarian
            </label>
            <Input
              id="benchmark-keyword"
              inputSize="lg"
              frameClassName={FRAME_CLASS}
              placeholder="Cari nama SPBU, alamat, kota, produk..."
              value={form.keyword}
              onChange={(event) => onChange({ keyword: event.target.value })}
              leading={<Icon name="search-line" className="ml-1 text-lg text-ink-500" />}
            />
          </div>

          <div className="min-w-0 flex-[2]">
            <label className={FIELD_LABEL} htmlFor="benchmark-location">
              Lokasi (Opsional)
            </label>
            <Input
              id="benchmark-location"
              inputSize="lg"
              frameClassName={FRAME_CLASS}
              placeholder="Masukkan kota atau koordinat"
              value={form.location}
              onChange={(event) => onChange({ location: event.target.value })}
              leading={<Icon name="map-pin-line" className="ml-1 text-lg text-ink-500" />}
            />
          </div>

          <div className="w-full lg:w-[140px] lg:shrink-0">
            <label className={FIELD_LABEL} htmlFor="benchmark-radius">
              Radius (km)
            </label>
            <Input
              id="benchmark-radius"
              type="number"
              min={1}
              inputSize="lg"
              frameClassName={FRAME_CLASS}
              className={NUMBER_INPUT_CLASS}
              value={form.radiusKm}
              onChange={(event) => onChange({ radiusKm: event.target.value })}
            />
          </div>

          <button
            type="button"
            onClick={onToggleAdvanced}
            aria-expanded={advancedOpen}
            className={cn(
              "flex h-12 shrink-0 items-center gap-1.5 px-1 text-[13px] font-medium transition lg:h-12",
              advancedOpen ? "text-brand-700" : "text-ink-600 hover:text-brand-700",
            )}
          >
            <Icon name="filter-3-line" className="text-lg" />
            Filter Lanjutan
          </button>

          <Button
            type="submit"
            size="lg"
            disabled={isRunning || keywordEmpty}
            className="w-full lg:w-auto lg:shrink-0"
          >
            {isRunning ? (
              <>
                <Spinner size="sm" className="text-white" />
                Menjalankan...
              </>
            ) : (
              <>
                <Icon name="play-line" />
                Jalankan Benchmark
              </>
            )}
          </Button>
        </div>

        {advancedOpen && (
          <div className="mt-4 grid grid-cols-1 gap-3.5 border-t border-line-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={FIELD_LABEL} htmlFor="benchmark-rating-min">
                Rating Minimal
              </label>
              <Input
                id="benchmark-rating-min"
                type="number"
                min={1}
                max={5}
                step={0.1}
                inputSize="md"
                frameClassName={FRAME_CLASS}
                className={NUMBER_INPUT_CLASS}
                placeholder="Semua rating"
                value={form.ratingMin}
                onChange={(event) => onChange({ ratingMin: event.target.value })}
              />
            </div>

            <div>
              <label className={FIELD_LABEL} htmlFor="benchmark-ulasan-min">
                Jumlah Ulasan Minimal
              </label>
              <Input
                id="benchmark-ulasan-min"
                type="number"
                min={0}
                inputSize="md"
                frameClassName={FRAME_CLASS}
                className={NUMBER_INPUT_CLASS}
                placeholder="Semua ulasan"
                value={form.ulasanMin}
                onChange={(event) => onChange({ ulasanMin: event.target.value })}
              />
            </div>

            <div>
              <label className={FIELD_LABEL} htmlFor="benchmark-iterasi">
                Iterasi Pengukuran
              </label>
              <Input
                id="benchmark-iterasi"
                type="number"
                min={1}
                max={10}
                inputSize="md"
                frameClassName={FRAME_CLASS}
                className={NUMBER_INPUT_CLASS}
                value={form.iterasi}
                onChange={(event) => onChange({ iterasi: event.target.value })}
              />
            </div>

            <div className="flex items-end pb-2.5">
              <label
                htmlFor="benchmark-warmup"
                className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-700"
              >
                <Checkbox
                  id="benchmark-warmup"
                  checked={form.warmup}
                  onChange={(event) => onChange({ warmup: event.target.checked })}
                />
                Lakukan pemanasan sebelum mengukur
              </label>
            </div>
          </div>
        )}
      </form>
    </Card>
  );
}
