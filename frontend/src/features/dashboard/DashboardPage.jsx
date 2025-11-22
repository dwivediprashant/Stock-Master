const DashboardPage = () => {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Inventory Dashboard</h1>
          <p className="page-subtitle">
            Snapshot of inventory operations. KPIs and filters will be added
            next.
          </p>
        </div>
      </header>

      <section className="placeholder-section">
        <p>
          Dashboard KPIs (Total Products, Low Stock, Pending Receipts,
          Deliveries, Internal Transfers) will appear here, powered by real
          data.
        </p>
      </section>
    </div>
  );
};

export default DashboardPage;
