import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    login(email || "aditya@example.com");
    navigate("/");
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[42%_58%]">
      <div className="relative flex min-h-screen items-center overflow-hidden px-7 py-10 sm:px-14 lg:px-16">
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#eaf4ff]" />
        <div className="relative mx-auto w-full max-w-[460px]">
          <img src="/pertamina-logo.png" alt="Pertamina" className="mb-16 h-12 w-[190px] object-contain object-left" />
          <div className="mb-3 h-1 w-28 bg-gradient-to-r from-red-500 via-blue-500 to-green-500" />
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#5376a3]">SPBU Search Platform</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0d2855]">Energizing a<br />Sustainable Tomorrow</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#5a759c]">Masuk untuk menjelajahi pencarian dan analitik data SPBU secara cepat, terstruktur, dan lebih bermakna.</p>
          <form onSubmit={submit} className="mt-9 space-y-4">
            <label className="block text-sm font-semibold text-[#1d3a64]">Email
              <div className="mt-1.5 flex items-center rounded-xl border border-[#ccd9e9] px-3 focus-within:border-[#5799ef] focus-within:ring-4 focus-within:ring-[#1677ff]/10">
                <i className="ri-mail-line text-lg text-[#6684a8]" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email Anda" className="h-12 w-full bg-transparent px-3 text-sm outline-none" />
              </div>
            </label>
            <label className="block text-sm font-semibold text-[#1d3a64]">Password
              <div className="mt-1.5 flex items-center rounded-xl border border-[#ccd9e9] px-3 focus-within:border-[#5799ef] focus-within:ring-4 focus-within:ring-[#1677ff]/10">
                <i className="ri-lock-line text-lg text-[#6684a8]" />
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" className="h-12 w-full bg-transparent px-3 text-sm outline-none" />
                <i className="ri-eye-line text-lg text-[#6684a8]" />
              </div>
            </label>
            <div className="flex items-center justify-between text-xs text-[#49688f]">
              <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#1677ff]" /> Ingat saya</label>
              <button type="button" className="font-semibold text-[#1268ee]">Lupa password?</button>
            </div>
            <Button type="submit" className="h-12 w-full text-sm">Masuk <i className="ri-arrow-right-line" /></Button>
          </form>
          <p className="mt-10 text-xs text-[#8195af]">© 2026 Enterprise Search Platform. All rights reserved.</p>
        </div>
      </div>
      <div className="relative hidden min-h-screen overflow-hidden lg:block">
        <img src="/spbu-default.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061b38]/85 via-[#061b38]/10 to-transparent" />
        <div className="absolute right-10 top-10 max-w-[240px] border-l border-white/60 pl-4 text-sm leading-5 text-white">Energizing a Sustainable Tomorrow</div>
        <div className="absolute bottom-10 left-10 right-10 grid grid-cols-3 gap-5 text-white">
          <div><i className="ri-search-eye-line text-2xl" /><p className="mt-2 text-sm font-bold">Akses Data Lebih Mudah</p><p className="mt-1 text-[11px] text-white/75">Temukan informasi SPBU dengan cepat dan akurat.</p></div>
          <div><i className="ri-bar-chart-grouped-line text-2xl" /><p className="mt-2 text-sm font-bold">Analitik Lebih Dalam</p><p className="mt-1 text-[11px] text-white/75">Dukung keputusan berbasis data.</p></div>
          <div><i className="ri-leaf-line text-2xl" /><p className="mt-2 text-sm font-bold">Masa Depan Berkelanjutan</p><p className="mt-1 text-[11px] text-white/75">Energi untuk Indonesia yang lebih baik.</p></div>
        </div>
      </div>
    </div>
  );
}
