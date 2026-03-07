import { useState } from 'react';
import { Card, Button, Select, Table, Th, Td, Badge } from '../../components/ui';
import { Plus, Edit, Crown, Users, TrendingUp, Check, Gift, Zap, Shield } from 'lucide-react';
import { formatCurrency, getStatusColor } from '../../utils/helpers';

const elitePlan = {
  id: 'elite',
  name: 'Bay Hawk Elite',
  tagline: 'The Only Seafood Membership That Guarantees Your Price',
  price: 1299,
  pricePerMonth: 108,
  billingCycle: 'yearly',
  members: 156,
  isActive: true,
  benefits: [
    'No surge charges on raining or peak days',
    'Free delivery from ₹349 (members) | Delivery charges applicable (non-members)',
    '₹300 Welcome cash in your Wallet',
    '10% extra bonus on premium pomfret, tiger prawns, lobster and more',
    'Priority order processing & delivery',
    'Surprises on special occasions'
  ],
  rules: [
    '1 Year subscription plan price at ₹1,299, per month ₹108',
    'Wallet cash added has the expiry time of 60 days',
    'My Profile page needs to show how much is saved & how time used through the membership',
    '10% extra offer only on selected products',
    'While checkout the non members should be notified like Elite members will save the delivery charge, 10% offer(on selected products) and surge charge(if applicable)',
    'Members can see how much they have saved while placing the order'
  ],
  marketingPoints: [
    { icon: Shield, text: 'Free delivery from ₹349. Non Members: Delivery charges apply on every order' },
    { icon: Zap, text: 'Members get priority processing & faster delivery during busy hours' },
    { icon: Gift, text: '₹300 welcome cash in your Wallet ready to use on your next order' },
    { icon: Crown, text: 'Members save 10% extra on premium cuts: pomfret, tiger prawns, lobster & more' },
    { icon: Shield, text: 'Members never pay surge pricing for the same seafood price in rain, weekends and peak hours' },
    { icon: Gift, text: 'Members get little surprises on birthdays, anniversaries and festivals just our way of saying thank you' }
  ]
};

const mockPlans = [
  { id: '1', name: 'Free', price: 0, billingCycle: 'monthly', members: 1523, features: ['Basic delivery slots', 'Standard support'], isActive: true },
];

export function MembershipPage() {
  const [planFilter, setPlanFilter] = useState('');
  const [showRules, setShowRules] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-gray-600">Manage Elite membership plans and members</p>
        </div>
        <Button><Plus className="mr-2 h-5 w-5" /> Create Plan</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-yellow-100 p-3"><Crown className="h-6 w-6 text-yellow-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Elite Members</p>
            <p className="text-2xl font-bold">{elitePlan.members}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-purple-100 p-3"><Users className="h-6 w-6 text-purple-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Free Members</p>
            <p className="text-2xl font-bold">{mockPlans[0].members}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-green-100 p-3"><TrendingUp className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-2xl font-bold">9.3%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="rounded-lg bg-blue-100 p-3"><Crown className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-600">Annual Revenue</p>
            <p className="text-2xl font-bold">₹{(elitePlan.price * elitePlan.members).toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Elite Plan Showcase */}
      <Card className="ring-2 ring-yellow-500 bg-gradient-to-br from-yellow-50 to-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-8 w-8 text-yellow-600" />
              <h2 className="text-3xl font-bold text-gray-900">{elitePlan.name}</h2>
            </div>
            <p className="text-lg text-gray-700 italic">"{elitePlan.tagline}"</p>
          </div>
          <Badge variant="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
            <Crown className="h-5 w-5 inline mr-1" />
            Elite
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-6">
          <div>
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">₹{elitePlan.price}</span>
                <span className="text-gray-600">/year</span>
              </div>
              <p className="text-lg text-gray-600">Only ₹{elitePlan.pricePerMonth}/month</p>
              <p className="text-sm text-gray-500 mt-2">{elitePlan.members} active Elite members</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-3">Benefits:</h3>
              {elitePlan.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Marketing Highlights:</h3>
            <div className="space-y-4">
              {elitePlan.marketingPoints.map((point, i) => {
                const Icon = point.icon;
                return (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <Icon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{point.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => setShowRules(!showRules)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            {showRules ? '▼' : '▶'} Rules & Conditions
          </button>
          {showRules && (
            <div className="mt-4 space-y-2 bg-blue-50 p-4 rounded-lg">
              {elitePlan.rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">{i + 1}.</span>
                  <span className="text-sm text-gray-700">{rule}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button className="flex-1"><Edit className="h-5 w-5 mr-2" /> Edit Plan</Button>
          <Button variant="secondary">View Analytics</Button>
        </div>
      </Card>

      {/* Free Plan */}
      <div className="grid gap-6 lg:grid-cols-2">
        {mockPlans.map(plan => (
          <Card key={plan.id}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
              <span className="text-gray-500">/{plan.billingCycle}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{plan.members} active members</p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" /> {feature}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1"><Edit className="h-5 w-5 mr-1" /> Edit</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Members Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Members</h2>
          <Select value={planFilter} onChange={e => setPlanFilter(e.target.value)} options={[{ value: '', label: 'All Plans' }, { value: 'free', label: 'Free' }, { value: 'elite', label: 'Elite' }]} />
        </div>
        <Table>
          <thead>
            <tr><Th>Member</Th><Th>Plan</Th><Th>Start Date</Th><Th>Renewal Date</Th><Th>Savings</Th><Th>Status</Th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'Rajesh Kumar', email: 'rajesh@email.com', plan: 'Elite', start: '2024-01-01', renewal: '2025-01-01', savings: 2450, status: 'active' },
              { name: 'Priya Sharma', email: 'priya@email.com', plan: 'Elite', start: '2023-12-15', renewal: '2024-12-15', savings: 3200, status: 'active' },
              { name: 'Arun Patel', email: 'arun@email.com', plan: 'Free', start: '2024-01-05', renewal: '-', savings: 0, status: 'active' },
            ].map((member, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <Td>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </Td>
                <Td>
                  <Badge variant={member.plan === 'Elite' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                    {member.plan === 'Elite' && <Crown className="h-3 w-3 inline mr-1" />}
                    {member.plan}
                  </Badge>
                </Td>
                <Td>{member.start}</Td>
                <Td>{member.renewal}</Td>
                <Td>{member.savings > 0 ? `₹${member.savings}` : '-'}</Td>
                <Td><Badge variant={getStatusColor(member.status)}>{member.status}</Badge></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
