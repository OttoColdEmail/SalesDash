import { AdCampaign } from '../data/types';

interface AdCampaignsTableProps {
  campaigns: AdCampaign[];
}

const platformColors = {
  Meta: 'bg-blue-100 text-blue-700',
  Google: 'bg-red-100 text-red-700',
  LinkedIn: 'bg-sky-100 text-sky-700',
  TikTok: 'bg-gray-900 text-white',
};

const statusColors = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-700',
};

export default function AdCampaignsTable({ campaigns }: AdCampaignsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Paid Ad Campaigns</h3>
        <p className="text-sm text-gray-500">Performance across all advertising platforms</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Spend</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Clicks</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">CPC</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Calls Booked</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Cost/Call</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-medium text-gray-900">{campaign.name}</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${platformColors[campaign.platform]}`}>
                    {campaign.platform}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${statusColors[campaign.status]}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-gray-900">
                  {formatCurrency(campaign.spend)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-gray-600">
                  {formatNumber(campaign.clicks)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-gray-600">
                  {formatCurrency(campaign.cpc)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900">
                  {campaign.callsBooked}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-gray-600">
                  {formatCurrency(campaign.costPerCall)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-medium">
              <td className="px-6 py-3 text-gray-900" colSpan={3}>Total</td>
              <td className="px-6 py-3 text-right text-gray-900">
                {formatCurrency(campaigns.reduce((sum, c) => sum + c.spend, 0))}
              </td>
              <td className="px-6 py-3 text-right text-gray-600">
                {formatNumber(campaigns.reduce((sum, c) => sum + c.clicks, 0))}
              </td>
              <td className="px-6 py-3 text-right text-gray-600">—</td>
              <td className="px-6 py-3 text-right text-gray-900">
                {campaigns.reduce((sum, c) => sum + c.callsBooked, 0)}
              </td>
              <td className="px-6 py-3 text-right text-gray-600">
                {formatCurrency(campaigns.reduce((sum, c) => sum + c.spend, 0) / campaigns.reduce((sum, c) => sum + c.callsBooked, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
