const markers = [
  { x: "62%", y: "31%", tone: "red" }, { x: "71%", y: "28%", tone: "red" }, { x: "54%", y: "43%", tone: "blue" },
  { x: "45%", y: "51%", tone: "red" }, { x: "67%", y: "57%", tone: "red" }, { x: "59%", y: "69%", tone: "red" },
];

export function PreviewMap() {
  return (
    <div className="relative h-[260px] overflow-hidden rounded-xl bg-[#e9f1e8]">
      <div className="absolute inset-0 opacity-90" style={{ backgroundImage: "linear-gradient(30deg, rgba(255,255,255,.8) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.8) 87.5%, rgba(255,255,255,.8)), linear-gradient(150deg, rgba(255,255,255,.7) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.7) 87.5%, rgba(255,255,255,.7)), linear-gradient(30deg, rgba(255,255,255,.5) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.5) 87.5%, rgba(255,255,255,.5)), linear-gradient(150deg, rgba(255,255,255,.5) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,.5) 87.5%, rgba(255,255,255,.5)), linear-gradient(60deg, #d8ead2 25%, #cfe4cc 25%, #cfe4cc 75%, #d8ead2 75%)", backgroundSize: "80px 140px" }} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#dcefe8]/50 via-transparent to-[#f6ead0]/50" />
      <div className="absolute left-[12%] top-[18%] text-[10px] font-medium text-[#54705c]">Tangerang</div>
      <div className="absolute left-[44%] top-[44%] text-sm font-bold text-[#283e4f]">Jakarta</div>
      <div className="absolute left-[48%] top-[64%] text-[10px] text-[#54705c]">Jakarta Selatan</div>
      {markers.map((m, index) => <div key={index} className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ${m.tone === "blue" ? "bg-[#1976ef]" : "bg-[#e54b3f]"}`} style={{ left: m.x, top: m.y }} />)}
      <div className="absolute bottom-2 left-2 rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-medium text-[#1760ba] shadow"><i className="ri-map-pin-2-line mr-1" /> Buka di Google Maps ↗</div>
      <div className="absolute right-2 top-2 flex flex-col overflow-hidden rounded-lg border border-[#d6e1ed] bg-white shadow-sm">
        <button className="h-9 w-9 text-[#3d587a]">+</button><div className="h-px bg-[#e5ebf3]" /><button className="h-9 w-9 text-[#3d587a]">−</button>
      </div>
    </div>
  );
}
