import PluxityWebGL from "@/components/pluxity/PluxityWebGL";

export default function Home() {
  return (  
      <div className="h-full justify-center flex flex-col bg-var(--background)">
          <section className="flex flex-col h-full justify-center">
            <PluxityWebGL />
          </section>
      </div>
  )
}