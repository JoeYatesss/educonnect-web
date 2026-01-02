interface AppCardProps {
  name: string;
  chineseName: string;
  description: string;
  icon: string;
}

export default function AppCard({ name, chineseName, description, icon }: AppCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <p className="text-gray-600 font-chinese text-sm mb-2">{chineseName}</p>
          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
