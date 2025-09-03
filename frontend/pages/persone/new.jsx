export default function NewPerson() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4">Nuova Persona</h1>
      <form className="flex flex-col gap-4 w-64">
        <input type="text" placeholder="Nome" className="border p-2 rounded" />
        <input type="text" placeholder="Cognome" className="border p-2 rounded" />
        <input type="email" placeholder="Email" className="border p-2 rounded" />
        <input type="text" placeholder="Indirizzo" className="border p-2 rounded" />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Crea</button>
      </form>
    </main>
  );
}
