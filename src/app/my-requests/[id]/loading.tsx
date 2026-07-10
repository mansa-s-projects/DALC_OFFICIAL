export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cipher-void">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-cipher-rim" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cipher-gold" />
        </div>
        <p className="text-sm text-cipher-muted font-body uppercase tracking-widest">
          Loading request
        </p>
      </div>
    </div>
  )
}
