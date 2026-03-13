type AdminEmptyStateProps = {
  message: string;
};

export default function AdminEmptyState({ message }: AdminEmptyStateProps) {
  return <p className="py-12 text-center text-gray-500">{message}</p>;
}
