import { Heading } from "@modules/common/components/ui"

const STEPS = [
  {
    n: "01",
    title: "Vent mount",
    body: "A weighted stainless clip grips the blade without rattling. Rotates 30 degrees so the bottle stays level on any vent angle.",
    pin: { top: "38%", left: "24%" },
  },
  {
    n: "02",
    title: "Intensity collar",
    body: "Three positions control the aperture. Turn down in winter when the heater carries scent further, up in summer.",
    pin: { top: "62%", left: "55%" },
  },
  {
    n: "03",
    title: "Sealed reservoir",
    body: "No spill, no leak, no evaporation when parked. The wick draws only when air moves across it.",
    pin: { top: "28%", left: "76%" },
  },
]

export default function InsideTheCar() {
  return (
    <div className="bg-brand-cream">
      <div className="content-container py-12 small:py-24">
        <div className="mb-9">
          <span className="font-display text-large-semi text-brand-primary">
            Inside the Car
          </span>
          <Heading level="h2" className="text-2xl-semi small:text-3xl-semi mt-2">
            Where it lives
          </Heading>
        </div>
        <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
          <div className="relative rounded-[24px] overflow-hidden min-h-[320px] small:min-h-[400px] bg-gradient-to-br from-brand-purple via-brand-dark to-brand-purple">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary shadow-[0_0_0_8px_rgba(231,71,119,0.28)] flex items-center justify-center text-small-semi text-white"
                style={{ top: step.pin.top, left: step.pin.left }}
              >
                {step.n.replace("0", "")}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 justify-center">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="p-6 rounded-large bg-white shadow-elevation-card-rest"
              >
                <div className="text-xsmall-regular uppercase tracking-wide text-brand-purple mb-2">
                  {step.n} — {step.title}
                </div>
                <p className="text-ui-fg-subtle">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
