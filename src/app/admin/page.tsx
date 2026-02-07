export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Omzet vandaag</p>
          <p className="text-2xl font-bold">€0,00</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Bestellingen</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Klanten</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Voorraadwaarschuwingen</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
