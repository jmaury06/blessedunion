"use client"

import { useEffect, useState } from "react"
import BuyerForm from "@/components/BuyerForm"
import RaffleBoard from "@/components/RaffleBoard"

export default function TokenPage({ params }: { params: { token: string } }) {
  const { token } = params
  const [step, setStep] = useState<"loading" | "form" | "raffle" | "invalid">("loading")

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
          setStep("invalid")
        }
      })
  }, [token])

  if (step === "loading") return <p>Loading...</p>
  if (step === "invalid") return <p>Invalid or inactive link</p>
  if (step === "form") return <BuyerForm token={token} onComplete={() => setStep("raffle")} />

  return <RaffleBoard token={token} />
}
