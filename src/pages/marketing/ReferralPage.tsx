import { useEffect, useState } from "react";
import { Card, Button, Input, Select, Modal, Badge } from "../../components/ui";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Share2,
  Users,
  Target,
  TrendingUp,
  Settings,
} from "lucide-react";
import { getStatusColor } from "../../utils/helpers";
import type { ReferralProgram } from "../../types";
import { referralsApi } from "../../utils/api";

const mockReferralPrograms: ReferralProgram[] = [
  {
    id: "1",
    name: "Fish Friends Referral",
    description: "Refer friends and earn rewards on fish orders",
    isActive: true,
    referrerReward: {
      type: "cashback",
      value: 100,
      unit: "₹",
      conditions: ["Friend completes first order"],
    },
    refereeReward: {
      type: "discount",
      value: 20,
      unit: "%",
      maxReward: 200,
      conditions: ["First order only"],
    },
    conditions: {
      minOrderValue: 500,
      validityDays: 30,
      maxReferrals: 10,
      requireFirstOrder: true,
      allowSelfReferral: false,
    },
    customization: {
      shareMessage:
        "Join me on FishApp and get 20% off your first order! Use my referral code.",
      landingPageTitle: "Welcome to FishApp!",
      landingPageDescription:
        "Get fresh fish delivered to your doorstep with 20% off your first order.",
      buttonText: "Claim Your Discount",
      colors: {
        primary: "#3B82F6",
        secondary: "#1E40AF",
        background: "#F8FAFC",
      },
      socialPlatforms: ["whatsapp", "facebook", "twitter", "instagram"],
    },
    totalReferrals: 1250,
    successfulReferrals: 890,
    totalRewards: 89000,
    createdBy: "Admin",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Premium Member Referral",
    description: "Exclusive referral program for premium members",
    isActive: true,
    referrerReward: {
      type: "points",
      value: 500,
      unit: "pts",
      conditions: ["Friend becomes premium member"],
    },
    refereeReward: {
      type: "free_delivery",
      value: 3,
      unit: "deliveries",
      conditions: ["Valid for 3 months"],
    },
    conditions: {
      minOrderValue: 1000,
      validityDays: 90,
      maxReferrals: 5,
      requireFirstOrder: false,
      allowSelfReferral: false,
    },
    customization: {
      shareMessage: "Upgrade to premium with me and get 3 free deliveries!",
      landingPageTitle: "Premium Fish Experience",
      landingPageDescription:
        "Join our premium membership and enjoy exclusive benefits.",
      buttonText: "Go Premium Now",
      colors: {
        primary: "#7C3AED",
        secondary: "#5B21B6",
        background: "#FAF5FF",
      },
      socialPlatforms: ["whatsapp", "email"],
    },
    totalReferrals: 340,
    successfulReferrals: 245,
    totalRewards: 122500,
    createdBy: "Admin",
    createdAt: "2024-01-15",
  },
];

interface ReferralStatsProps {
  programs: ReferralProgram[];
}

function ReferralStats({ programs }: ReferralStatsProps) {
  const activePrograms = programs.filter((p) => p.isActive).length;
  const totalReferrals = programs.reduce((sum, p) => sum + p.totalReferrals, 0);
  const successfulReferrals = programs.reduce(
    (sum, p) => sum + p.successfulReferrals,
    0,
  );
  const conversionRate =
    totalReferrals > 0
      ? ((successfulReferrals / totalReferrals) * 100).toFixed(1)
      : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Share2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Programs</p>
            <p className="text-xl font-bold">{programs.length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Programs</p>
            <p className="text-xl font-bold">{activePrograms}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Referrals</p>
            <p className="text-xl font-bold">
              {totalReferrals.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Conversion Rate</p>
            <p className="text-xl font-bold">{conversionRate}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ReferralCard({ program }: { program: ReferralProgram }) {
  const conversionRate =
    program.totalReferrals > 0
      ? ((program.successfulReferrals / program.totalReferrals) * 100).toFixed(
          1,
        )
      : "0";

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "cashback":
        return "💸";
      case "discount":
        return "💰";
      case "free_delivery":
        return "🚚";
      case "points":
        return "⭐";
      case "free_item":
        return "🎁";
      default:
        return "🎯";
    }
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex">
        {/* Left Side: Main Info */}
        <div className="flex-grow p-6 border-r">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{program.name}</h3>
            <Badge
              variant={getStatusColor(program.isActive ? "active" : "inactive")}
            >
              {program.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-4">{program.description}</p>

          <div className="grid grid-cols-1 gap-4">
            {/* Single Reward */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {getRewardIcon(program.referrerReward.type)}
                </span>
                <span className="font-semibold text-sm">Referral Reward</span>
              </div>
              <p className="font-bold text-blue-600">
                {program.referrerReward.value}
                {program.referrerReward.unit}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Stats & Actions */}
        <div className="w-64 p-6 bg-gray-50 flex flex-col justify-between">
          <div>
            <h4 className="font-semibold mb-3 text-center">Performance</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-semibold text-lg">
                  {program.totalReferrals}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="font-semibold text-lg text-green-600">
                  {program.successfulReferrals}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="font-semibold text-lg text-blue-600">
                  {conversionRate}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ReferralPage() {
  const [programs, setPrograms] = useState<ReferralProgram[]>(mockReferralPrograms);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPrograms = async () => {
      try {
        const response = await referralsApi.getPrograms();
        const programsData = response?.data?.data;

        if (!cancelled && Array.isArray(programsData) && programsData.length > 0) {
          setPrograms(programsData);
        }
      } catch {
        // Keep fallback mock data for now
      }
    };

    void loadPrograms();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" ? program.isActive : !program.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Referral Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Create and manage referral programs with custom rewards
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setShowCreateModal(true)} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create Program</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ReferralStats programs={programs} />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search referral programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </div>
      </Card>

      {/* Programs List */}
      <div className="space-y-4 sm:space-y-6">
        {filteredPrograms.map((program) => (
          <ReferralCard key={program.id} program={program} />
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <Card className="text-center py-12">
          <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No referral programs found
          </h3>
          <p className="text-gray-500">Create your first referral program</p>
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Referral Program"
      >
        <form className="space-y-4">
          <Input
            label="Program Name"
            placeholder="Fish Friends Referral"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
              rows={2}
              placeholder="Refer friends and earn rewards"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Referral Reward</h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Reward Type"
                  options={[
                    { value: "cashback", label: "Cashback" },
                    { value: "discount", label: "Discount" },
                    { value: "points", label: "Points" },
                    { value: "free_delivery", label: "Free Delivery" },
                  ]}
                />
                <Input label="Reward Value" type="number" placeholder="100" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Order Value" type="number" placeholder="500" />
            <Input label="Validity (days)" type="number" placeholder="30" />
          </div>
          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Program
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
