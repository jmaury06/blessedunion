import RaffleBoard from "./components/RaffleBoard"

export default function Home() {
  // aquí en futuro podrías obtener el token dinámicamente del link
  const token = "testtoken123"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Blessed Union Raffle</h1>
      <RaffleBoard token={token} />
    </main>
  )
}
