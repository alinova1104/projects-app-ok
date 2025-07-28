export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      <p className="mt-4 text-muted-foreground">Ekip üyeleri yükleniyor...</p>
    </div>
  )
}
