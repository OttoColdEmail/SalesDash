import { EmailCampaign } from '../data/types';

interface EmailCampaignsTableProps {
  campaigns: EmailCampaign[];
}

const statusColors = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-700',
};

export default function EmailCampaignsTable({ campaigns }: EmailCampaignsTableProps) {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Cold Email Campaigns</h3>
        <p className="text-sm text-gray-500">Outreach performance and reply rates</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Sent</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Delivered</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Open Rate</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Replies</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Reply Rate</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Calls Booked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="font-medium text-gray-900">{campaign.name}</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${statusColors[campaign.status]}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-gray-600">
                  {formatNumber(campaign.sent)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-gray-600">
                  {formatNumber(campaign.delivered)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span className={campaign.openRate >= 30 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                    {formatPercent(campaign.openRate)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-gray-600">
                  {formatNumber(campaign.replied)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span className={campaign.replyRate >= 4 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                    {formatPercent(campaign.replyRate)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900">
                  {campaign.callsBooked}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-medium">
              <td className="px-6 py-3 text-gray-900" colSpan={2}>Total</td>
              <td className="px-6 py-3 text-right text-gray-600">
                {formatNumber(campaigns.reduce((sum, c) => sum + c.sent, 0))}
              </td>
              <td className="px-6 py-3 text-right text-gray-600">
                {formatNumber(campaigns.reduce((sum, c) => sum + c.delivered, 0))}
              </td>
              <td className="px-6 py-3 text-right text-gray-600">
                {formatPercent(campaigns.reduce((sum, c) => sum + c.opened, 0) / campaigns.reduce((sum, c) => sum + c.delivered, 0) * 100)}
              </td>
              <td className="px-6 py-3 text-right text-gray-600">
                {formatNumber(campaigns.reduce((sum, c) => sum + c.replied, 0))}
              </td>
              <td className="px-6 py-3 text-right text-gray-600">
                {formatPercent(campaigns.reduce((sum, c) => sum + c.replied, 0) / campaigns.reduce((sum, c) => sum + c.sent, 0) * 100)}
              </td>
              <td className="px-6 py-3 text-right text-gray-900">
                {campaigns.reduce((sum, c) => sum + c.callsBooked, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
