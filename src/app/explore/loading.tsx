export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-luxury-black">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-luxury-gold border-t-transparent" />
        <p className="text-sm text-gray-400 uppercase tracking-widest">
          Loading explore...
        </p>
      </div>
    </div>
  );
}
