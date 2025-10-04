"use client"

import { use, useEffect, useState } from "react"
import BuyerForm from "@/components/BuyerForm"
import RaffleBoard from "@/components/RaffleBoard"

export default function TokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [step, setStep] = useState<"loading" | "form" | "raffle" | "invalid" | "expired">("loading")

  useEffect(() => {
    fetch(`/api/link/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          if (!data.link.buyer_name) {
            setStep("form")
          } else {
            setStep("raffle")
          }
        } else {
          if (data.error === "link_expired") {
            setStep("expired")
          } else {
            setStep("invalid")
          }
        }
      })
  }, [token])


  if (step === "loading") return <p>Loading...</p>
  if (step === "invalid") return <p>Invalid or inactive link</p>
  if (step === "form") return <BuyerForm token={token} onComplete={() => setStep("raffle")} />
  if (step === "expired") return <p>This link has expired. Please request a new one.</p>


  return <RaffleBoard token={token} />
}
