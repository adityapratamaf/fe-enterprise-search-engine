import { useEffect, useId, useRef, useState } from "react";
import { isApiError, type SearchEngineKind } from "@/api";
import { Icon, Input, Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ImageValidationError, useImageSearch } from "../hooks/useImageSearch";
import { useSpbuSuggestions } from "../hooks/useSpbuSuggestions";

type Props = {
  keyword: string;
  engine: SearchEngineKind;
  onSubmit: (keyword: string, engine?: SearchEngineKind) => void;
};

export function SearchBar({ keyword, engine, onSubmit }: Props) {
  const [draft, setDraft] = useState(keyword);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [imageError, setImageError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const imageSearch = useImageSearch();
  const { items, isLoading } = useSpbuSuggestions(draft, open);

  /**
   * Follows the URL when it changes from outside — an example chip, a suggestion,
   * or the back button. Adjusted during render rather than in an effect so there
   * is no extra commit with a stale value on screen.
   */
  const [syncedKeyword, setSyncedKeyword] = useState(keyword);
  if (keyword !== syncedKeyword) {
    setSyncedKeyword(keyword);
    setDraft(keyword);
  }

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const submit = (value: string, nextEngine?: SearchEngineKind) => {
    setOpen(false);
    setActiveIndex(-1);
    onSubmit(value, nextEngine);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (items.length === 0) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        const delta = event.key === "ArrowDown" ? 1 : -1;
        return (current + delta + items.length) % items.length;
      });
      return;
    }

    if (event.key === "Enter") {
      const chosen = activeIndex >= 0 ? items[activeIndex] : undefined;
      submit(chosen ? chosen.nama : draft);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleFile = async (file: File) => {
    setImageError(null);
    try {
      const result = await imageSearch.mutateAsync(file);
      const derived = result.kodeSpbuTerdeteksi ?? result.kataKunci;
      if (!derived.trim()) {
        setImageError("Tidak ada teks yang dapat dibaca dari gambar ini.");
        return;
      }
      setDraft(derived);
      submit(derived, "Elasticsearch");
    } catch (error) {
      setImageError(
        error instanceof ImageValidationError
          ? error.message
          : isApiError(error)
            ? error.message
            : "Gambar gagal diproses.",
      );
    }
  };

  const showSuggestions = open && (items.length > 0 || isLoading);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative flex w-full flex-col gap-2 md:flex-row md:items-stretch">
        <div className="min-w-0 flex-1">
          <Input
            // Not type="search": that adds a native clear button beside ours.
            type="text"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            aria-label="Cari SPBU"
            placeholder="Cari nama SPBU, alamat, kota, produk..."
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            frameClassName="h-11 shadow-sm"
            leading={<Icon name="search-line" className="ml-1 text-xl text-ink-500" />}
            trailing={
              draft ? (
                <button
                  type="button"
                  onClick={() => {
                    setDraft("");
                    submit("");
                  }}
                  className="rounded-lg p-1.5 text-ink-500 hover:bg-surface-sunken"
                  aria-label="Hapus pencarian"
                >
                  <Icon name="close-line" />
                </button>
              ) : null
            }
          />
        </div>

        <label
          className={cn(
            "flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white text-brand-600 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 md:w-12",
            imageSearch.isPending && "pointer-events-none opacity-70",
          )}
        >
          <span className="sr-only">Cari berdasarkan gambar</span>
          {imageSearch.isPending ? (
            <Spinner size="sm" label="Membaca gambar" />
          ) : (
            <Icon name="camera-3-line" className="text-xl" />
          )}
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              // Reset so picking the same file twice still fires a change event.
              event.target.value = "";
              if (file) void handleFile(file);
            }}
          />
        </label>

        <button
          type="button"
          onClick={() => submit(draft, "Elasticsearch")}
          aria-pressed={engine === "Elasticsearch"}
          className={cn(
            "h-11 w-full shrink-0 rounded-xl px-4 text-sm font-bold shadow-sm transition md:w-[230px]",
            engine === "Elasticsearch"
              ? "bg-brand-600 text-white hover:bg-brand-700"
              : "border border-brand-200 bg-white text-brand-600 hover:bg-brand-50",
          )}
        >
          <Icon name="search-line" className="mr-2" />
          Cari dengan Elasticsearch
          <span className="mt-0.5 block text-[9px] font-normal opacity-85">
            Pencarian cerdas, toleransi salah ketik
          </span>
        </button>

        <button
          type="button"
          onClick={() => submit(draft, "Sql")}
          aria-pressed={engine === "Sql"}
          className={cn(
            "h-11 w-full shrink-0 rounded-xl border px-4 text-[12px] font-semibold shadow-sm transition md:w-[184px]",
            engine === "Sql"
              ? "border-brand-600 bg-brand-50 text-brand-600"
              : "border-line-500 bg-white text-ink-800 hover:bg-brand-50",
          )}
        >
          <Icon name="database-2-line" className="mr-1.5 text-lg" />
          Cari dengan SQL
          <span className="mt-0.5 block text-[9px] font-normal text-ink-500">
            Pencarian standar (LIKE)
          </span>
        </button>

        {showSuggestions && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Saran pencarian"
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-line-200 bg-white p-1 shadow-overlay md:right-[430px]"
          >
            {isLoading && items.length === 0 ? (
              <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink-500">
                <Spinner size="sm" /> Mencari saran...
              </li>
            ) : (
              items.map((item, index) => (
                <li
                  key={item.kodeSpbu}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      setDraft(item.nama);
                      submit(item.nama);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ink-700",
                      index === activeIndex ? "bg-brand-50" : "hover:bg-surface-sunken",
                    )}
                  >
                    <Icon name="search-line" className="shrink-0 text-ink-500" />
                    <span className="min-w-0 flex-1 truncate">{item.nama}</span>
                    <span className="shrink-0 text-[11px] text-ink-400">
                      {item.kota}, {item.provinsi}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {imageError && (
        <p role="alert" className="mt-2 text-left text-xs font-medium text-danger-500">
          {imageError}
        </p>
      )}
    </div>
  );
}
