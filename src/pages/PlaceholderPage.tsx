import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody } from "../components/ui";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10">
      <Card><CardBody className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf4ff] text-[#1268ee]"><i className="ri-dashboard-3-line text-2xl" /></div>
        <h1 className="text-2xl font-bold text-[#10264d]">{title}</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[#607b9f]">{description}</p>
        <Button className="mt-6" onClick={() => navigate("/")}>Kembali ke SPBU Search</Button>
      </CardBody></Card>
    </div>
  );
}
