import { StatusBadge } from "../shared/StatusBadge";
import { Badge } from "../ui";

export type Spbu = {
  kode: string;
  name: string;
  address: string;
  distance: string;
  rating: string;
  reviews: string;
  image: string;
  products: string[];
  facilities: string[];
};

export function SpbuResultCard({ item, onSelect }: { item: Spbu; onSelect: (item: Spbu) => void }) {
  return (
    <article className="flex gap-3 border-b border-[#e7edf5] py-3.5 last:border-b-0">
      <button onClick={() => onSelect(item)} className="h-[120px] w-[148px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <button onClick={() => onSelect(item)} className="truncate text-left text-[15px] font-bold text-[#0065e9] hover:underline">{item.name}</button>
          <span className="shrink-0 text-[11px] text-[#4f6b91]"><i className="ri-map-pin-2-line mr-1" />{item.distance}</span>
        </div>
        <div className="mt-1 flex items-start gap-1 text-[11px] leading-4 text-[#536f95]"><i className="ri-map-pin-line mt-0.5" /><span>{item.address}</span></div>
        <div className="mt-1 flex items-center gap-2 text-[11px]">
          <span className="font-bold text-[#294a70]"><i className="ri-star-fill mr-1 text-[#ffb400]" />{item.rating}</span>
          <span className="text-[#8397b1]">({item.reviews} ulasan)</span>
          <StatusBadge active />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">{item.products.map((product) => <Badge key={product}>{product}</Badge>)}</div>
        <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-[#526e93]">
          {item.facilities.map((facility) => <span key={facility}><i className={`${facility === "Mushola" ? "ri-home-4-line" : facility === "Toilet" ? "ri-men-line" : facility === "Minimarket" ? "ri-store-2-line" : facility === "ATM" ? "ri-bank-card-line" : "ri-flashlight-line"} mr-1 text-[13px]`} />{facility}</span>)}
        </div>
      </div>
    </article>
  );
}
