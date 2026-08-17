import { Surface } from "@/components/ui/surface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ELEVATIONS = ["none", "1", "2", "3", "4", "5"] as const;
const RADII = ["8", "12", "16", "20", "24"] as const;

export default function SurfaceDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <div className="flex flex-col gap-8">
        <h1 className="text-title2 font-semibold text-neutral-10">
          Surface — generic container
        </h1>
        <p className="text-subheadline text-neutral-6">
          Không port từ Figma — DS này không có khung chứa chung. Dựng từ token
          sẵn có (nền trắng + radius + elevation + padding) để prototype có chỗ
          gom nội dung. Xem doc comment trong{" "}
          <code className="text-brand-red">surface.tsx</code>.
        </p>
      </div>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Elevation (shadow-1..5)
        </h2>
        <div className="flex flex-wrap gap-20 bg-neutral-1 p-24">
          {ELEVATIONS.map((e) => (
            <Surface key={e} elevation={e} padding="16" className="w-160">
              <p className="text-caption1 font-medium text-neutral-8">
                elevation={e}
              </p>
            </Surface>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Radius (multiples of 4)
        </h2>
        <div className="flex flex-wrap gap-16">
          {RADII.map((r) => (
            <Surface key={r} radius={r} bordered padding="16" className="w-120">
              <p className="text-caption1 text-neutral-6">rounded-{r}</p>
            </Surface>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Holding real content
        </h2>
        <Surface elevation="2" padding="20" className="flex flex-col gap-16">
          <div className="flex items-center justify-between">
            <h3 className="text-title3 font-semibold text-neutral-10">
              Tài khoản thanh toán
            </h3>
            <Badge variant="green">Đang hoạt động</Badge>
          </div>
          <p className="text-body text-neutral-6">
            Số dư khả dụng: <span className="font-semibold text-neutral-10">12.480.000đ</span>
          </p>
          <Button fullWidth>Chuyển tiền</Button>
        </Surface>
      </section>
    </main>
  );
}
