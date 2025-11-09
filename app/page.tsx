import { Hero } from "@/components/hero"
import { ConsultationForm } from "@/components/consultation-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2">지금 바로 시작하세요</p>
            <h2 className="text-2xl md:text-3xl font-bold text-balance">당신의 재회 가능성을 확인해보세요</h2>
          </div>
          <ConsultationForm />
        </div>
      </section>
    </main>
  )
}
