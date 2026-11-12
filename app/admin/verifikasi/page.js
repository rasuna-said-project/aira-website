  return (
    <main className="min-h-screen w-full bg-aira-bg">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[186px_minmax(0,1fr)]">
          {/* Sidebar Admin */}
          <AdminSidebar admin={admin} />

          {/* Konten Utama */}
          <section className="w-full min-w-0">
            <div className="mb-5">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-aira-primary sm:text-[32px]">
                Verifikasi Kontribusi
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-aira-text/55">
                Tinjau titik air kiriman warga. Hanya data terverifikasi yang
                masuk ke direktori publik.
              </p>
            </div>

            <VerificationWorkspace />
          </section>
        </div>
      </div>
    </main>
  );