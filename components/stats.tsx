import { Heart, Users, TrendingUp } from "lucide-react"

export function Stats() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 depth-md">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="mb-2 text-3xl font-bold">10,000+</div>
              <div className="text-sm text-muted-foreground">누적 상담 건수</div>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 depth-md">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="mb-2 text-3xl font-bold">73%</div>
              <div className="text-sm text-muted-foreground">평균 재회 성공률</div>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 depth-md">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="mb-2 text-3xl font-bold">4.8/5.0</div>
              <div className="text-sm text-muted-foreground">사용자 만족도</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
