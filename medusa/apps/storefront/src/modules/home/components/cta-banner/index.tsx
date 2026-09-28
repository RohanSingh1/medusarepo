import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading, Text } from "@modules/common/components/ui"

export default function CtaBanner() {
  return (
    <div className="content-container pb-12 small:pb-24">
      <div className="relative rounded-[32px] overflow-hidden bg-brand-dark min-h-[420px]">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/60 via-brand-dark to-brand-dark" />

        <div className="relative grid grid-cols-1 small:grid-cols-2 h-full pointer-events-none">
          <div className="min-h-[220px] small:min-h-[420px]" />

          <div className="relative overflow-hidden bg-brand-dark p-8 small:p-16 flex flex-col justify-center pointer-events-auto">
            <div className="absolute -top-[18%] -right-[12%] h-[300px] w-[300px] rounded-full bg-brand-primary/60 blur-2xl animate-orbit pointer-events-none" />
            <div className="absolute -bottom-[22%] -left-[10%] h-[260px] w-[260px] rounded-full bg-brand-secondary/50 blur-2xl animate-orbit-reverse pointer-events-none" />

            <Heading
              level="h2"
              className="relative text-white text-2xl-semi small:text-3xl-semi mb-4"
            >
              Make Every Drive Memorable
            </Heading>
            <Text className="relative text-white/80 mb-7">
              Complimentary express delivery. Ninety-day satisfaction
              guarantee on every bottle.
            </Text>
            <LocalizedClientLink href="/store" className="relative w-fit">
              <Button variant="primary" size="large">
                Shop the Collection
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
