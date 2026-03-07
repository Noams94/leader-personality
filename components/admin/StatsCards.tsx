interface StatsCardsProps {
  total: number;
  leaders: number;
  followers: number;
  today: number;
  byLocale: { en: number; he: number };
}

export default function StatsCards({ total, leaders, followers, today, byLocale }: StatsCardsProps) {
  const cards = [
    { label: 'Total Submissions', value: total, color: 'text-blue-600' },
    { label: 'Leader (self)', value: leaders, color: 'text-purple-600' },
    { label: 'Follower (supervisor)', value: followers, color: 'text-indigo-600' },
    { label: 'Today', value: today, color: 'text-green-600' },
    { label: 'English', value: byLocale.en, color: 'text-gray-600' },
    { label: 'Hebrew', value: byLocale.he, color: 'text-gray-600' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 mb-1">{c.label}</p>
          <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
