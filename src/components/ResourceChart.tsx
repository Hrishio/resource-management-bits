
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Developers', allocated: 45, available: 15 },
  { name: 'Designers', allocated: 12, available: 8 },
  { name: 'Managers', allocated: 8, available: 4 },
  { name: 'QA Engineers', allocated: 15, available: 10 },
  { name: 'DevOps', allocated: 6, available: 4 }
];

const pieData = [
  { name: 'Allocated', value: 86, color: '#3b82f6' },
  { name: 'Available', value: 41, color: '#e5e7eb' }
];

export const ResourceChart = () => {
  return (
    <div className="space-y-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" />
            <Bar dataKey="available" fill="#10b981" name="Available" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Allocated Resources</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span>Available Resources</span>
        </div>
      </div>
    </div>
  );
};
